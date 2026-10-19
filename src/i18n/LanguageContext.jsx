import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from './translations'

const STORAGE_KEY = 'aaw-lang'
const LanguageContext = createContext(null)

function readSavedLang() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'ar' ? 'ar' : 'en'
  } catch {
    return 'en'
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readSavedLang)

  useEffect(() => {
    const html = document.documentElement
    html.lang = lang
    html.dir = lang === 'ar' ? 'rtl' : 'ltr'
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* storage unavailable: language still works for this visit */
    }
  }, [lang])

  const value = useMemo(
    () => ({
      lang,
      t: translations[lang],
      isRtl: lang === 'ar',
      toggle: () => setLang((l) => (l === 'en' ? 'ar' : 'en')),
    }),
    [lang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  return useContext(LanguageContext)
}

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

// Sets the per-page title, description and Open Graph tags in the active language.
export function useSeo(page) {
  const { lang, t } = useLang()
  useEffect(() => {
    const { title, description } = t.seo[page]
    document.title = title
    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:locale"]', 'content', lang === 'ar' ? 'ar_AE' : 'en_AE')
    setMeta('meta[property="og:locale:alternate"]', 'content', lang === 'ar' ? 'en_AE' : 'ar_AE')
  }, [lang, page, t])
}
