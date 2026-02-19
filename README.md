# GDPR QuickScan

A compliance signal scanner that checks websites for GDPR-related signals. Paste a URL, get a risk score and structured findings with evidence.

**This is not legal advice.** It identifies compliance *signals* — always consult a qualified professional for legal guidance.

## What it checks

| Category | Signals |
|---|---|
| **Privacy Policy** | Presence, controller identity, contact info, purposes, lawful basis, retention, sharing, transfers, rights, complaint authority |
| **Cookie Consent** | Banner present, manage preferences, categories, non-essential scripts before consent |
| **Data Collection** | Forms, consent/purpose near forms, "Do not sell/share" |
| **User Rights** | Access, deletion, rectification, portability, objection mentions, contact method |
| **Security/Transfers** | HTTPS, international transfer mentions, data protection measures |

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui
- **Supabase** (Postgres + Auth)
- **Playwright** (headless Chromium crawler)
- **OpenAI Responses API** (AI evaluation, server-side only)

## Local Development

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier works)
- An [OpenAI](https://platform.openai.com) API key

### 1. Clone and install

```bash
git clone <your-repo-url>
cd gdpr_check
npm install
```

### 2. Install Playwright browsers

```bash
npx playwright install --with-deps chromium
```

### 3. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/migrations.sql`
3. Copy your project URL, anon key, and service role key from **Settings → API**

### 4. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-4o-mini
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docker Deployment

### Build and run locally

```bash
docker build -t gdpr-quickscan .
docker run -p 3000:3000 --env-file .env.local gdpr-quickscan
```

Or with Docker Compose:

```bash
docker compose up --build
```

### Deploy to Railway / Fly.io / Render

1. **Push your repo** to GitHub
2. **Connect** the repo to Railway, Fly.io, or Render
3. **Set environment variables** in the platform's dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (optional, defaults to `gpt-4o-mini`)
4. **Deploy** — the Dockerfile installs Chromium so Playwright works in the container

#### Railway

```bash
railway login
railway init
railway up
```

#### Fly.io

```bash
fly launch
fly secrets set NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... SUPABASE_SERVICE_ROLE_KEY=... OPENAI_API_KEY=...
fly deploy
```

## Project Structure

```
app/
  (auth)/login/page.tsx       # Login page
  (auth)/signup/page.tsx      # Signup page
  dashboard/page.tsx          # Dashboard with scan form + scan list
  scans/[id]/page.tsx         # Scan detail with score + findings
  api/scan/route.ts           # POST — create and run scan
  api/scans/[id]/route.ts     # GET — fetch scan by ID
  layout.tsx                  # Root layout
  page.tsx                    # Landing page
components/
  ScanForm.tsx                # URL input form
  ScanList.tsx                # Table of previous scans
  ScoreCard.tsx               # Score ring + summary
  FindingsTable.tsx           # Findings with severity badges + evidence
  ui/                         # shadcn/ui primitives
lib/
  supabase/client.ts          # Browser Supabase client
  supabase/server.ts          # Server Supabase client
  supabase/middleware.ts       # Auth middleware helper
  scanner/types.ts            # TypeScript types
  scanner/crawl.ts            # Playwright crawler
  scanner/extract.ts          # Signal extraction from HTML
  scanner/evaluate.ts         # OpenAI Responses API evaluator
middleware.ts                 # Next.js middleware (auth protection)
supabase/migrations.sql       # Database schema + RLS policies
Dockerfile                    # Production container with Chromium
docker-compose.yml            # Local Docker setup
```

## How a scan works

1. User pastes a URL on `/dashboard`
2. Frontend calls `POST /api/scan` with `{ url }`
3. API route validates the URL and creates a `scans` row (`status=running`)
4. Playwright crawls the homepage + discovers internal policy/legal pages (up to 5 total)
5. Extractor pulls visible text, detects cookie banners, forms, trackers, privacy links
6. Evidence bundle is sent to OpenAI Responses API with a strict JSON schema
7. Result (score, summary, findings) is stored and returned
8. UI displays the score card, findings with evidence, and recommendations

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server only) |
| `OPENAI_API_KEY` | Yes | OpenAI API key (server only) |
| `OPENAI_MODEL` | No | Model to use (default: `gpt-4o-mini`) |
