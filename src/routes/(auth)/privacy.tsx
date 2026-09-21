import { createFileRoute } from '@tanstack/react-router'
import { PrivacyPolicy } from '@/features/auth/legal-pages'

export const Route = createFileRoute('/(auth)/privacy')({ component: PrivacyPolicy })
