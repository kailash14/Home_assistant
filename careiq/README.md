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

## Cost Economics

~₹4.3 per visit (3 API calls, ~2,500 input + ~1,900 output tokens). At 10,000 monthly visits: ~₹43,000/month in AI costs.

## Design Document

Full system design including architecture decisions, prompt design principles, compliance/security framework, metrics, and trade-off analysis is in the root `README.md` and the design document provided in the project brief.
