import { Phone } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { CALL_PHONE, waLink } from '../data/site'
import BrandIcon from './BrandIcons'
import Reveal from './Reveal'

export default function CtaBand() {
  const { t } = useLang()
  return (
    <section className="pattern-star-navy bg-gold">
      <Reveal className="container grid items-center gap-8 py-14 md:py-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="text-2xl font-extrabold leading-tight md:text-[32px]">{t.cta.title}</h2>
          <p className="mt-3 max-w-xl text-navy/80">{t.cta.body}</p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:col-span-5 lg:justify-end">
          <a href={waLink(t.cta.message)} target="_blank" rel="noopener noreferrer" className="btn-navy px-6 py-3.5">
            <BrandIcon name="whatsapp" className="h-5 w-5 text-whatsapp" />
            {t.cta.whatsapp}
          </a>
          <a href={`tel:${CALL_PHONE.tel}`} className="inline-flex items-center gap-2 text-sm font-bold text-navy hover:underline">
            <Phone className="h-4 w-4" strokeWidth={1.75} />
            {t.cta.or} <span dir="ltr">{CALL_PHONE.display}</span>
          </a>
        </div>
      </Reveal>
    </section>
  )
}
