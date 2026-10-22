# Amer Venture L.L.C-FZ — Website

React + Vite + Tailwind CSS. Three pages (Home, Services, About & Contact) in English and Arabic.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production files in dist/
```

## Where to edit

| What | File |
| --- | --- |
| All text, English + Arabic (incl. page titles and meta descriptions) | `src/i18n/translations.js` |
| License details (number, dates) | `src/data/site.js` → `LICENSE` |
| Phone numbers, email, WhatsApp number, map location | `src/data/site.js` → `CONTACT` |
| Stats strip values | `src/data/site.js` → `STATS` |
| Social media links | `src/data/site.js` → `SOCIAL` |
| Photos (Unsplash IDs) | `src/data/site.js` → `IMAGES` |
| Colours and fonts | `tailwind.config.js` |

## Notes

- Language choice is saved in `localStorage` (`aaw-lang`). Arabic sets `<html dir="rtl" lang="ar">` and switches to Tajawal.
- The contact form validates and shows a success message, but does not send anywhere yet. Connect it in
  `src/pages/AboutContact.jsx` (`onSubmit`) to Formspree, EmailJS or your own API.
- Uses client-side routing. `public/_redirects` (Netlify) and `vercel.json` (Vercel) are included so
  `/services` and `/about-contact` work on refresh. On other hosts, rewrite all paths to `index.html`.
- Photos are hot-linked from Unsplash (free licence). For production you can download them into `public/`.
