# TV Time

A TV Time-style episode tracker: search shows, add them to your library, mark episodes watched, see upcoming air dates, and check your watch stats.

## Stack

- `server/` — Express + TypeScript API, SQLite via Prisma, JWT auth
- `client/` — React + Vite + TypeScript + Tailwind

## Setup

```bash
npm install
```

### Server

```bash
cd server
cp .env.example .env   # already done for local dev
npx prisma migrate dev
npm run dev             # http://localhost:4000
```

By default the app runs on a bundled catalog of sample shows (no external API needed). To pull real shows from [TMDB](https://www.themoviedb.org/settings/api):

1. Create a free TMDB account and generate an API key (Settings → API).
2. Put it in `server/.env`:
   ```
   TMDB_API_KEY=your_key_here
   ```
3. Restart the server.

### Client

```bash
cd client
npm run dev              # http://localhost:5173
```

The Vite dev server proxies `/api` requests to the backend on port 4000.

## Data

Each user has their own library, watched episodes, and stats. Shows/episodes are cached locally the first time they're looked up (from TMDB or the sample catalog), so repeat visits don't re-fetch them.
