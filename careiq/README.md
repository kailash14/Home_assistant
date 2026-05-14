# CareIQ — AI Nurse Copilot

A real-time clinical decision-support system for home healthcare nurses in India. Built as a prototype for the Apollo Healthcare Lead PM (AI) case study.

## What It Does

CareIQ processes structured vitals and unstructured nurse notes through Claude Sonnet 4 to produce:

- **Visit Analysis** — risk flags with severity (critical/high/medium/low), NLP entity extraction (symptoms, medications stopped/current, social determinants), vitals assessment, prioritized care actions with owner assignment, and escalation decision
- **7-Day Care Plan** — personalized to the patient's risk profile and social context, with daily schedule, medication changes, monitoring parameters, and patient education
- **SBAR Shift Handoff** — clinical handoff summary for the incoming nurse with critical alerts and pending tasks
- **API Inspector** — real-time view of every Anthropic API request/response with token counts and latency

## Three Demo Patients

| Patient | Program | Risk | Scenario |
|---------|---------|------|---------|
| Lakshmi Devi (67F) | Chronic Care | 82 (Critical) | Self-discontinued antihypertensive, bilateral edema, active diabetic foot wound, lives alone |
| Rajesh Sharma (55M) | Post-Surgical | 45 (Medium) | Post-CABG Day 18, normal healing, exertional chest discomfort, work anxiety |
| Fatima Begum (78F) | Respiratory | 71 (High) | COPD Stage III, SpO2 89% below baseline, yellow-green sputum, O2 non-compliance, fall risk |

## Quick Start

```bash
# Clone and install
cd careiq
npm install

# Add your Anthropic API key
cp .env.example .env.local
# Edit .env.local and add ANTHROPIC_API_KEY=sk-ant-...

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**No API key?** Click "Load Demo Data" in the header to see pre-computed analysis for the primary demo patient.

## Tech Stack

| Component | Choice |
|-----------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Inline styles + Tailwind CSS (globals) |
| LLM | Claude Sonnet 4 via Anthropic Messages API |
| Fonts | DM Sans + DM Mono (Google Fonts) |
| State | React useState hooks |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with DM Sans/DM Mono fonts
│   ├── page.tsx            # Main CareIQ page (all state management here)
│   └── api/
│       ├── analyze/        # POST — visit intelligence analysis
│       ├── care-plan/      # POST — 7-day care plan generation
│       └── handoff/        # POST — SBAR shift handoff
├── components/
│   ├── PatientSidebar.tsx  # Patient list with risk badges
│   ├── PatientHeader.tsx   # Demographics, conditions, risk score
│   ├── VitalsGrid.tsx      # 6-card vitals display with status colors
│   ├── NurseNotesEditor.tsx# Editable textarea + visit history
│   ├── AnalysisResults.tsx # Risk flags, entities, care actions, escalation
│   ├── CarePlanView.tsx    # 7-day care plan display
│   ├── HandoffView.tsx     # SBAR format handoff display
│   ├── ApiInspector.tsx    # Real-time request/response log panel
│   └── ui/
│       ├── SeverityBadge.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── anthropic.ts        # Claude API client wrapper with retry logic
│   ├── prompts.ts          # All three system prompts
│   ├── validators.ts       # Vitals range validation + schema normalization
│   └── patient-context.ts  # User message construction
├── data/
│   ├── patients.ts         # 3 synthetic demo patients
│   ├── demo-analysis.ts    # Pre-computed analysis for offline demo
│   ├── demo-care-plan.ts   # Pre-computed care plan for offline demo
│   └── demo-handoff.ts     # Pre-computed handoff for offline demo
└── types/
    ├── patient.ts
    ├── analysis.ts
    ├── care-plan.ts
    └── handoff.ts
```

## API Overview

All routes validate input, call Anthropic's Messages API, parse and schema-normalize the JSON response, and return both the result and request metadata for the API Inspector.

### POST /api/analyze
Input: `{ patient, notes }` → Output: clinical assessment with risk flags, entities, vitals assessment, care actions, escalation decision

### POST /api/care-plan
Input: `{ analysis }` → Output: 7-day care plan with goals, schedule, monitoring parameters, patient education

### POST /api/handoff
Input: `{ patient, notes, riskFlags }` → Output: SBAR summary with critical alerts and pending tasks

## Deployment

### Option 1 — Vercel (recommended, 5 minutes)

Vercel is built by the Next.js team; zero-config, free tier, automatic HTTPS, global CDN.

**Step 1 — Push to GitHub**

Make sure your code is pushed to a GitHub repository (public or private).

**Step 2 — Import to Vercel**

1. Go to [vercel.com/new](https://vercel.com/new) and click **"Add New Project"**.
2. Connect your GitHub account and select this repository.
3. In the **"Configure Project"** screen, expand **"Root Directory"** and type `careiq` (the app lives in the `careiq/` subdirectory, not the repo root).
4. Vercel will auto-detect Next.js — leave Framework Preset as **Next.js**.

**Step 3 — Set the environment variable**

In the same "Configure Project" screen, under **"Environment Variables"**:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` (your key from [console.anthropic.com](https://console.anthropic.com/)) |

**Step 4 — Deploy**

Click **"Deploy"**. Vercel will install, build, and deploy in ~1 minute. Your app will be live at `https://<your-project>.vercel.app`.

**Subsequent deploys** are automatic on every `git push` to `main`.

---

### Option 2 — Railway

Railway is a good choice if you prefer container-based hosting with a simple UI.

1. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo**.
2. Select this repository.
3. Set **Root Directory** to `careiq`.
4. Under **Variables**, add `ANTHROPIC_API_KEY`.
5. Railway will run `npm run build && npm run start` automatically.

---

### Option 3 — Render

1. Go to [render.com](https://render.com) → **New → Web Service**.
2. Connect your GitHub repository, set **Root Directory** to `careiq`.
3. Set:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
4. Add `ANTHROPIC_API_KEY` in the **Environment** tab.
5. Click **Create Web Service**.

---

### Option 4 — Docker (self-hosted)

A `Dockerfile` with multi-stage build (deps → builder → runner) is included. It uses Next.js [standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output) for a minimal container image.

```bash
# Build the image
docker build -t careiq .

# Run locally (replace the key value)
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=sk-ant-api03-... careiq
```

Open `http://localhost:3000`.

For production, deploy this image to any container platform (GCP Cloud Run, AWS ECS, Azure Container Apps, fly.io, etc.) and set `ANTHROPIC_API_KEY` as a secret environment variable in that platform's UI.

---

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes (for live AI) | Your Anthropic API key. Without it, the UI still works in **Demo Mode** (pre-computed results). Get one at [console.anthropic.com](https://console.anthropic.com/). |

> **Security note:** `ANTHROPIC_API_KEY` is used only in server-side API routes (`/api/analyze`, `/api/care-plan`, `/api/handoff`). It is never exposed to the browser.

---

## Cost Economics

~₹4.3 per visit (3 API calls, ~2,500 input + ~1,900 output tokens). At 10,000 monthly visits: ~₹43,000/month in AI costs.

## Design Document

Full system design including architecture decisions, prompt design principles, compliance/security framework, metrics, and trade-off analysis is in the root `README.md` and the design document provided in the project brief.
