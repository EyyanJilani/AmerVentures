import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev only: serve /api/reviews from the real handler with an in-memory store,
// so the review form works with `npm run dev` (Vercel runs the real one in production).
function devReviewsApi() {
  const lists = {}
  const nums = {}
  const store = {
    lrange: async (k, a, b) => (lists[k] || []).slice(a, b === -1 ? undefined : b + 1),
    lpush: async (k, v) => void (lists[k] ||= []).unshift(v),
    ltrim: async (k, a, b) => void (lists[k] = (lists[k] || []).slice(a, b + 1)),
    lrem: async (k, c, v) => void lists[k]?.splice(lists[k].indexOf(v), 1),
    incr: async (k) => (nums[k] = (nums[k] || 0) + 1),
    expire: async () => 1,
  }
  return {
    name: 'dev-reviews-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/reviews', async (req, res) => {
        const { createHandler } = await server.ssrLoadModule('/api/reviews.js')
        let raw = ''
        for await (const chunk of req) raw += chunk
        const shim = {
          status(code) {
            res.statusCode = code
            return shim
          },
          setHeader: (k, v) => res.setHeader(k, v),
          json(data) {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return shim
          },
        }
        const query = Object.fromEntries(new URL(req.url, 'http://x').searchParams)
        await createHandler(() => store, { REVIEWS_ADMIN_KEY: 'dev' })({ method: req.method, headers: req.headers, body: raw, query }, shim)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), devReviewsApi()],
})
