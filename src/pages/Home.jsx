import { Link } from 'react-router-dom'
import { ArrowRight, Phone, BadgeCheck, Clock, MonitorSmartphone, FileText } from 'lucide-react'
import { useLang, useSeo } from '../i18n/LanguageContext'
import { CALL_PHONE, CONTACT, LICENSE, SERVICE_KEYS, STATS, img, waLink } from '../data/site'
import { SERVICE_ICONS } from '../data/icons'
import BrandIcon from '../components/BrandIcons'
import PhoneLink from '../components/PhoneLink'
import Reveal from '../components/Reveal'
import CtaBand from '../components/CtaBand'
import Feedback from '../components/Feedback'

const WHY_ICONS = [BadgeCheck, Clock, MonitorSmartphone, FileText]
const PREVIEW = ['clearing', 'manpower', 'banking']

function Hero() {
  const { t } = useLang()
  const h = t.home.hero
  return (
    <section className="relative isolate overflow-hidden bg-brand">
      <img
        src={img('hero', 1920)}
        srcSet={`${img('hero', 800)} 800w, ${img('hero', 1400)} 1400w, ${img('hero', 1920)} 1920w`}
        sizes="100vw"
        alt={h.alt}
        fetchpriority="high"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-brand-900/75" />
      <div className="container grid min-h-[560px] items-center gap-12 py-20 md:min-h-[620px] lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-7">
          <p className="eyebrow text-accent">{h.eyebrow}</p>
          <h1 className="mt-5 text-[40px] font-extrabold leading-[1.08] text-white md:text-6xl md:leading-[1.05]">
            {h.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">{h.sub}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/about-contact#contact" className="btn-accent px-6 py-3.5">
              {h.quote}
              <ArrowRight className="flip-rtl h-4 w-4" />
            </Link>
            <a href={`tel:${CALL_PHONE.tel}`} className="btn-outline-light px-6 py-3.5">
              <Phone className="h-4 w-4" strokeWidth={1.75} />
              {h.call}
            </a>
          </div>
          <p className="mt-8 inline-flex items-center gap-2 rounded border border-white/15 px-3 py-2 text-xs text-white/75">
            <BadgeCheck className="h-4 w-4 text-accent" strokeWidth={1.75} />
            {h.licenseBadge}
            <span className="text-white/30">|</span>
            <span dir="ltr" className="font-sans font-semibold text-white">{LICENSE.number}</span>
          </p>
        </div>

        {/* Quick service panel (desktop) */}
        <div className="hidden lg:col-span-5 lg:block">
          <div className="ms-auto max-w-sm rounded bg-offwhite p-7 shadow-soft">
            <p className="text-sm font-extrabold text-brand">{h.panelTitle}</p>
            <ul className="mt-4 divide-y divide-line">
              {SERVICE_KEYS.map((key) => {
                const Icon = SERVICE_ICONS[key]
                return (
                  <li key={key}>
                    <Link
                      to={`/services#${key}`}
                      className="group flex items-center gap-3 py-3 text-[15px] font-semibold text-charcoal hover:text-brand"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-accent-100">
                        <Icon className="h-4 w-4 text-brand" strokeWidth={1.75} />
                      </span>
                      <span className="flex-1">{t.services[key].short}</span>
                      <ArrowRight className="flip-rtl h-4 w-4 text-accent-600 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                )
              })}
            </ul>
            <a
              href={waLink(t.whatsappFloat.message)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-5 w-full"
            >
              <BrandIcon name="whatsapp" className="h-5 w-5" />
              {h.panelCta}
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/15 lg:hidden">
        <div className="container flex flex-wrap items-center gap-x-6 gap-y-1 py-4 text-sm text-white/75">
          <span className="font-semibold text-accent">{h.line}</span>
          {CONTACT.phones.slice(0, 2).map((p) => (
            <PhoneLink key={p.tel} phone={p} className="hover:text-white" />
          ))}
          <a href={`mailto:${CONTACT.email}`} className="hover:text-white">
            {CONTACT.email}
          </a>
        </div>
      </div>
    </section>
  )
}

function Intro() {
  const { t } = useLang()
  const i = t.home.intro
  return (
    <section className="py-20 md:py-28">
      <div className="container grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">{i.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight md:text-[38px]">{i.title}</h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted">{i.body}</p>
          <Link to="/about-contact" className="mt-7 inline-flex items-center gap-2 font-bold text-brand hover:text-accent-600">
            {i.link}
            <ArrowRight className="flip-rtl h-4 w-4" />
          </Link>
        </Reveal>
        <Reveal delay={120} className="relative lg:col-span-7">
          <div className="absolute -bottom-4 -end-4 hidden h-2/3 w-2/3 rounded bg-sand md:block" aria-hidden="true" />
          <img
            src={img('intro', 1000)}
            alt={i.alt}
            loading="lazy"
            width="1000"
            height="700"
            className="relative aspect-[10/7] w-full rounded object-cover shadow-soft"
          />
        </Reveal>
      </div>
    </section>
  )
}

function ServicesPreview() {
  const { t } = useLang()
  const s = t.home.services
  const Feature = SERVICE_ICONS.government
  return (
    <section className="border-y border-line bg-white py-20 md:py-24">
      <div className="container">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="eyebrow">{s.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-extrabold md:text-[38px]">{s.title}</h2>
            <p className="mt-3 text-muted">{s.body}</p>
          </div>
          <Link to="/services" className="btn-outline shrink-0">
            {s.all}
            <ArrowRight className="flip-rtl h-4 w-4" />
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          {/* Lead service gets a larger card */}
          <Reveal className="group lg:col-span-5">
            <Link to="/services#government" className="img-zoom flex h-full flex-col rounded border border-line bg-offwhite transition-shadow hover:shadow-soft md:flex-row lg:flex-col">
              <img
                src={img('government', 800)}
                alt={t.services.government.alt}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover md:w-1/2 lg:aspect-auto lg:min-h-[280px] lg:w-full lg:flex-1"
              />
              <div className="p-7 md:self-center lg:self-auto">
                <Feature className="h-7 w-7 text-accent-600" strokeWidth={1.5} />
                <h3 className="mt-4 text-xl font-extrabold">{t.services.government.short}</h3>
                <p className="mt-2 text-muted">{t.services.government.card}</p>
              </div>
            </Link>
          </Reveal>

          <div className="flex flex-col gap-6 lg:col-span-7">
            {PREVIEW.map((key, idx) => {
              const Icon = SERVICE_ICONS[key]
              const svc = t.services[key]
              return (
                <Reveal key={key} delay={idx * 90}>
                  <Link
                    to={`/services#${key}`}
                    className="group grid grid-cols-[96px_1fr] items-center gap-5 rounded border border-line bg-offwhite p-3 transition-shadow hover:shadow-soft sm:grid-cols-[150px_1fr] sm:gap-6"
                  >
                    <span className="img-zoom block rounded">
                      <img
                        src={img(key, 400)}
                        alt={svc.alt}
                        loading="lazy"
                        className="aspect-square w-full object-cover sm:aspect-[4/3]"
                      />
                    </span>
                    <div className="pe-2">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 shrink-0 text-accent-600" strokeWidth={1.5} />
                        <h3 className="text-lg font-extrabold">{svc.short}</h3>
                      </div>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{svc.card}</p>
                      <span className="mt-2 hidden items-center gap-1.5 text-sm font-bold text-brand group-hover:text-accent-600 sm:inline-flex">
                        {s.more}
                        <ArrowRight className="flip-rtl h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function Process() {
  const { t } = useLang()
  const p = t.home.process
  return (
    <section className="py-20 md:py-24">
      <div className="container">
        <Reveal className="max-w-xl">
          <p className="eyebrow">{p.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-extrabold md:text-[38px]">{p.title}</h2>
        </Reveal>
        <ol className="relative mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Connecting line behind the step numbers */}
          <span className="absolute inset-x-6 top-6 hidden h-px bg-line lg:block" aria-hidden="true" />
          {p.steps.map((step, idx) => (
            <Reveal as="li" key={step.title} delay={idx * 90} className="relative">
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-accent bg-offwhite font-sans text-base font-extrabold text-brand">
                {idx + 1}
              </span>
              <h3 className="mt-5 text-lg font-extrabold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

function WhyUs() {
  const { t } = useLang()
  const w = t.home.why
  return (
    <section className="pattern-star bg-brand py-20 text-white md:py-28">
      <div className="container grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow text-accent">{w.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white md:text-[38px]">{w.title}</h2>
          <img
            src={img('why', 900)}
            alt={w.alt}
            loading="lazy"
            className="mt-10 hidden aspect-[4/5] w-full max-w-md rounded object-cover lg:block"
          />
        </Reveal>
        <div className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7 lg:self-end">
          {w.points.map((p, idx) => {
            const Icon = WHY_ICONS[idx]
            return (
              <Reveal key={p.title} delay={idx * 80} className="border-t border-white/15 py-8">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-accent">0{idx + 1}</span>
                  <Icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-white/70">{p.body}</p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Stats() {
  const { t } = useLang()
  return (
    <section className="bg-offwhite">
      <div className="container">
        <dl className="grid grid-cols-2 border-b border-line md:grid-cols-4">
          {STATS.map((s, idx) => (
            <Reveal
              key={s.key}
              delay={idx * 70}
              className={`px-2 py-10 md:px-6 md:py-14 ${idx % 2 === 1 ? 'border-s border-line' : ''} ${
                idx > 1 ? 'border-t border-line md:border-t-0' : ''
              } ${idx === 2 ? 'md:border-s' : ''}`}
            >
              <dt className="sr-only">{t.home.stats[s.key]}</dt>
              <dd className="font-sans text-4xl font-extrabold text-brand md:text-5xl">
                <span dir="ltr">{s.value}</span>
              </dd>
              <dd className="mt-2 text-sm font-semibold text-muted" aria-hidden="true">
                {t.home.stats[s.key]}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default function Home() {
  useSeo('home')
  return (
    <>
      <Hero />
      <Intro />
      <ServicesPreview />
      <Process />
      <WhyUs />
      <Stats />
      <Feedback />
      <CtaBand />
    </>
  )
}
