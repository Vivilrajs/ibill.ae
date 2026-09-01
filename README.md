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

## Deploy - both on Vercel (one project, same origin)

`vercel.json` + `api/index.ts` + root `package.json` wire it up:

- `npm run vercel-build` builds `backend/dist` then the static `frontend/dist`.
- `api/index.ts` is a serverless function that boots the compiled NestJS app and
  serves every `/api/*` request (rewrite in `vercel.json`).
- Everything else is served from `frontend/dist` (prerendered HTML first, SPA
  fallback to `index.html`).
- The frontend calls the API at the relative path `/api` - **no CORS**.

**Set these Environment Variables in the Vercel project** (Settings > Environment
Variables), then deploy:

```
MONGODB_URI           <Atlas SRV URI>
MONGODB_DB            ibill
ADMIN_EMAIL           admin@ibill.ae
ADMIN_PASSWORD        <strong password>
AUTH_SECRET           <long random string>
CONTACT_NOTIFY_EMAIL  info@ibill.ae
RESEND_API_KEY        <optional>
SITE_URL             https://<your-domain>
VITE_API_URL         /api
VITE_SITE_URL        https://<your-domain>
```

Also add Vercel's outbound IP range (or `0.0.0.0/0`) to Atlas > Network Access.

Notes:
- Serverless = cold starts (~2-4s to boot Nest + connect Atlas). Public pages are
  prerendered so visitors rarely hit a cold function; the admin panel will feel it
  on the first request.
- Prerendered HTML has the marketing copy but not the API-fed lists (they hydrate
  client-side) - the frontend build can't reach the API. To also prerender the
  lists, point `VITE_API_URL` at the *live* production API during the build
  (`https://<domain>/api`) so SSG fetches real data.

### Alternative: backend on a VPS

`backend` still runs standalone: `docker build -t ibill-api backend`, or
`cd backend && npm ci && npm run build && pm2 start ecosystem.config.cjs`. Then
set the frontend's `VITE_API_URL` to the API's URL and `FRONTEND_ORIGIN` (on the
API) to the frontend's origin for CORS.

## API surface

`/api` base. Public GETs: `services` (`?category=`), `products`, `products/:slug`,
`posts`, `posts/:slug`, `team`, `testimonials`, `faqs`, `settings`, `health`.
`POST /api/contact`. `POST /api/auth/login` -> `{ token }`. Admin (Bearer):
`/api/admin/content/:resource` CRUD, `/api/admin/settings`, `/api/admin/leads`.

See `MIGRATION.md` for the history of the split from the original Next.js app.
