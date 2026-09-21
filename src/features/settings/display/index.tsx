import { ContentSection } from '../components/content-section'
import { DisplayForm } from './display-form'
import { useLanguage } from '@/context/language-provider'

export function SettingsDisplay() {
  const { language } = useLanguage()
  const english = language === 'en'
  return (
    <ContentSection
      title={english ? 'Display' : 'Displey'}
      desc={english ? "Turn items on or off to control what's displayed." : 'Ilovada ko‘rsatiladigan elementlarni boshqaring.'}
    >
      <DisplayForm />
    </ContentSection>
  )
}
