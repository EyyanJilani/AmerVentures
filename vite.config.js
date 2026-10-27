import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev only: serve /api/reviews from the real handler with an in-memory store,
// so the review form works with `npm run dev` (Vercel runs the real one in production).
function devReviewsApi() {
  let store
  return {
    name: 'dev-reviews-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/reviews', async (req, res) => {
        const { createHandler } = await server.ssrLoadModule('/api/reviews.js')
        const { memoryStore } = await server.ssrLoadModule('/api/_store.js')
        store ||= memoryStore()
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
