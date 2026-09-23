import { z } from 'zod'

export const createAcademySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email format').optional(),
  address: z.string().optional(),
})

export type CreateAcademyDto = z.infer<typeof createAcademySchema>
