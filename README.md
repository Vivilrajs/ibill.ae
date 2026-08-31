# IBILL - ibill.ae

Marketing site and content admin for IBILL Software and Consultancy (accounting
and software services, India and the GCC region).

## Stack

- Next.js 16 (App Router, React 19, TypeScript)
- Tailwind CSS v4 + shadcn/ui (radix-nova), lucide-react icons
- MongoDB + Mongoose - the store for all editable content and leads. When
  `MONGODB_URI` is set it is authoritative (admin writes return 503 if Atlas is
  unreachable, never a silent local write). `./.data/*.json` is used only when
  `MONGODB_URI` is unset, for local dev
- Env-based admin auth (signed httpOnly cookie), route guard in `src/proxy.ts`

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000. The admin panel is at http://localhost:3000/admin.

### Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET` | yes (for `/admin`) | Admin login. Changing the password or secret signs out all sessions. |
| `MONGODB_URI` | recommended | MongoDB Atlas SRV URI - the store for content and leads. Whitelist the deployment IP in Atlas Network Access. If unset, falls back to `./.data/` (local dev only). |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical URL used for metadata and the sitemap. |
| `CONTACT_NOTIFY_EMAIL` | no | Where contact-form notifications are sent. |
| `RESEND_API_KEY` | no | Enables real email for contact notifications (via Resend). Without it, submissions are still stored and the notification is logged. |

### Seeding MongoDB

Once `MONGODB_URI` is set:

```bash
npm run seed
```

This inserts the initial content (services, products, testimonials, FAQs,
settings) into any collection that is currently empty. Safe to re-run.

## Content model

All editable content lives in MongoDB (or `./.data/`) and is managed from
`/admin`:

- **Services** - accounting and IT services, with category, icon and ordering
- **Products** - software products (e.g. Salon Assist)
- **Blog** - articles (drafts stay hidden from the site)
- **Team** - profiles on the About page
- **Testimonials** - client quotes on the home page
- **Site settings** - contact details, social links, homepage counters, FAQs
- **Leads** - contact-form submissions

The build-time defaults for every collection are in `src/lib/content/`.

## Structure

```
src/
  app/
    (site)/            public pages (home, about, services, products, blog, contact)
    admin/             login + (panel) authed screens
    api/               contact, auth, admin CRUD
  components/
    site/              page sections and shared UI
    admin/             admin shell and resource manager
    ui/                shadcn primitives
  lib/
    content/           seed content (source of truth for defaults)
    data.ts            public read helpers (Mongo, else seed content)
    crud.ts            generic admin CRUD handlers
    models.ts          Mongoose schemas
    auth.ts            admin session helpers
  proxy.ts             /admin route guard
scripts/seed.ts        MongoDB seeder
```

## Notes

- The brand logo is `public/agents.png` (client-supplied lockup), rendered on a
  white chip so it stays legible on any header. Swap the file to update it, or
  edit `src/components/site/logo.tsx`.
- Section images use a branded gradient placeholder until real photography is
  added; pass an `src` to `<Media>` or set the image URL on a record in `/admin`.
