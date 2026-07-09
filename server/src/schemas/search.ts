import { z } from 'zod'

export const searchQuerySchema = z.object({
  keyword: z.string().min(1).max(100),
  page: z.coerce.number().optional().default(1),
})
