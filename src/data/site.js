// Business details and editable values in one place.

// From the Meydan Free Zone business license.
export const LICENSE = {
  legalName: 'AMER VENTURE L.L.C-FZ',
  number: '2415626.01',
  formation: '2415626',
  issued: '26/01/2024',
  expires: '25/01/2027',
}

// Phone numbers and email are not on the license.
export const CONTACT = {
  phones: [
    { display: '+971 50 906 9414', tel: '+971509069414' },
    { display: '+971 56 270 8802', tel: '+971562708802' },
  ],
  whatsapp: '971509069414',
  email: 'info@amerventure.com',
  mapQuery: 'Meydan Grandstand, Meydan Road, Nad Al Sheba, Dubai',
}

export const STATS = [
  { key: 'established', value: '2024' },
  { key: 'activities', value: '8' },
  { key: 'areas', value: '3' },
  { key: 'contact', value: '1' },
]

// Profiles left as '#' are hidden in the footer until a link is added.
export const SOCIAL = {
  instagram: 'https://www.instagram.com/ventureamer',
  facebook: 'https://www.facebook.com/share/1SpyUpcvPx/',
  linkedin: '#',
  tiktok: '#',
}

const unsplash = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`

export const img = (key, w) => unsplash(IMAGES[key], w)

export const IMAGES = {
  hero: '1681505531034-8d67054e07f6',
  intro: '1681505504714-4ded1bc247e7',
  why: '1664575602554-2087b04935a5',
  about: '1787275089804-ba325e24301a',
  aboutTeam: '1784637578383-dc0cf70d641a',
  government: '1681505512385-8b9d567a56c0',
  clearing: '1681505515542-3a6c4ef756c4',
  attestation: '1619418602850-35ad20aa1700',
  verification: '1681505546695-682d6c1e2c3a',
  manpower: '1664575196044-195f135295df',
  banking: '1681505526188-b05e68c77582',
}

// Order of services on the Services page (keys match translations).
export const SERVICE_KEYS = ['government', 'clearing', 'attestation', 'verification', 'manpower', 'banking']

export const waLink = (message) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`
