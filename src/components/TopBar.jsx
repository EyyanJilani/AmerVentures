import { BadgeCheck, Mail, Phone } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { CONTACT, LICENSE } from '../data/site'

// Thin info strip above the sticky header (desktop only).
export default function TopBar() {
  const { t } = useLang()
  return (
    <div className="hidden bg-navy-900 text-xs text-white/70 lg:block">
      <div className="container flex h-9 items-center justify-between gap-6">
        <p className="flex items-center gap-2">
          <BadgeCheck className="h-3.5 w-3.5 text-gold" strokeWidth={1.75} />
          {t.topbar.license} <span dir="ltr" className="font-sans font-semibold text-white/90">{LICENSE.number}</span>
        </p>
        <div className="flex items-center gap-6">
          <a href={`tel:${CONTACT.phones[0].tel}`} className="flex items-center gap-2 hover:text-gold">
            <Phone className="h-3.5 w-3.5 text-gold" strokeWidth={1.75} />
            <span dir="ltr">{CONTACT.phones[0].display}</span>
          </a>
          <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:text-gold">
            <Mail className="h-3.5 w-3.5 text-gold" strokeWidth={1.75} />
            {CONTACT.email}
          </a>
        </div>
      </div>
    </div>
  )
}
