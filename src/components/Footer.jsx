import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { CONTACT, LICENSE, SOCIAL } from '../data/site'
import BrandIcon from './BrandIcons'
import PhoneLink from './PhoneLink'

const SOCIAL_LABELS = { linkedin: 'LinkedIn', instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok' }

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="bg-navy-900 text-white/75">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <img src="/logo-light.png" alt={t.brand.name} width="244" height="217" loading="lazy" className="h-28 w-auto" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">{t.footer.about}</p>
          <p className="mb-3 mt-7 text-xs font-bold uppercase tracking-wider text-white/50 rtl:normal-case rtl:tracking-normal">
            {t.footer.follow}
          </p>
          <div className="flex gap-2">
            {Object.entries(SOCIAL)
              .filter(([, href]) => href && href !== '#')
              .map(([name, href]) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={SOCIAL_LABELS[name]}
                className="flex h-9 w-9 items-center justify-center rounded border border-white/15 text-white/80 transition-colors hover:border-gold hover:text-gold"
              >
                <BrandIcon name={name} />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 lg:ps-8">
          <h2 className="mb-4 text-sm font-bold text-white">{t.footer.links}</h2>
          <ul className="space-y-2.5 text-sm">
            <li><Link className="hover:text-gold" to="/">{t.nav.home}</Link></li>
            <li><Link className="hover:text-gold" to="/services">{t.nav.services}</Link></li>
            <li><Link className="hover:text-gold" to="/about-contact">{t.nav.about}</Link></li>
            <li><Link className="hover:text-gold" to="/about-contact#contact">{t.nav.quote}</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2 lg:col-span-5">
          <h2 className="mb-4 text-sm font-bold text-white">{t.footer.contact}</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.75} />
              <span>{t.contact.details.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.75} />
              <span className="flex flex-wrap gap-x-4 gap-y-1">
                {CONTACT.phones.map((p) => (
                  <PhoneLink key={p.tel} phone={p} className="hover:text-gold" />
                ))}
              </span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.75} />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-gold">{CONTACT.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-2 py-5 text-xs text-white/50 md:flex-row md:justify-between md:gap-6 md:pe-24">
          <p>{t.footer.rights}</p>
          <p>
            {t.footer.license} <span dir="ltr">{LICENSE.number}</span>
          </p>
        </div>
        {/* Extra end padding keeps the credit clear of the floating WhatsApp button */}
        <div className="container flex flex-col gap-2 pb-24 text-[11px] text-white/40 md:flex-row md:justify-between md:gap-6 md:pb-6 md:pe-24">

          <p>{t.footer.approval}</p>
          <p className="shrink-0">
            {t.footer.credit}{' '}
            <a
              href="https://begintech.co"
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="font-semibold text-white/60 hover:text-gold"
            >
              begintech.co
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
