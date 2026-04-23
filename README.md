# CareIQ AI Nurse Copilot (Prototype)

Single-file React prototype for the CareIQ design spec.

## Files

- `careiq-nurse-copilot.jsx`: complete prototype app (UI + prompts + API calls + demo fallback data).

## Prototype Features

- Three synthetic patient scenarios (critical, medium, high risk).
- Editable nurse notes and vitals-aware validation checks.
- Live Anthropic Messages API calls for:
  - Visit Intelligence Analysis
  - 7-day Care Plan generation
  - Shift Handoff (SBAR) generation
- Demo fallback mode (`Load Demo Data`) if API calls fail.
- API Inspector panel with raw request/response and latency logs.
- API Reference tab summarizing request templates and flow.

## Runtime Notes

- The app imports only from `react`.
- API calls are sent to `https://api.anthropic.com/v1/messages`.
- Request headers include only `Content-Type: application/json` (no API key header in code).
- Response parsing uses `data.content[0].text` and `JSON.parse(...)`.

## How to Use

1. Render `careiq-nurse-copilot.jsx` inside any React-compatible runtime.
2. Select a patient from the sidebar.
3. Edit notes if needed, then click **Run AI Analysis**.
4. Generate **7-Day Care Plan** and **Shift Handoff** after analysis.
5. If connectivity is unavailable, click **Load Demo Data**.

## Design Alignment

The implementation follows the provided design document requirements:
- single-page React app
- inline styling
- no external npm dependencies beyond React
- structured JSON prompts/schemas for all three LLM workflows
