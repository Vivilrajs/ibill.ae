# IBILL - ibill.ae

Marketing site and content admin for IBILL Software and Consultancy.

Two apps in this repo:

- **`frontend/`** - Vite + React SPA, prerendered to static HTML (`vite-react-ssg`).
  Deploys to Vercel / Netlify.
- **`backend/`** - NestJS + Mongoose API. Deploys to a VPS (Dockerfile / pm2).
- **MongoDB Atlas** - the store for all content and leads (`ibill` database).

## Run locally

```bash
# 1. API
cd backend
cp .env.example .env          # fill MONGODB_URI, ADMIN_*, AUTH_SECRET
npm install
npm run seed                  # once - seeds Atlas
npm start                     # http://localhost:4000/api
#   ...or without Atlas:  npm run start:memdb   (in-memory MongoDB)

# 2. Frontend
cd ../frontend
cp .env.example .env          # VITE_API_URL=http://localhost:4000/api
npm install
npm run dev                   # http://localhost:5173
```

Admin panel: `http://localhost:5173/admin` (credentials from `backend/.env`).

## Build

```bash
cd backend  && npm run build   # -> dist/  (run: node dist/main.js)
cd frontend && npm run build   # -> dist/  (static; VITE_* baked in at build time,
                               #            prerenders 19 routes + sitemap/robots)
```

## Environment

| App | Variable | Purpose |
| --- | --- | --- |
| backend | `MONGODB_URI`, `MONGODB_DB` | Atlas connection (db defaults to `ibill`) |
| backend | `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET` | admin login (Bearer token = HMAC; changing pw/secret invalidates tokens) |
| backend | `FRONTEND_ORIGIN` | comma-separated CORS allowlist |
| backend | `PORT` | default 4000 |
| backend | `CONTACT_NOTIFY_EMAIL`, `RESEND_API_KEY` | contact-form email (optional) |
| frontend | `VITE_API_URL` | backend base URL, e.g. `https://api.ibill.ae/api` |
| frontend | `VITE_SITE_URL` | canonical / OG absolute URLs |

## Deploy

- **backend** (VPS): `docker build -t ibill-api backend` and run with the env
  vars, or `npm ci && npm run build && pm2 start ecosystem.config.cjs`. Whitelist
  the server IP in Atlas > Network Access.
- **frontend** (Vercel/Netlify): build `npm run build`, output `dist/`.
  `vercel.json` / `netlify.toml` / `public/_redirects` handle SPA fallback +
  asset caching. Set `VITE_API_URL` + `VITE_SITE_URL` in the host build env.

## API surface

`/api` base. Public GETs: `services` (`?category=`), `products`, `products/:slug`,
`posts`, `posts/:slug`, `team`, `testimonials`, `faqs`, `settings`, `health`.
`POST /api/contact`. `POST /api/auth/login` -> `{ token }`. Admin (Bearer):
`/api/admin/content/:resource` CRUD, `/api/admin/settings`, `/api/admin/leads`.

See `MIGRATION.md` for the history of the split from the original Next.js app.
