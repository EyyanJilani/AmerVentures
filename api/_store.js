// Reviews storage on Supabase (Postgres), via its REST API — no extra dependencies.
// Needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (server-side only, never sent to the browser).
// Table: see supabase/reviews.sql

const COLUMNS = 'id,name,rating,service,text,created_at'

const toReview = (row) => ({
  id: row.id,
  name: row.name,
  rating: row.rating,
  service: row.service || '',
  text: row.text,
  createdAt: row.created_at,
})

export function supabaseFromEnv(env = process.env) {
  const url = (env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
  const key = env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null

  const api = async (path, { method = 'GET', body, prefer } = {}) => {
    const res = await fetch(`${url}/rest/v1/${path}`, {
      method,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        ...(prefer ? { Prefer: prefer } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const text = await res.text()
    const data = text ? JSON.parse(text) : null
    if (!res.ok) throw new Error(`Supabase ${res.status}: ${data?.message || text}`)
    return data
  }

  return {
    async list(limit) {
      const rows = await api(`reviews?select=${COLUMNS}&order=created_at.desc&limit=${limit}`)
      return rows.map(toReview)
    },
    async countSince(ipHash, sinceIso) {
      const rows = await api(`reviews?select=id&ip_hash=eq.${encodeURIComponent(ipHash)}&created_at=gte.${encodeURIComponent(sinceIso)}`)
      return rows.length
    },
    async add(review, ipHash) {
      const rows = await api(`reviews?select=${COLUMNS}`, {
        method: 'POST',
        body: { ...review, service: review.service || null, ip_hash: ipHash },
        prefer: 'return=representation',
      })
      return toReview(rows[0])
    },
    async remove(id) {
      const rows = await api(`reviews?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE', prefer: 'return=representation' })
      return rows.length > 0
    },
  }
}

// In-memory store with the same interface (local dev and tests).
export function memoryStore() {
  const rows = []
  let n = 0
  return {
    list: async (limit) => rows.slice(0, limit).map(toReview),
    countSince: async (ipHash, sinceIso) => rows.filter((r) => r.ip_hash === ipHash && r.created_at >= sinceIso).length,
    async add(review, ipHash) {
      const row = { id: `dev-${++n}`, ...review, ip_hash: ipHash, created_at: new Date().toISOString() }
      rows.unshift(row)
      return toReview(row)
    },
    async remove(id) {
      const i = rows.findIndex((r) => r.id === id)
      if (i < 0) return false
      rows.splice(i, 1)
      return true
    },
  }
}
