import { useState } from 'react'
import { MapPin, Phone, Mail, ScrollText, Handshake, Award, CircleCheck, Loader2, BadgeCheck } from 'lucide-react'
import { useLang, useSeo } from '../i18n/LanguageContext'
import { CONTACT, LICENSE, SERVICE_KEYS, img, waLink } from '../data/site'
import BrandIcon from '../components/BrandIcons'
import PhoneLink from '../components/PhoneLink'
import Reveal from '../components/Reveal'

const VALUE_ICONS = [ScrollText, Handshake, Award]

function LicenseCard() {
  const { t } = useLang()
  const l = t.aboutPage.license
  const rows = [
    [l.legalName, l.legalNameValue],
    [l.type, l.typeValue],
    [l.authority, l.authorityValue],
    [l.number, LICENSE.number, true],
    [l.issued, LICENSE.issued, true],
    [l.expires, LICENSE.expires, true],
  ]
  return (
    <div className="mt-10 rounded border border-line bg-white p-7">
      <div className="flex items-center gap-3">
        <BadgeCheck className="h-6 w-6 text-gold-600" strokeWidth={1.5} />
        <h3 className="text-lg font-extrabold">{l.title}</h3>
      </div>
      <dl className="mt-5 divide-y divide-line text-sm">
        {rows.map(([label, value, ltr]) => (
          <div key={label} className="flex justify-between gap-4 py-2.5">
            <dt className="shrink-0 text-muted">{label}</dt>
            <dd className="text-end font-semibold text-navy">
              {ltr ? <span dir="ltr">{value}</span> : value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
const EMPTY = { name: '', phone: '', email: '', service: '', message: '' }

function validate(values) {
  const errors = {}
  if (values.name.trim().length < 2) errors.name = 'name'
  const digits = values.phone.replace(/\D/g, '')
  if (!/^[+\d\s()-]+$/.test(values.phone.trim()) || digits.length < 7 || digits.length > 15) errors.phone = 'phone'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = 'email'
  if (!values.service) errors.service = 'service'
  if (values.message.trim().length < 10) errors.message = 'message'
  return errors
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-navy">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

function ContactForm() {
  const { t } = useLang()
  const f = t.contact.form
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const [sentName, setSentName] = useState('')

  const update = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(`cf-${Object.keys(found)[0]}`)?.focus()
      return
    }
    setStatus('sending')
    // Connect this to your form backend (e.g. Formspree, EmailJS or your own API).
    setTimeout(() => {
      setSentName(values.name.trim().split(' ')[0])
      setValues(EMPTY)
      setStatus('sent')
    }, 700)
  }

  const input = (name) =>
    `w-full rounded border bg-white px-4 py-3 text-[15px] text-charcoal outline-none transition-colors focus:border-navy ${
      errors[name] ? 'border-red-600' : 'border-line'
    }`

  const aria = (name) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `cf-${name}-error` : undefined,
  })

  if (status === 'sent') {
    return (
      <div role="status" className="flex h-full flex-col items-start justify-center rounded border border-line bg-white p-8 md:p-10">
        <CircleCheck className="h-10 w-10 text-gold-600" strokeWidth={1.5} />
        <h3 className="mt-5 text-2xl font-extrabold">{f.successTitle}</h3>
        <p className="mt-2 text-muted">{f.success.replace('{name}', sentName)}</p>
        <button type="button" onClick={() => setStatus('idle')} className="btn-outline mt-7">
          {f.again}
        </button>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-5 rounded border border-line bg-white p-6 md:grid-cols-2 md:p-8">
      <Field id="cf-name" label={f.name} error={errors.name && f.errors.name}>
        <input id="cf-name" name="name" autoComplete="name" value={values.name} onChange={update} className={input('name')} {...aria('name')} />
      </Field>
      <Field id="cf-phone" label={f.phone} error={errors.phone && f.errors.phone}>
        <input
          id="cf-phone"
          name="phone"
          type="tel"
          dir="ltr"
          autoComplete="tel"
          placeholder="+971 5X XXX XXXX"
          value={values.phone}
          onChange={update}
          className={`${input('phone')} rtl:text-right`}
          {...aria('phone')}
        />
      </Field>
      <Field id="cf-email" label={f.email} error={errors.email && f.errors.email}>
        <input
          id="cf-email"
          name="email"
          type="email"
          dir="ltr"
          autoComplete="email"
          value={values.email}
          onChange={update}
          className={`${input('email')} rtl:text-right`}
          {...aria('email')}
        />
      </Field>
      <Field id="cf-service" label={f.service} error={errors.service && f.errors.service}>
        <select id="cf-service" name="service" value={values.service} onChange={update} className={input('service')} {...aria('service')}>
          <option value="">{f.choose}</option>
          {SERVICE_KEYS.map((key) => (
            <option key={key} value={key}>
              {t.services[key].title}
            </option>
          ))}
          <option value="other">{f.other}</option>
        </select>
      </Field>
      <div className="md:col-span-2">
        <Field id="cf-message" label={f.message} error={errors.message && f.errors.message}>
          <textarea
            id="cf-message"
            name="message"
            rows={5}
            placeholder={f.messagePh}
            value={values.message}
            onChange={update}
            className={`${input('message')} resize-y`}
            {...aria('message')}
          />
        </Field>
      </div>
      <div className="md:col-span-2">
        <button type="submit" disabled={status === 'sending'} className="btn-navy w-full px-8 py-3.5 disabled:opacity-70 sm:w-auto">
          {status === 'sending' && <Loader2 className="h-4 w-4 animate-spin" />}
          {status === 'sending' ? f.sending : f.submit}
        </button>
      </div>
    </form>
  )
}

export default function AboutContact() {
  useSeo('about')
  const { t, lang } = useLang()
  const a = t.aboutPage
  const d = t.contact.details
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(CONTACT.mapQuery)}&hl=${lang}&z=15&output=embed`

  return (
    <>
      {/* Page banner */}
      <section className="relative isolate overflow-hidden bg-navy">
        <img src={img('about', 1920)} alt={a.heroAlt} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-navy-900/75" />
        <div className="container py-20 md:py-28">
          <p className="eyebrow text-gold">{a.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.1] text-white md:text-[52px]">{a.title}</h1>
        </div>
      </section>

      {/* Story + mission */}
      <section className="py-20 md:py-28">
        <div className="container grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">{a.story.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-extrabold md:text-[38px]">{a.story.title}</h2>
            <p className="mt-6 text-[17px] leading-relaxed text-charcoal">{a.story.p1}</p>
            <p className="mt-4 text-[17px] leading-relaxed text-muted">{a.story.p2}</p>
            <img
              src={img('aboutTeam', 1000)}
              alt={a.story.alt}
              loading="lazy"
              className="mt-10 aspect-[16/10] w-full rounded object-cover object-[center_35%]"
            />
            <LicenseCard />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5 lg:pt-14">
            <figure className="pattern-star overflow-hidden rounded bg-navy p-8 text-white md:p-10">
              <figcaption className="eyebrow text-gold">{a.mission.label}</figcaption>
              <blockquote className="mt-5 text-xl font-semibold leading-relaxed md:text-2xl">{a.mission.text}</blockquote>
            </figure>
            <ul className="mt-10 space-y-8">
              {a.values.map((v, idx) => {
                const Icon = VALUE_ICONS[idx]
                return (
                  <li key={v.title} className="flex gap-5 border-b border-line pb-8 last:border-0">
                    <Icon className="h-7 w-7 shrink-0 text-gold-600" strokeWidth={1.5} />
                    <div>
                      <h3 className="text-lg font-extrabold">{v.title}</h3>
                      <p className="mt-1 text-muted">{v.body}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-line bg-sand/50 py-20 md:py-24">
        <div className="container">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">{t.contact.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-extrabold md:text-[38px]">{t.contact.title}</h2>
            <p className="mt-3 text-muted">{t.contact.sub}</p>
          </Reveal>

          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <ContactForm />
            </Reveal>

            <Reveal delay={100} as="aside" className="lg:col-span-5">
              <div className="space-y-7 rounded bg-navy p-7 text-white/80 md:p-9">
                <div className="flex gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.75} />
                  <div>
                    <h3 className="font-bold text-white">{d.title}</h3>
                    <p className="mt-1 leading-relaxed">{d.address}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.75} />
                  <div>
                    <h3 className="font-bold text-white">{d.phone}</h3>
                    <ul className="mt-1 space-y-1">
                      {CONTACT.phones.map((p) => (
                        <li key={p.tel}>
                          <PhoneLink phone={p} className="hover:text-gold" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.75} />
                  <div>
                    <h3 className="font-bold text-white">{d.email}</h3>
                    <a href={`mailto:${CONTACT.email}`} className="mt-1 inline-block hover:text-gold">
                      {CONTACT.email}
                    </a>
                  </div>
                </div>
                <a
                  href={waLink(t.whatsappFloat.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full"
                >
                  <BrandIcon name="whatsapp" className="h-5 w-5" />
                  {d.whatsappCta}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Map */}
      <section aria-label={t.contact.mapTitle} className="bg-line">
        <iframe
          key={lang}
          title={t.contact.mapTitle}
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[360px] w-full border-0 md:h-[440px]"
        />
      </section>
    </>
  )
}
