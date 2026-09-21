import { createFileRoute } from '@tanstack/react-router'
import { TermsOfService } from '@/features/auth/legal-pages'

export const Route = createFileRoute('/(auth)/terms')({ component: TermsOfService })
