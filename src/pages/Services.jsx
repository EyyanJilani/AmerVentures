import { Check } from 'lucide-react'
import { useLang, useSeo } from '../i18n/LanguageContext'
import { ACTIVITY_CODES, SERVICE_KEYS, img, waLink } from '../data/site'
import { SERVICE_ICONS } from '../data/icons'
import BrandIcon from '../components/BrandIcons'
import Reveal from '../components/Reveal'
import CtaBand from '../components/CtaBand'

function ServiceSection({ id, index }) {
  const { t } = useLang()
  const svc = t.services[id]
  const Icon = SERVICE_ICONS[id]
  const imageFirst = index % 2 === 0
  const message = t.servicesPage.waMessage.replace('{service}', svc.title)

  return (
    <section id={id} className={`py-16 md:py-24 ${index % 2 === 1 ? 'bg-white' : ''}`}>
      <div className="container grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className={`lg:col-span-6 ${imageFirst ? '' : 'lg:order-2'}`}>
          <img
            src={img(id, 1000)}
            srcSet={`${img(id, 600)} 600w, ${img(id, 1000)} 1000w`}
            sizes="(min-width: 1024px) 50vw, 100vw"
            alt={svc.alt}
            loading="lazy"
            width="1000"
            height="750"
            className="aspect-[4/3] w-full rounded object-cover shadow-soft"
          />
        </Reveal>

        <Reveal delay={100} className="lg:col-span-6">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded border border-gold/40 bg-gold-100">
              <Icon className="h-6 w-6 text-navy" strokeWidth={1.5} />
            </span>
            <span dir="ltr" className="font-sans text-sm font-bold text-gold-600">
              {String(index + 1).padStart(2, '0')} / {String(SERVICE_KEYS.length).padStart(2, '0')}
            </span>
          </div>
          <h2 className="mt-6 text-[28px] font-extrabold leading-tight md:text-4xl">{svc.title}</h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted">{svc.body}</p>
          <ul className="mt-7 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {svc.items.map((item) => (
              <li key={item} className="flex gap-3 text-[15px]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" strokeWidth={2.25} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href={waLink(message)} target="_blank" rel="noopener noreferrer" className="btn-navy">
              <BrandIcon name="whatsapp" className="h-4 w-4 text-whatsapp" />
              {t.servicesPage.request}
            </a>
            <p className="text-xs text-muted">
              {t.servicesPage.activityCode}:{' '}
              <span dir="ltr" className="font-sans font-bold text-navy">
                {ACTIVITY_CODES[id].join(' · ')}
              </span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function Services() {
  useSeo('services')
  const { t } = useLang()
  const p = t.servicesPage

  return (
    <>
      <section className="pattern-star bg-navy text-white">
        <div className="container grid gap-10 pb-14 pt-16 md:pb-16 md:pt-24 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow text-gold">{p.eyebrow}</p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] text-white md:text-[52px]">{p.title}</h1>
            <p className="mt-5 max-w-2xl text-lg text-white/80">{p.sub}</p>
          </div>
        </div>
        <div className="border-t border-white/10">
          <nav className="no-scrollbar container flex gap-2 overflow-x-auto py-4" aria-label={p.jump}>
            <span className="me-2 shrink-0 self-center text-xs font-bold uppercase tracking-wider text-white/50 rtl:normal-case rtl:tracking-normal">
              {p.jump}
            </span>
            {SERVICE_KEYS.map((key) => (
              <a
                key={key}
                href={`#${key}`}
                className="shrink-0 rounded border border-white/20 px-3 py-1.5 text-sm font-semibold text-white/85 transition-colors hover:border-gold hover:text-gold"
              >
                {t.services[key].short}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {SERVICE_KEYS.map((key, i) => (
        <ServiceSection key={key} id={key} index={i} />
      ))}

      <CtaBand />
    </>
  )
}
