import { z } from 'zod'

export const videoQuerySchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional().default(10),
  sort: z.enum(['hot', 'new']).optional().default('hot'),
})
