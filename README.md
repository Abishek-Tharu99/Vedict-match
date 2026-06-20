# Vedic Marriage Compatibility

Ashtakoot (36-point Guna Milan) compatibility app. You enter two people's birth
details and it works out a full report — the eight kootas, dosha screening, a
compatibility matrix, stability metrics and a final verdict.

It's a small npm-workspaces monorepo:

```
vedic-match/
  shared/   Zod schemas + inferred types (the API contract, used by both sides)
  server/   Express API + the Vedic engine + Drizzle/pg
  client/   Vite + React SPA
```

- Frontend: Vite + React 19 + TypeScript (wouter, TanStack Query, Recharts, Tailwind v4)
- Backend: Express 5 + TypeScript (Drizzle ORM, node-postgres, Zod, Pino, Helmet)
- Database: PostgreSQL

The engine is a heuristic — it uses simplified mean-longitude math, so treat it as
guidance/entertainment, not real jyotish.

## Requirements

- Node 20+
- A PostgreSQL database

## Setup

```
npm install
cp .env.example .env        # set DATABASE_URL
npm run db:push             # creates the match_reports table
```

`db:push` uses drizzle-kit. If you'd rather apply the SQL by hand there's
`server/schema.sql` (`psql "$DATABASE_URL" -f server/schema.sql`).

No database handy? A throwaway one in Docker is enough:

```
docker run -d --name vedic-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16-alpine
# then in .env:  DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
```

## Running it

```
npm run dev
```

API comes up on `:3000`, the Vite dev server on `:5173` (it proxies `/api` to the
API). To run them on their own use `npm run dev:server` / `npm run dev:client`.

Once it's up: fill in both partners on the home page (pick a city from the
suggestions so the coordinates and timezone get set), hit compute, and you get the
report. "Save report" persists it and gives you a private link — the link carries a
token, and that token is the only way back to the report. The Reports tab lists
whatever you've saved on this device. There's a light/dark toggle in the header.

## Build / production

```
npm run build      # shared, then client (into server/public), then server (into server/dist)
npm start          # a single node process serves the API and the built SPA
```

## Environment variables

```
DATABASE_URL    required    Postgres connection string
PORT            3000        server port
NODE_ENV        -           set to "production" to enable the https redirect, trust proxy and static serving
LOG_LEVEL       info        pino log level
CORS_ORIGIN     -           comma-separated origins, only needed if the frontend is on a different host
DATABASE_SSL    -           "true" to connect to Postgres over TLS (most managed providers)
```

## API

```
GET     /api/healthz               health check
GET     /api/geocode?q=            city search (proxies Open-Meteo)
POST    /api/match                 compute a report, don't save it
POST    /api/reports               compute and save, returns a one-time token
GET     /api/reports/:id?t=TOKEN   fetch a saved report
DELETE  /api/reports/:id?t=TOKEN   delete a saved report
```

Saved reports aren't listed or enumerated anywhere — each one is only reachable
with the token handed back when it was saved (stored as a sha-256 hash, never in
the clear). The client keeps your tokens in localStorage and builds the Reports
page from them. There are no user accounts; if you need proper per-user ownership
you'd have to add an auth layer.

## Security defaults

Helmet sets the headers (CSP, HSTS, nosniff, frameguard...). In production http is
redirected to https and the app trusts one proxy hop. There's a general rate limit
on `/api` and a stricter one on the expensive routes (geocode, match, save). CORS
is same-origin unless you set `CORS_ORIGIN`. Bodies are capped at 32kb.

For deployment: keep `DATABASE_URL` in the environment (not in git), put Postgres
on a private network rather than the open internet, and set `DATABASE_SSL=true` if
your provider needs TLS.

## The engine

`server/src/lib/vedic.ts` approximates each person's moon sign, nakshatra, lagna
and Mars placement from date/time/place, scores the eight kootas (36 total) and
screens for the Mangal, Bhakoot and Nadi doshas. Score bands: 28+ excellent, 22+
good, 18+ average, below that risky.
