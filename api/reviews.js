// Public client reviews, stored in Upstash Redis.
//   GET    /api/reviews          -> { reviews: [...] } newest first
//   POST   /api/reviews          -> publish a review { name, rating, service, text }
//   DELETE /api/reviews?id=...   -> remove a review (header x-admin-key: REVIEWS_ADMIN_KEY)
import { redisFromEnv } from './_store.js'

const KEY = 'reviews'
const MAX_STORED = 200
const PER_IP_PER_HOUR = 3
const SERVICES = ['government', 'clearing', 'attestation', 'verification', 'manpower', 'banking']

const clean = (v) => String(v ?? '').replace(/\s+/g, ' ').trim()

export function validate(body) {
  const name = clean(body.name)
  const text = clean(body.text)
  const service = clean(body.service)
  const rating = Number(body.rating)
  if (clean(body.website)) return { error: 'spam' } // honeypot field, hidden from people
  if (name.length < 2 || name.length > 40) return { error: 'name' }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { error: 'rating' }
  if (service && !SERVICES.includes(service)) return { error: 'service' }
  if (text.length < 10 || text.length > 600) return { error: 'text' }
  if (/https?:\/\/|www\.|\.(com|net|org|ru|xyz)\b/i.test(text + ' ' + name)) return { error: 'links' }
  return { review: { name, rating, service, text } }
}

export function createHandler(getStore, env = process.env) {
  return async function handler(req, res) {
    const store = getStore()
    if (!store) return res.status(503).json({ error: 'not_configured' })

    try {
      if (req.method === 'GET') {
        const raw = await store.lrange(KEY, 0, 99)
        const reviews = raw.map((r) => JSON.parse(r))
        res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=60')
        return res.status(200).json({ reviews })
      }

      if (req.method === 'POST') {
        const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
        const { review, error } = validate(body)
        if (error === 'spam') return res.status(201).json({ ok: true }) // quietly ignore bots
        if (error) return res.status(400).json({ error })

        const ip = String(req.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim()
        const rlKey = `rl:reviews:${ip}`
        const count = await store.incr(rlKey)
        if (count === 1) await store.expire(rlKey, 3600)
        if (count > PER_IP_PER_HOUR) return res.status(429).json({ error: 'rate_limited' })

        const saved = {
          id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
          ...review,
          createdAt: new Date().toISOString(),
        }
        await store.lpush(KEY, JSON.stringify(saved))
        await store.ltrim(KEY, 0, MAX_STORED - 1)
        return res.status(201).json({ review: saved })
      }

      if (req.method === 'DELETE') {
        const adminKey = env.REVIEWS_ADMIN_KEY
        if (!adminKey || req.headers['x-admin-key'] !== adminKey) return res.status(401).json({ error: 'unauthorized' })
        const id = clean(req.query?.id)
        const raw = await store.lrange(KEY, 0, -1)
        const match = raw.find((r) => JSON.parse(r).id === id)
        if (!match) return res.status(404).json({ error: 'not_found' })
        await store.lrem(KEY, 1, match)
        return res.status(200).json({ ok: true })
      }

      res.setHeader('Allow', 'GET, POST, DELETE')
      return res.status(405).json({ error: 'method_not_allowed' })
    } catch (err) {
      console.error('reviews api', err)
      return res.status(500).json({ error: 'server' })
    }
  }
}

export default createHandler(() => redisFromEnv())
