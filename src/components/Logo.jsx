import { useLang } from '../i18n/LanguageContext'

// AV mark from the company logo, with the name set beside it so it stays readable at header size.
export default function Logo({ light = false }) {
  const { t, lang } = useLang()
  return (
    <span className="flex items-center gap-2.5 sm:gap-3">
      <img src="/logo-mark.png" alt="" width="234" height="209" className="h-11 w-auto shrink-0 sm:h-12" />
      <span className="whitespace-nowrap leading-tight">
        <span
          className={`block font-extrabold ${
            lang === 'en' ? 'font-sans text-[14px] uppercase tracking-[0.08em] sm:text-[15px]' : 'text-[16px] sm:text-[17px]'
          } ${light ? 'text-white' : 'text-brand'}`}
        >
          {t.brand.name}
        </span>
        <span className={`block text-[10px] font-semibold sm:text-[11px] ${light ? 'text-accent' : 'text-accent-600'}`}>
          {t.brand.tagline}
        </span>
      </span>
    </span>
  )
}
