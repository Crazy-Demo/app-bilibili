import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ code: 400, message: '参数错误', errors: result.error.flatten().fieldErrors })
    }
    req.body = result.data
    next()
  }
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      return res.status(400).json({ code: 400, message: '参数错误', errors: result.error.flatten().fieldErrors })
    }
    // Express 5 makes req.query a getter-only property; use defineProperty to override
    Object.defineProperty(req, 'query', {
      value: result.data,
      writable: true,
      configurable: true,
    })
    next()
  }
}
