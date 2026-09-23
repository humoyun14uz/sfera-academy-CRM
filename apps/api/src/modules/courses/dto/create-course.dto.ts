import { z } from 'zod'

export const createCourseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z.string().min(2, 'Code must be at least 2 characters'),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  description: z.string().optional(),
  durationMonths: z.number().int().min(1, 'Duration must be at least 1 month'),
  price: z.number().min(0, 'Price must be non-negative'),
})

export type CreateCourseDto = z.infer<typeof createCourseSchema>
