import { toast } from 'sonner'
import { getCookie } from '@/lib/cookies'

/**
 * Legacy demo helper kept for existing forms. It confirms an action without
 * exposing raw form payloads or implementation details to the user.
 */
export function showSubmittedData(
  _data: unknown,
  title?: string
) {
  toast.success(title ?? (getCookie('sfera-language') === 'en' ? 'Saved successfully.' : 'Muvaffaqiyatli saqlandi.'))
}
