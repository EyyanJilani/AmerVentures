// Minimal Upstash Redis REST client (no extra dependencies).
// Vercel's Upstash integration sets KV_REST_API_URL / KV_REST_API_TOKEN;
// a direct Upstash database uses UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN.

export function redisFromEnv(env = process.env) {
  const url = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL
  const token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  const cmd = async (...args) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    })
    const data = await res.json()
    if (!res.ok || data.error) throw new Error(data.error || `Redis HTTP ${res.status}`)
    return data.result
  }

  return {
    lrange: (key, start, stop) => cmd('LRANGE', key, start, stop),
    lpush: (key, value) => cmd('LPUSH', key, value),
    ltrim: (key, start, stop) => cmd('LTRIM', key, start, stop),
    lrem: (key, count, value) => cmd('LREM', key, count, value),
    incr: (key) => cmd('INCR', key),
    expire: (key, seconds) => cmd('EXPIRE', key, seconds),
  }
}
