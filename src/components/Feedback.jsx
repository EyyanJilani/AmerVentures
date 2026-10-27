import { useEffect, useState } from 'react'
import { Star, CircleCheck, Loader2 } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { REVIEWS, SERVICE_KEYS } from '../data/site'
import Reveal from './Reveal'

const SHOW_FIRST = 6

function Stars({ value, className = 'h-4 w-4' }) {
  return (
    <span className="flex gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${className} ${n <= value ? 'fill-accent text-accent-600' : 'text-brand/30'}`} strokeWidth={1.5} />
      ))}
    </span>
  )
}

// Reviews posted on the website (from /api/reviews) plus the ones listed in REVIEWS.
function ReviewList({ reviews }) {
  const { t, lang } = useLang()
  const r = t.reviews
  const [showAll, setShowAll] = useState(false)
  if (!reviews.length) return null

  const average = reviews.reduce((sum, x) => sum + x.rating, 0) / reviews.length
  const visible = showAll ? reviews : reviews.slice(0, SHOW_FIRST)
  const dateFmt = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-AE-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="mb-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h3 className="text-xl font-extrabold">{r.listTitle}</h3>
        <p className="flex items-center gap-2 text-sm text-muted">
          <Stars value={Math.round(average)} />
          <span dir="ltr" className="font-sans font-bold text-brand">{average.toFixed(1)}</span>
          {r.summary.replace('{n}', reviews.length)}
        </p>
      </div>
      <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((x) => (
          <li key={x.id || x.name + x.text.slice(0, 12)} className="flex flex-col rounded border border-line bg-white p-6">
            <Stars value={x.rating} />
            <p dir="auto" className="mt-4 flex-1 whitespace-pre-line leading-relaxed text-charcoal">“{x.text}”</p>
            <p dir="auto" className="mt-4 text-sm font-bold text-brand">{x.name}</p>
            <p className="text-xs text-muted">
              {x.service && (t.services[x.service]?.short || x.service)}
              {x.service && x.createdAt && ' · '}
              {x.createdAt && dateFmt.format(new Date(x.createdAt))}
            </p>
          </li>
        ))}
      </ul>
      {reviews.length > SHOW_FIRST && (
        <button type="button" onClick={() => setShowAll((v) => !v)} className="btn-outline mt-6">
          {showAll ? r.showLess : r.showAll.replace('{n}', reviews.length)}
        </button>
      )}
    </div>
  )
}

const EMPTY = { name: '', service: '', comment: '', website: '' }

function FeedbackForm({ onPosted }) {
  const { t } = useLang()
  const r = t.reviews
  const [values, setValues] = useState(EMPTY)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const [serverError, setServerError] = useState('')

  const update = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const found = {}
    if (values.name.trim().length < 2) found.name = r.errors.name
    if (!rating) found.rating = r.errors.rating
    if (values.comment.trim().length < 10) found.comment = r.errors.comment
    if (/https?:\/\/|www\./i.test(values.comment)) found.comment = r.errors.links
    setErrors(found)
    if (Object.keys(found).length) return

    setStatus('sending')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          rating,
          service: values.service,
          text: values.comment,
          website: values.website,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus('idle')
        setServerError(res.status === 429 ? r.errors.rate : data.error === 'links' ? r.errors.links : r.errors.server)
        return
      }
      if (data.review) onPosted(data.review)
      setStatus('sent')
    } catch {
      setStatus('idle')
      setServerError(r.errors.server)
    }
  }

  const input = (name) =>
    `w-full rounded border bg-white px-4 py-3 text-[15px] text-charcoal outline-none transition-colors focus:border-brand ${
      errors[name] ? 'border-red-600' : 'border-line'
    }`

  if (status === 'sent') {
    return (
      <div role="status" className="rounded border border-line bg-white p-8">
        <CircleCheck className="h-10 w-10 text-accent-600" strokeWidth={1.5} />
        <h3 className="mt-5 text-2xl font-extrabold">{r.thanksTitle}</h3>
        <p className="mt-2 text-muted">{r.thanks}</p>
        <button
          type="button"
          onClick={() => {
            setStatus('idle')
            setRating(0)
            setValues(EMPTY)
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
          <input
            id="fb-name"
            name="name"
            maxLength={40}
            autoComplete="name"
            value={values.name}
            onChange={update}
            className={input('name')}
          />
          {errors.name ? (
            <p className="mt-1.5 text-sm text-red-700">{errors.name}</p>
          ) : (
            <p className="mt-1.5 text-xs text-muted">{r.nameHint}</p>
          )}
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
          maxLength={600}
          placeholder={r.commentPh}
          value={values.comment}
          onChange={update}
          className={`${input('comment')} resize-y`}
        />
        {errors.comment && <p className="mt-1.5 text-sm text-red-700">{errors.comment}</p>}
      </div>

      {/* Honeypot: hidden from people, bots tend to fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={values.website}
        onChange={update}
        className="hidden"
        aria-hidden="true"
      />

      {serverError && (
        <p role="alert" className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-brand w-full disabled:opacity-70 sm:w-auto sm:justify-self-start"
      >
        {status === 'sending' && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === 'sending' ? r.sending : r.submit}
      </button>
    </form>
  )
}

export default function Feedback() {
  const { t } = useLang()
  const r = t.reviews
  const [posted, setPosted] = useState([])

  useEffect(() => {
    let active = true
    fetch('/api/reviews')
      .then((res) => (res.ok ? res.json() : { reviews: [] }))
      .then((data) => active && setPosted(Array.isArray(data.reviews) ? data.reviews : []))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const reviews = [...posted, ...REVIEWS]

  return (
    <section id="feedback" className="bg-sand py-20 md:py-24">
      <div className="container">
        <ReviewList reviews={reviews} />
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">{r.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight md:text-[38px]">{r.title}</h2>
            <p className="mt-4 text-[17px] leading-relaxed text-muted">{r.body}</p>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-7">
            <FeedbackForm onPosted={(review) => setPosted((list) => [review, ...list])} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
