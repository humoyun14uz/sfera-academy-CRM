import { z } from 'zod'
import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

const SignIn = lazyRouteComponent(
  () => import('@/features/auth/sign-in'),
  'SignIn'
)

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignIn,
  validateSearch: searchSchema,
})
