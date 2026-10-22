import { CONTACT } from '../data/site'
import BrandIcon from './BrandIcons'

// A phone number link: the WhatsApp number opens a chat, others start a call.
export default function PhoneLink({ phone, className = '', icon = true, children }) {
  const chat = phone.whatsapp
  return (
    <a
      href={chat ? `https://wa.me/${CONTACT.whatsapp}` : `tel:${phone.tel}`}
      {...(chat ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`inline-flex items-center gap-1.5 ${className}`}
    >
      {chat && icon && <BrandIcon name="whatsapp" className="h-3.5 w-3.5 shrink-0 text-whatsapp" />}
      {children || <span dir="ltr">{phone.display}</span>}
    </a>
  )
}
