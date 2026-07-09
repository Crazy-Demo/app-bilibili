import { Router } from 'express'
import { getUserProfile } from '../services/bilibili'

const router = Router()

// GET /api/user/me
router.get('/me', (req, res) => {
  return res.json({
    code: 0,
    message: 'success',
    data: {
      user: {
        userId: (req as any).user?.userId,
        username: 'testuser',
        nickname: '测试用户',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=testuser',
        level: 6,
        following: 128,
        followers: 9999,
        likes: 88888,
      },
    },
  })
})

// GET /api/user/:uid/profile
router.get('/:uid/profile', async (req, res, next) => {
  try {
    const uid = Number(req.params.uid)
    const result = await getUserProfile(uid)
    return res.json(result)
  } catch (err) {
    next(err)
  }
})

// POST /api/user/:uid/follow
router.post('/:uid/follow', (req, res) => {
  const uid = Number(req.params.uid)
  return res.json({
    code: 0,
    message: '关注成功',
    data: { following: true, uid },
  })
})

export default router
