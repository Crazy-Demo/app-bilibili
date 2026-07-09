import { Router } from 'express'
import { validateQuery } from '../middleware/validate'
import { cacheMiddleware } from '../middleware/cache'
import { searchQuerySchema } from '../schemas/search'
import { search, getHotSearch, getSearchSuggest } from '../services/bilibili'

const router = Router()

// GET /api/search
router.get('/', validateQuery(searchQuerySchema), async (req, res, next) => {
  try {
    const { keyword, page = 1 } = req.query as any
    const result = await search(String(keyword), Number(page))
    return res.json(result)
  } catch (err) {
    next(err)
  }
})

// GET /api/search/hot
router.get('/hot', cacheMiddleware(60 * 1000), async (_req, res, next) => {
  try {
    const result = await getHotSearch()
    return res.json(result)
  } catch (err) {
    next(err)
  }
})

// GET /api/search/suggest
router.get('/suggest', async (req, res, next) => {
  try {
    const keyword = String(req.query.keyword || '')
    const result = await getSearchSuggest(keyword)
    return res.json(result)
  } catch (err) {
    next(err)
  }
})

export default router
