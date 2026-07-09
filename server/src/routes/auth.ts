import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { validateBody } from '../middleware/validate'
import { loginSchema } from '../schemas/auth'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

const mockUser = {
  userId: 1,
  username: 'testuser',
  nickname: '测试用户',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=testuser',
}

// POST /api/auth/login
router.post('/login', validateBody(loginSchema), (req, res) => {
  const { username, password } = req.body

  // Accept any username/password for dev
  if (username === 'testuser' && password !== 'test123456') {
    return res.status(401).json({ code: 401, message: '用户名或密码错误' })
  }

  const token = jwt.sign({ userId: mockUser.userId, username: mockUser.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions)

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  return res.json({
    code: 0,
    message: '登录成功',
    data: { user: mockUser, token },
  })
})

// POST /api/auth/logout
router.post('/logout', (_req, res) => {
  res.clearCookie('token')
  return res.json({ code: 0, message: '已退出登录' })
})

// GET /api/auth/me
router.get('/me', (req, res) => {
  // authMiddleware already set req.user
  return res.json({
    code: 0,
    message: 'success',
    data: { user: { ...mockUser, userId: (req as any).user?.userId } },
  })
})

// POST /api/auth/refresh
router.post('/refresh', (req, res) => {
  const token = req.cookies?.token
  if (!token) {
    return res.status(401).json({ code: 401, message: '未登录' })
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string }
    const newToken = jwt.sign({ userId: decoded.userId, username: decoded.username }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions)

    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.json({ code: 0, message: 'Token 已刷新', data: { token: newToken } })
  } catch {
    return res.status(401).json({ code: 401, message: '登录已过期' })
  }
})

export default router
