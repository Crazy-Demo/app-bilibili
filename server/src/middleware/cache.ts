import { LRUCache } from 'lru-cache'
import type { Request, Response, NextFunction } from 'express'

const cache = new LRUCache<string, any>({ max: 500, ttl: 1000 * 60 * 5 })

export function cacheMiddleware(ttlMs: number = 5 * 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.originalUrl
    const cached = cache.get(key)
    if (cached) return res.json(cached)
    const originalJson = res.json.bind(res)
    res.json = (body: any) => {
      if (res.statusCode === 200) cache.set(key, body, { ttl: ttlMs })
      return originalJson(body)
    }
    next()
  }
}
export { cache }
