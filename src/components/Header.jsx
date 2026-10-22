import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { CALL_PHONE, CONTACT } from '../data/site'
import BrandIcon from './BrandIcons'
import Logo from './Logo'

const NAV = [
  { to: '/', key: 'home' },
  { to: '/services', key: 'services' },
  { to: '/about-contact', key: 'about' },
]

function LangToggle({ className = '' }) {
  const { t, toggle, lang } = useLang()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.nav.switchLabel}
      className={`flex items-center rounded border border-line text-xs font-bold ${className}`}
    >
      <span className={`px-2.5 py-1.5 font-sans ${lang === 'en' ? 'bg-navy text-white' : 'text-muted'}`}>EN</span>
      <span className={`px-2.5 py-1.5 font-arabic text-[13px] ${lang === 'ar' ? 'bg-navy text-white' : 'text-muted'}`}>
        عربي
      </span>
    </button>
  )
}

export default function Header() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const linkClass = ({ isActive }) =>
    `relative py-2 text-[15px] font-semibold transition-colors hover:text-navy ${
      isActive ? 'text-navy after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-gold' : 'text-muted'
    }`

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-offwhite transition-shadow ${
        scrolled ? 'border-line shadow-soft' : 'border-transparent'
      }`}
    >
      <div className="container flex h-[72px] items-center justify-between gap-3 sm:gap-6">
        <Link to="/" aria-label={t.brand.name}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end className={linkClass}>
              {t.nav[n.key]}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LangToggle />
          <Link to="/about-contact#contact" className="btn-navy py-2.5">
            {t.nav.quote}
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <LangToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.nav.close : t.nav.menu}
            className="flex h-10 w-10 items-center justify-center rounded border border-line text-navy"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto border-t border-line bg-offwhite lg:hidden">
          <nav className="container flex flex-col py-4" aria-label="Mobile">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end
                className={({ isActive }) =>
                  `border-b border-line py-4 text-lg font-bold ${isActive ? 'text-navy' : 'text-muted'}`
                }
              >
                {t.nav[n.key]}
              </NavLink>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <Link to="/about-contact#contact" className="btn-navy">
                {t.nav.quote}
              </Link>
              <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                <BrandIcon name="whatsapp" className="h-4 w-4" />
                <span dir="ltr">{CONTACT.phones[0].display}</span>
              </a>
              <a href={`tel:${CALL_PHONE.tel}`} className="btn-outline">
                <Phone className="h-4 w-4" />
                <span dir="ltr">{CALL_PHONE.display}</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
