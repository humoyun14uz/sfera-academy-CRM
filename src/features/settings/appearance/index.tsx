import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'
import { useLanguage } from '@/context/language-provider'

export function SettingsAppearance() {
  const { language } = useLanguage()
  const english = language === 'en'
  return (
    <ContentSection
      title={english ? 'Appearance' : 'Ko‘rinish'}
      desc={english ? 'Customize the app appearance and theme.' : 'Ilova ko‘rinishi va mavzusini sozlang.'}
    >
      <AppearanceForm />
    </ContentSection>
  )
}
