import { ContentSection } from '../components/content-section'
import { ProfileForm } from './profile-form'
import { useLanguage } from '@/context/language-provider'

export function SettingsProfile() {
  const { language } = useLanguage()
  const english = language === 'en'
  return (
    <ContentSection
      title={english ? 'Profile' : 'Profil'}
      desc={english ? 'This is how others will see you on the site.' : 'Boshqalar sizni saytda qanday ko‘rishini sozlang.'}
    >
      <ProfileForm />
    </ContentSection>
  )
}
