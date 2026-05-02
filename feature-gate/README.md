# Feature Gate

A multi-agent system that takes feature requests and returns auditable go/no-go verdicts grounded in external evidence.

Built for the Senior PM (Platform & AI) take-home — but designed as a real PM workbench.

## What it does

Given a feature brief (or a batch of them), the system:

1. **Validates externally** — pulls signal from Google Trends, Reddit, Hacker News, GitHub before any LLM scoring.
2. **Runs 5 specialist agents in parallel** — Strategic Fit, Evidence, Sizing, ROI, Risk.
3. **Synthesizes a verdict** — GO / NO_GO / PARK_PENDING_EVIDENCE with confidence and a "what would change my mind" list.
4. **Ranks the backlog** when fed multiple features.
5. **Pushes GOs to Linear** via Claude + Linear MCP — one-click issue tree creation.

## The opinionated bit

Most feature-scoring tools rank features. This one **separates what we know from what we are assuming**. The Evidence Agent classifies every claim in the brief as `validated | anecdotal | assumption | opinion` and surfaces "assumptions in disguise" — sentences written as facts but unsupported. RICE confidence is *driven by* the evidence score; it is not invented.

## Architecture

```
inputs/features.json
       |
       v
  validators/  (parallel REST calls, free APIs)
       |
       v
  +----------------------------------------+
  |  5 agents run in parallel              |
  |  +----------+ +----------+ +--------+  |
  |  |Strategic | | Evidence | | Sizing |  |
  |  |  Fit     | |          | |        |  |
  |  +----------+ +----------+ +--------+  |
  |  +----------+ +----------+             |
  |  |   ROI    | |   Risk   |             |
  |  +----------+ +----------+             |
  +----------------------------------------+
       |
       v
  verdict agent (synthesizes)
       |
       v
  FeatureGateReport (JSON + Markdown)
       |
       v
  Linear MCP (creates issue tree for GOs)
```

## Run it

```bash
pip install -r requirements.txt
cp .env.example .env  # fill in keys
streamlit run ui/streamlit_app.py
```

Or CLI:
```bash
python main.py --input inputs/features.json --output outputs/reports/
```

## Project status

- [x] Schemas
- [x] Agent prompts
- [x] Sample data
- [x] Validators
- [x] Orchestrator
- [ ] Streamlit UI
- [ ] Linear MCP integration
