import { useLang } from '../i18n/LanguageContext'

export function LogoMark({ className = 'h-10 w-10' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="6" fill="#14213D" />
      <path d="M18 50V30a14 14 0 0 1 28 0v20" fill="none" stroke="#C8A15A" strokeWidth="5" />
      <path d="M26 50V32a6 6 0 0 1 12 0v18" fill="none" stroke="#F7F5F0" strokeWidth="4" />
    </svg>
  )
}

export default function Logo({ light = false }) {
  const { t } = useLang()
  return (
    <span className="flex items-center gap-2.5 sm:gap-3">
      <LogoMark className={`h-10 w-10 shrink-0 ${light ? 'rounded ring-1 ring-white/20' : ''}`} />
      <span className="whitespace-nowrap leading-tight">
        <span className={`block text-[15px] font-extrabold sm:text-[17px] ${light ? 'text-white' : 'text-navy'}`}>
          {t.brand.name}
        </span>
        <span className={`block text-[10px] font-semibold sm:text-[11px] ${light ? 'text-gold' : 'text-gold-600'}`}>
          {t.brand.tagline}
        </span>
      </span>
    </span>
  )
}
