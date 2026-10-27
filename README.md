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
| Client reviews shown on Home | `src/data/site.js` → `REVIEWS` |
| Colours (brand blue, accent light green) and fonts | `tailwind.config.js` |

## Notes

- Language choice is saved in `localStorage` (`aaw-lang`). Arabic sets `<html dir="rtl" lang="ar">` and switches to Tajawal.
- The contact form validates and shows a success message, but does not send anywhere yet. Connect it in
  `src/pages/AboutContact.jsx` (`onSubmit`) to Formspree, EmailJS or your own API.
- Uses client-side routing. `public/_redirects` (Netlify) and `vercel.json` (Vercel) are included so
  `/services` and `/about-contact` work on refresh. On other hosts, rewrite all paths to `index.html`.
- Photos are hot-linked from Unsplash (free licence). For production you can download them into `public/`.

## Client reviews

- Visitors post reviews from the Home page. They are saved by the Vercel function `api/reviews.js`
  in an Upstash Redis database and appear on the site straight away.
- Setup (once): Vercel project → **Storage** → **Create Database** → **Upstash for Redis** → connect it
  to this project, then redeploy. Vercel adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically.
- Optional: add an environment variable `REVIEWS_ADMIN_KEY` (any long secret) to be able to delete a review:

  ```bash
  curl -X DELETE "https://amerventures.begintech.co/api/reviews?id=REVIEW_ID" -H "x-admin-key: YOUR_KEY"
  ```

  Review IDs are listed at `https://amerventures.begintech.co/api/reviews`.
- Spam protection: hidden honeypot field, no links allowed, max 3 reviews per IP per hour.
- `npm run dev` serves a temporary in-memory version of the API so the form can be tested locally.
