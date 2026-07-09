import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const WHITELIST = ['/api/auth/login', '/api/auth/logout', '/api/auth/refresh',
  '/api/health', '/api/video/feed', '/api/search', '/api/search/hot', '/api/search/suggest']

function isWhitelisted(path: string): boolean {
  return WHITELIST.some(w => path.startsWith(w))
    || /^\/api\/video\/BV[a-zA-Z0-9]+$/.test(path)
    || /^\/api\/video\/BV[a-zA-Z0-9]+\/(playurl|comments|related)/.test(path)
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (isWhitelisted(req.originalUrl)) return next()
  const token = req.cookies?.token
  if (!token) return res.status(401).json({ code: 401, message: '未登录' })
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
    ;(req as any).user = decoded
    next()
  } catch {
    return res.status(401).json({ code: 401, message: '登录已过期' })
  }
}
