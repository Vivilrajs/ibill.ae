# Migration: Next.js -> Vite React + NestJS + MongoDB

## Context

The client reports the site is slow. Root cause in the current build: every
`(site)` page is `export const dynamic = "force-dynamic"` and runs several
MongoDB round trips to Atlas per request with no caching, so every visit pays
full SSR + DB latency.

Target architecture (client's decision):

- **frontend/** - Vite + React SPA, statically hosted, prerendered public pages
- **backend/** - NestJS API + Mongoose, deployed by the client
- **MongoDB Atlas** - unchanged (`ibill` database, already seeded)

Both new apps live in **new folders inside this repo**. The existing Next.js app
stays at the repo root and keeps working until the new stack reaches parity;
only then is it deleted.

### Decisions locked

- Folders: **`backend/`** (NestJS) + **`frontend/`** (Vite React).
- Frontend rendering: **SSG prerender** via `vite-react-ssg` (public routes ->
  static HTML + hydrate; admin = SPA, `noindex`).
- Backend: **Nest CLI scaffold** (`@nestjs/mongoose`, `@nestjs/config`,
  `@nestjs/throttler`, zod validation pipe).
- Deploy: backend on a **VPS / own server** (Dockerfile + pm2/systemd notes);
  frontend on **Vercel / Netlify** (static `dist/`, SPA rewrites, build-time
  `VITE_*` env).

Why this is also faster:
- Public pages are prerendered to static HTML (no per-request SSR/DB).
- The API keeps a warm Mongoose pool + short in-memory cache + `Cache-Control`
  headers on public GETs.
- The browser caches API responses (TanStack Query).

---

## Target repo layout

```
ibill.ae/
  backend/                  NestJS API (new)
    src/
      main.ts
      app.module.ts
      common/               guards, interceptors, cache, mongo connection
      schemas/              Mongoose schemas (ported from src/lib/models.ts)
      seed/                 seed data + `npm run seed`
      auth/                 auth.module + controller + service + guard
      content/              generic CRUD module for the 6 resources
      settings/             site settings module
      leads/                leads module
      contact/              contact form module (+ email)
    .env.example
    package.json
    Dockerfile
  frontend/                 Vite React SPA (new)
    src/
      main.tsx
      routes.tsx            React Router route tree
      pages/                Home, About, Services, ServiceCategory, Products,
                            ProductDetail, Blog, BlogPost, Contact, NotFound
      pages/admin/          Login, Dashboard, Services, Products, Blog, Team,
                            Testimonials, Leads, Settings
      components/           ported 1:1 from src/components (site + admin + ui)
      lib/
        api.ts             fetch wrapper -> VITE_API_URL, auth header
        queries.ts         TanStack Query hooks
        content.ts         page copy constants (from src/lib/content/pages.ts,
                           site.ts, icons.tsx, utils.ts)
        seo.tsx            <Seo> component (react-helmet-async)
    .env.example
    index.html
    vite.config.ts
  (root)                    Next.js app - DELETED at the end of Phase 4
  MIGRATION.md
```

Root `package.json` becomes a thin npm-workspaces manifest
(`"workspaces": ["backend", "frontend"]`) after cutover, or stays as plain docs
if the client prefers two independent repos later.

---

## What ports directly (low risk)

| Current file | Goes to | Notes |
| --- | --- | --- |
| `src/lib/models.ts` | `backend/src/schemas/*` | schemas are framework-agnostic; split one file per model or keep grouped |
| `src/lib/mongodb.ts` | `backend/src/common/mongo` | Nest `MongooseModule.forRootAsync`; drop the edge concerns |
| `src/lib/auth.ts` | `backend/src/auth/auth.service.ts` | HMAC token logic unchanged (Node crypto) |
| `src/lib/crud.ts` + `resources.ts` | `backend/src/content/*` | one generic controller/service driven by a resource registry + zod schemas |
| `src/lib/data.ts` | `backend/src/content` + `settings` + `leads` services | the "Mongo-authoritative, seed fallback for reads" rule is kept |
| `src/lib/email.ts` | `backend/src/contact/email.service.ts` | unchanged (Resend/console) |
| `src/lib/content/{services,products,posts,team,testimonials,faqs,settings}.ts` | `backend/src/seed/` | seed + read-only fallback data |
| `src/lib/content/pages.ts`, `src/lib/site.ts`, `src/lib/icons.tsx`, `src/lib/utils.ts` | `frontend/src/lib/` | pure constants + `cn` + icon map |
| `src/components/site/*`, `src/components/admin/*`, `src/components/ui/*` | `frontend/src/components/*` | see "Component changes" below |
| `public/*` (images, agents.png, icon.svg) | `frontend/public/*` | copy as-is |
| `scripts/seed.ts` | `backend/src/seed/seed.ts` | reuse; wire to Nest config or plain dotenv |

## Component changes (mechanical, per file)

- Delete every `"use client"` line (SPA - everything is client).
- `next/link` `<Link href>` -> `react-router` `<Link to>`.
- `next/navigation` `usePathname()` -> `useLocation().pathname`;
  `useRouter().replace()` -> `useNavigate()`.
- `next/image` `<Image>` -> `frontend/src/components/img.tsx` (a thin `<img>` with
  `loading`, `decoding`, `srcset` via `vite-imagetools` for the hero/section
  photos).
- Page components (`app/(site)/**/page.tsx`) become route components that call
  TanStack Query hooks instead of `await getX()`.
- `generateMetadata` -> `<Seo title description image />` inside the component.
- `next-themes` -> keep `next-themes` (it works outside Next) OR a ~30-line
  `ThemeProvider` (class on `<html>`, `localStorage`, default light). Toggle
  component is otherwise unchanged.
- Admin: `proxy.ts` guard -> a `<RequireAuth>` route wrapper + backend guard on
  every `/admin/*` API call.

---

## Backend API (NestJS) - mirrors current behaviour

Base path `/api`. CORS allows `FRONTEND_ORIGIN`.

Auth: login returns a **Bearer token** (the existing HMAC of email+password over
`AUTH_SECRET`). Frontend stores it and sends `Authorization: Bearer <token>`.
(Simpler than cross-site cookies; the token still invalidates when
`ADMIN_PASSWORD`/`AUTH_SECRET` change.)

```
POST   /api/auth/login            {email,password} -> { token }        (429-limited)
POST   /api/auth/logout           no-op client-side; kept for symmetry

# public reads (published only, Cache-Control: public, s-maxage=60)
GET    /api/services              ?category=accounting|it
GET    /api/products
GET    /api/posts
GET    /api/team
GET    /api/testimonials
GET    /api/faqs
GET    /api/settings
GET    /api/products/:slug
GET    /api/posts/:slug

# admin (Bearer required; returns 401/503 as today)
GET    /api/admin/:resource       all rows incl. drafts   (resource in the 6)
POST   /api/admin/:resource
PUT    /api/admin/:resource/:id
DELETE /api/admin/:resource/:id
GET    /api/admin/settings
PUT    /api/admin/settings
GET    /api/admin/leads
PATCH  /api/admin/leads/:id       {handled}
DELETE /api/admin/leads/:id

POST   /api/contact               {name,email,phone,message,source,company(honeypot)}
GET    /api/health                { db: "connected" | "unreachable" }
```

Rules kept from the current build:
- `MONGODB_URI` set = Mongo authoritative. Admin writes return **503** on outage,
  never a silent local write.
- Public reads fall back to the seed constants (read-only) on outage.
- Contact: Mongo first; on outage write an emergency in-memory/file backup + still
  200 + still send the email. `/api/admin/leads` merges backups in.
- Zod validation on every write (reuse `resources.ts` schemas).
- Collections auto-seed when empty on first read.

Perf additions:
- `MongooseModule` connection kept warm (`serverSelectionTimeoutMS: 8000`,
  `maxPoolSize: 10`).
- 60s in-memory cache (Nest `CacheInterceptor`) on the public GETs, busted on any
  write to that resource.
- `Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=300` so a
  CDN in front of the API can absorb load.

---

## Frontend (Vite React)

- **Vite 6 + React 19 + TypeScript**, Tailwind CSS v4 (`@tailwindcss/vite`),
  shadcn/ui with the **radix** base (same `components.json` style as now), the
  `globals.css` brand token file copied verbatim.
- **Router**: `react-router` v7 (declarative mode - not the framework/SSR mode).
- **Data**: `@tanstack/react-query` + a typed `api.ts` fetch wrapper reading
  `import.meta.env.VITE_API_URL`.
- **SEO / prerender**: build with **`vite-react-ssg`** - it statically renders
  every listed route to real HTML (title, meta, OG) then hydrates as an SPA.
  Dynamic routes (`/services/:category`, `/products/:slug`, `/blog/:slug`) get
  their param list from `GET /api/*` at build time. Admin routes stay SPA-only
  (not prerendered, `noindex`).
- **Images**: `frontend/public/images/*` + `vite-imagetools` for responsive
  `srcset` on the hero/section photos; `agents.png` and `icon.svg` as-is.
- **Auth**: login page posts to `/api/auth/login`, stores the token
  (`localStorage` + in-memory), `<RequireAuth>` wraps the admin route group and
  redirects to `/admin/login` when absent; every admin query/mutation attaches
  the Bearer header; a 401 clears the token and bounces to login.
- **Theme**: default light, toggle persists per browser (unchanged UX).

Hosting: static output (`dist/`) to any static host / CDN.

---

## Environment variables

The repo `.env.local` already holds the real values. They split as:

### backend/.env
```
PORT=4000
FRONTEND_ORIGIN=https://ibill.ae            # comma-separated allowed origins
MONGODB_URI=<Atlas SRV URI>                 # from current .env.local
MONGODB_DB=ibill
AUTH_SECRET=<from current .env.local>
ADMIN_EMAIL=<from current .env.local>
ADMIN_PASSWORD=<from current .env.local>
CONTACT_NOTIFY_EMAIL=info@ibill.ae
RESEND_API_KEY=
CONTACT_FROM_EMAIL=IBILL Website <onboarding@resend.dev>
```

### frontend/.env
```
VITE_API_URL=https://api.ibill.ae/api       # backend base URL
VITE_SITE_URL=https://ibill.ae              # for canonical + OG absolute URLs
```

`NEXT_PUBLIC_SITE_URL` -> `VITE_SITE_URL`. Everything else moves to the backend.

---

## Phases

### Phase 0 - scaffold (no behaviour change)
1. `mkdir backend frontend`. Root Next.js untouched.
2. `backend`: `nest new` (or minimal manual), add `@nestjs/mongoose mongoose
   zod`, `.env.example`, `Dockerfile`, `npm run start:dev` on `PORT`.
3. `frontend`: `npm create vite@latest . -- --template react-ts`, add Tailwind v4,
   `react-router`, `@tanstack/react-query`, `vite-react-ssg`,
   `react-helmet-async`, shadcn init (radix), copy `globals.css` + `public/`.
4. Add root `package.json` workspaces (optional) + update `.gitignore`.

### Phase 1 - backend to parity
5. Port schemas -> `backend/src/schemas`, Mongo connection module.
6. Port `auth.ts` -> auth module (login/guard, Bearer), rate-limit login.
7. Port `crud.ts` + `resources.ts` -> generic `content` module; wire the 6
   resources; zod pipe; 503/seed-fallback rules.
8. `settings`, `leads`, `contact` (+ `email.service`) modules.
9. Public read controllers with cache + `Cache-Control`.
10. Port `scripts/seed.ts`; `npm run seed` against Atlas (already seeded - it will
    skip non-empty collections).
11. Verify every endpoint with curl against the parity checklist.

### Phase 2 - frontend to parity
12. Copy `components/ui`, `components/site`, `components/admin`; apply the
    mechanical component changes above.
13. Build the route tree; port each page to a query-driven component.
14. `api.ts` + `queries.ts` + `<Seo>` + `<RequireAuth>` + theme provider.
15. `vite-react-ssg` config: static route list + dynamic param loaders hitting
    the backend; `sitemap.xml` + `robots.txt` generation at build.
16. Point `VITE_API_URL` at the local backend; walk every route.

### Phase 3 - parity verification (must pass before cutover)
- Every public route renders the same content as the current site
  (`/`, `/about`, `/services`, `/services/accounting`, `/services/it`,
  `/products`, `/products/salon-assist`, `/blog`, `/contact`, 404).
- `curl` the prerendered HTML for `/` and `/about` - `<title>`, `<meta
  name=description>`, OG tags present without JS.
- Admin: login with env creds, CRUD a Service + Product + Post + Team +
  Testimonial + FAQ, edit Settings, see a Lead; confirm changes show on the
  public site; `/admin/*` blocked without token; changing `ADMIN_PASSWORD`
  invalidates the token.
- Contact form -> lead in Mongo + email path fires.
- `GET /api/health` -> `db: connected`.
- Lighthouse (frontend, prod build): Performance and SEO >= 95; compare TTFB /
  LCP against the current site to confirm the speed win.
- `backend`: `npm run build` clean; `frontend`: `npm run build` clean.

### Phase 4 - cutover (only after Phase 3 passes)
- Delete the Next.js app from the repo root:
  `src/`, `next.config.ts`, `next-env.d.ts`, `postcss.config.mjs`,
  `components.json`, `eslint.config.mjs` (root), `.next/`, `AGENTS.md`,
  `CLAUDE.md`, `scripts/` (moved to backend), root `.env.example`,
  and the Next deps from the root `package.json`.
- Keep: `.git`, `README.md` (rewritten for the two-app layout), `public/` only if
  not already moved, `MIGRATION.md`.
- Final root `package.json` = workspaces manifest with `dev`, `build`, `seed`
  scripts that fan out to `backend` + `frontend`.
- Update `README.md`: setup, env, `npm run dev` (both), deploy notes.

---

## Deploy notes (fill targets in - see questions)

- **backend**: Node 20+, `npm ci && npm run build && node dist/main.js`.
  `Dockerfile` provided. Needs the backend env vars + Atlas Network Access
  allowing the host IP. Expose `/api`. Put a CDN in front to honour
  `Cache-Control` if traffic warrants.
- **frontend**: `npm ci && npm run build` -> static `dist/`. Any static host.
  SPA fallback: rewrite all non-file routes to `/index.html` **except** the
  prerendered HTML files (the SSG output already contains per-route
  `index.html`, so a plain "serve file if exists else /index.html" works).
  Set `VITE_API_URL` + `VITE_SITE_URL` at build time.

---

## Rollback

The Next.js app stays fully intact and deployable through Phases 0-3. If the new
stack fails verification, keep shipping the Next.js app (optionally with a quick
perf patch: drop `force-dynamic`, add `export const revalidate = 60`, and a small
`unstable_cache` around the `getX` helpers - recovers most of the speed without
the re-platform).

---

## Progress log

- **Phase 0 done**: `backend/` (Nest 11, CJS, TS 5.7) + `frontend/` (Vite 8 + React 19)
  scaffolded, deps installed. Nest 12 + TS 6 caused a tsc OOM - pinned to the
  stable Nest 11 / TS 5.7 line. React Router pinned to **v6** (vite-react-ssg 0.9
  peers RR6, not RR7).
- **Phase 1 done**: backend API built + verified end-to-end against an in-memory
  MongoDB (`npm run start:memdb` / `npm run seed:memdb`, via
  `mongodb-memory-server`). All endpoints pass: public reads (+cache headers
  +CORS), auth (Bearer), admin `/admin/content/:resource` CRUD (+zod 400s),
  `/admin/settings`, `/admin/leads`, `/contact` (+honeypot). Route namespacing:
  generic admin CRUD lives at **`/api/admin/content/:resource`** to avoid
  collision with `/api/admin/leads` and `/api/admin/settings`.

### Blocker for Atlas verification

The dev machine's current public IP (`223.185.130.16`) is **not in the Atlas
cluster's Network Access allowlist** - both the old Next app and the new backend
fail to connect (`MongooseServerSelectionError`). Add that IP (or `0.0.0.0/0` for
dev) in Atlas > Network Access, then run `cd backend && npm run seed` and
`npm start` to verify against the real cluster. All local verification used
`mongodb-memory-server` instead.

- **Phase 2 done (verified locally)**: `frontend/` (Vite 8 + React 19 + React
  Router 6 + TanStack Query + `vite-react-ssg`). All 18 pages + 9 admin screens
  ported. `npm run build` prerenders 19 routes to static HTML with per-route
  `<title>`/meta/OG/canonical (a `scripts/postbuild.mjs` step also emits
  `sitemap.xml` + `robots.txt` and marks `/admin/*` + `/404` noindex).
  Verified: `npm run preview` (dist) + the mem-db API - home renders prerendered
  then hydrates and fetches services/testimonials/faqs/settings/posts from the
  API; admin login (Bearer token in localStorage) -> `/admin/services` shows the
  14 Mongo-backed services with working CRUD.
  Deploy configs added: `backend/Dockerfile` + `.dockerignore` +
  `ecosystem.config.cjs` (pm2); `frontend/vercel.json` + `netlify.toml` +
  `public/_redirects` (SPA fallback, asset caching).

### Still to do

1. **User: whitelist the deploy/dev IP in Atlas Network Access**, then
   `cd backend && npm run seed && npm start` and re-run the parity checks against
   the real cluster (local runs used `mongodb-memory-server`).
2. Local dev convenience: `backend` `npm run start:memdb` runs the API against an
   in-memory Mongo; use `npm start` once Atlas is reachable.
3. Root `package.json` -> npm-workspaces manifest; rewrite root `README.md`.
4. **Phase 4 cutover (after #1 passes):** delete the Next.js app from the repo
   root (`src/`, `next.config.ts`, `next-env.d.ts`, `postcss.config.mjs`,
   `components.json`, root `eslint.config.mjs`, `.next/`, `scripts/`, `AGENTS.md`,
   `CLAUDE.md`, root `.env*`) and the Next deps. The Next app is untouched and
   still deployable until then.

### Known limitation

Prerendered HTML contains the marketing **copy** (hero, headings, about text, FAQ
questions - all from constants) but not the API-fed **lists** (service cards,
testimonials) - those hydrate client-side. Fine for OG/social previews and
Google (renders JS); to also put the lists in the static HTML, add
`vite-react-ssg` data loaders that prime the QueryClient at build time.

---

## Phase 4 - cutover DONE (2026-09-01)

The Next.js app was deleted from the repo root: `src/`, `next.config.ts`,
`next-env.d.ts`, `postcss.config.mjs`, `components.json`, root `eslint.config.mjs`,
`.next/`, root `scripts/`, `AGENTS.md`, `CLAUDE.md`, root `package.json` /
`package-lock.json` / `tsconfig.json`, root `.env.example` / `.env.local`, root
`public/` (already copied into `frontend/public/`), `.data/`, root `node_modules`.

Repo root is now just `backend/` + `frontend/` + `README.md` + `MIGRATION.md` +
`.gitignore` + `.claude/`. No workspace manifest - the two apps are standalone
(install/build each in its own dir).

Secrets: `backend/.env` (gitignored) carries `MONGODB_URI`, `ADMIN_*`,
`AUTH_SECRET`, `CONTACT_NOTIFY_EMAIL` - same values the old root `.env.local` had.
