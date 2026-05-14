<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

### Project layout

The main application is in `/workspace/careiq/` (Next.js 16, TypeScript, Tailwind CSS v4). There is also a standalone prototype at `/workspace/careiq-nurse-copilot.jsx` (single-file React, not part of the build system).

### Running the app

- `npm run dev` — starts Next.js dev server on port 3000 (from `/workspace/careiq/`)
- `npm run build` — production build (also validates TypeScript)
- `npm run lint` — ESLint (flat config, `eslint.config.mjs`)

### Environment variables

- `ANTHROPIC_API_KEY` — required for live AI features (analysis, care plan, handoff). Without it the app still loads and the "Load Demo Data" button works to show pre-computed results.
- Create a `.env.local` file in `/workspace/careiq/` with `ANTHROPIC_API_KEY=sk-ant-...` to enable live AI calls.

### No external services required

There is no database, Redis, or Docker dependency. All patient data is static in `src/data/patients.ts`. The only external dependency is the Anthropic API (optional for demo mode).

### Testing notes

- There is no test suite configured (no `jest`, `vitest`, or similar). Validation is done via `npm run lint` and `npm run build` (TypeScript strict mode).
- Manual testing: use "Load Demo Data" button to test the full UI flow without an API key.
- The three API routes (`/api/analyze`, `/api/care-plan`, `/api/handoff`) can be tested with curl if `ANTHROPIC_API_KEY` is set.
