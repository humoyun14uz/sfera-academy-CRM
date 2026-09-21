import { ContentSection } from '../components/content-section'
import { NotificationsForm } from './notifications-form'
import { useLanguage } from '@/context/language-provider'

export function SettingsNotifications() {
  const { language } = useLanguage()
  const english = language === 'en'
  return (
    <ContentSection
      title={english ? 'Notifications' : 'Bildirishnomalar'}
      desc={english ? 'Configure how you receive notifications.' : 'Bildirishnomalarni qanday olishni sozlang.'}
    >
      <NotificationsForm />
    </ContentSection>
  )
}
