import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'
import { useLanguage } from '@/context/language-provider'

export function SettingsAccount() {
  const { language } = useLanguage()
  const english = language === 'en'
  return (
    <ContentSection
      title={english ? 'Account' : 'Hisob'}
      desc={english ? 'Update your account settings, language, and timezone.' : 'Hisob, til va vaqt mintaqasi sozlamalarini yangilang.'}
    >
      <AccountForm />
    </ContentSection>
  )
}
