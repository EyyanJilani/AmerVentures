import { useState } from 'react'
import { Star, CircleCheck } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { REVIEWS, SERVICE_KEYS, waLink } from '../data/site'
import BrandIcon from './BrandIcons'
import Reveal from './Reveal'

function Stars({ value, className = 'h-4 w-4' }) {
  return (
    <span className="flex gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${className} ${n <= value ? 'fill-accent text-accent-600' : 'text-brand/30'}`} strokeWidth={1.5} />
      ))}
    </span>
  )
}

// Published client reviews. Only real reviews go in REVIEWS (src/data/site.js).
function ReviewList() {
  const { t } = useLang()
  if (!REVIEWS.length) return null
  return (
    <div className="mb-14">
      <h3 className="text-xl font-extrabold">{t.reviews.listTitle}</h3>
      <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r, idx) => (
          <Reveal as="li" key={`${r.name}-${idx}`} delay={idx * 80} className="rounded border border-line bg-white p-6">
            <Stars value={r.rating} />
            <p dir="auto" className="mt-4 leading-relaxed text-charcoal">“{r.text}”</p>
            <p dir="auto" className="mt-4 text-sm font-bold text-brand">{r.name}</p>
            {r.service && <p className="text-xs text-muted">{t.services[r.service]?.short || r.service}</p>}
          </Reveal>
        ))}
      </ul>
    </div>
  )
}

function FeedbackForm() {
  const { t } = useLang()
  const r = t.reviews
  const [values, setValues] = useState({ name: '', service: '', comment: '' })
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const update = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const found = {}
    if (values.name.trim().length < 2) found.name = r.errors.name
    if (!rating) found.rating = r.errors.rating
    if (values.comment.trim().length < 10) found.comment = r.errors.comment
    setErrors(found)
    if (Object.keys(found).length) return

    const lines = [
      r.wa.intro,
      `${r.wa.name}: ${values.name.trim()}`,
      `${r.wa.rating}: ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)`,
      values.service && `${r.wa.service}: ${t.services[values.service]?.title || r.other}`,
      `${r.wa.comment}: ${values.comment.trim()}`,
    ].filter(Boolean)
    window.open(waLink(lines.join('\n')), '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  const input = (name) =>
    `w-full rounded border bg-white px-4 py-3 text-[15px] text-charcoal outline-none transition-colors focus:border-brand ${
      errors[name] ? 'border-red-600' : 'border-line'
    }`

  if (sent) {
    return (
      <div role="status" className="rounded border border-line bg-white p-8">
        <CircleCheck className="h-10 w-10 text-accent-600" strokeWidth={1.5} />
        <h3 className="mt-5 text-2xl font-extrabold">{r.thanksTitle}</h3>
        <p className="mt-2 text-muted">{r.thanks}</p>
        <button
          type="button"
          onClick={() => {
            setSent(false)
            setRating(0)
            setValues({ name: '', service: '', comment: '' })
          }}
          className="btn-outline mt-6"
        >
          {r.again}
        </button>
      </div>
    )
  }

  const shown = hover || rating
  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-5 rounded border border-line bg-white p-6 shadow-soft md:p-8">
      <fieldset>
        <legend className="mb-2 text-sm font-bold text-brand">{r.rating}</legend>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setRating(n)
                setErrors((er) => ({ ...er, rating: undefined }))
              }}
              onMouseEnter={() => setHover(n)}
              aria-label={r.star.replace('{n}', n)}
              aria-pressed={rating === n}
              className="rounded p-1"
            >
              <Star
                className={`h-8 w-8 transition-colors ${n <= shown ? 'fill-accent text-accent-600' : 'text-brand/30'}`}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>
        {errors.rating && <p className="mt-1.5 text-sm text-red-700">{errors.rating}</p>}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fb-name" className="mb-1.5 block text-sm font-bold text-brand">{r.name}</label>
          <input id="fb-name" name="name" autoComplete="name" value={values.name} onChange={update} className={input('name')} />
          {errors.name && <p className="mt-1.5 text-sm text-red-700">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="fb-service" className="mb-1.5 block text-sm font-bold text-brand">{r.service}</label>
          <select id="fb-service" name="service" value={values.service} onChange={update} className={input('service')}>
            <option value="">—</option>
            {SERVICE_KEYS.map((key) => (
              <option key={key} value={key}>
                {t.services[key].title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="fb-comment" className="mb-1.5 block text-sm font-bold text-brand">{r.comment}</label>
        <textarea
          id="fb-comment"
          name="comment"
          rows={4}
          placeholder={r.commentPh}
          value={values.comment}
          onChange={update}
          className={`${input('comment')} resize-y`}
        />
        {errors.comment && <p className="mt-1.5 text-sm text-red-700">{errors.comment}</p>}
      </div>

      <button type="submit" className="btn-brand w-full sm:w-auto sm:justify-self-start">
        <BrandIcon name="whatsapp" className="h-4 w-4 text-whatsapp" />
        {r.submit}
      </button>
    </form>
  )
}

export default function Feedback() {
  const { t } = useLang()
  const r = t.reviews
  return (
    <section id="feedback" className="bg-sand py-20 md:py-24">
      <div className="container">
        <ReviewList />
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">{r.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight md:text-[38px]">{r.title}</h2>
            <p className="mt-4 text-[17px] leading-relaxed text-muted">{r.body}</p>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-7">
            <FeedbackForm />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
