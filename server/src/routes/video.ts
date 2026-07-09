import { Router } from 'express'
import { validateQuery } from '../middleware/validate'
import { cacheMiddleware } from '../middleware/cache'
import { videoQuerySchema } from '../schemas/video'
import { getFeed, getVideoDetail, getPlayUrl, getComments, getRelated } from '../services/bilibili'

const router = Router()

// GET /api/video/feed
router.get('/feed', validateQuery(videoQuerySchema), cacheMiddleware(30 * 1000), async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, sort = 'hot' } = req.query as any
    const result = await getFeed(Number(page), Number(pageSize), sort)
    return res.json(result)
  } catch (err) {
    next(err)
  }
})

// GET /api/video/:bvid
router.get('/:bvid', async (req, res, next) => {
  try {
    const result = await getVideoDetail(req.params.bvid)
    return res.json(result)
  } catch (err) {
    next(err)
  }
})

// GET /api/video/:bvid/playurl
router.get('/:bvid/playurl', async (req, res, next) => {
  try {
    const result = await getPlayUrl(req.params.bvid)
    return res.json(result)
  } catch (err) {
    next(err)
  }
})

// GET /api/video/:bvid/comments
router.get('/:bvid/comments', async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1
    const pageSize = Number(req.query.pageSize) || 10
    const result = await getComments(req.params.bvid, page, pageSize)
    return res.json(result)
  } catch (err) {
    next(err)
  }
})

// GET /api/video/:bvid/related
router.get('/:bvid/related', async (req, res, next) => {
  try {
    const result = await getRelated(req.params.bvid)
    return res.json(result)
  } catch (err) {
    next(err)
  }
})

export default router
