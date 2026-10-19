import { useLang } from '../i18n/LanguageContext'
import { waLink } from '../data/site'
import BrandIcon from './BrandIcons'

export default function WhatsAppFloat() {
  const { t } = useLang()
  return (
    <a
      href={waLink(t.whatsappFloat.message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsappFloat.label}
      title={t.whatsappFloat.label}
      className="fixed bottom-5 end-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-soft transition-transform duration-200 hover:scale-105 md:bottom-7 md:end-7"
    >
      <BrandIcon name="whatsapp" className="h-7 w-7" />
    </a>
  )
}
