"""Report generation helpers for JSON + Markdown outputs."""

from __future__ import annotations

import datetime as dt
import json
from pathlib import Path

from schemas.agents import BatchSummary, FeatureGateReport


def _utc_stamp() -> str:
    return dt.datetime.now(dt.timezone.utc).strftime("%Y%m%dT%H%M%SZ")


def _feature_markdown(report: FeatureGateReport) -> str:
    feature = report.feature
    lines = [
        f"# {feature.id} - {feature.title}",
        "",
        f"**Source:** {feature.source}",
        f"**Submitted by:** {feature.submitted_by}",
        "",
        "## Brief",
        feature.raw_brief,
        "",
        "## Validation Signals",
        f"- Google Trends: {report.validation_signals.trends.signal_summary}",
        f"- Reddit: {report.validation_signals.reddit.signal_summary}",
        f"- Hacker News: {report.validation_signals.hackernews.signal_summary}",
        f"- GitHub: {report.validation_signals.github.signal_summary}",
        "",
        "## Agent Outputs",
        f"- Strategic Fit: **{report.strategic_fit.score}/10**",
        f"- Evidence: **{report.evidence.evidence_score}/10**",
        f"- Sizing: **{report.sizing.tshirt.value}** ({report.sizing.person_weeks_estimate} person-weeks)",
        f"- RICE: **{report.roi.rice.score:.2f}**",
        f"- Custom: **{report.roi.custom.score:.2f}**",
        "",
        "## Verdict",
        f"- **{report.verdict.verdict.value}** (confidence: {report.verdict.confidence:.2f})",
        f"- Rationale: {report.verdict.one_line_rationale}",
        "",
        "## What would change my mind",
    ]
    if report.verdict.what_would_change_my_mind:
        lines.extend(f"- {item}" for item in report.verdict.what_would_change_my_mind)
    else:
        lines.append("- None provided.")
    lines.extend(
        [
            "",
            "## Recommended next step",
            report.verdict.recommended_next_step,
            "",
        ]
    )
    return "\n".join(lines)


def _summary_markdown(summary: BatchSummary) -> str:
    lines = ["# Feature Gate Batch Summary", ""]
    lines.append("## GO (ranked)")
    if summary.go_ranked:
        for idx, item in enumerate(summary.go_ranked, start=1):
            lines.append(
                f"{idx}. {item.feature_id} - {item.title} (RICE={item.rice_score:.2f}, "
                f"Custom={item.custom_score:.2f}, confidence={item.confidence:.2f})"
            )
    else:
        lines.append("- None")
    lines.append("")

    lines.append("## PARK_PENDING_EVIDENCE")
    if summary.park_pending_evidence:
        for item in summary.park_pending_evidence:
            lines.append(f"- {item.feature_id} - {item.title}")
    else:
        lines.append("- None")
    lines.append("")

    lines.append("## NO_GO")
    if summary.no_go:
        for item in summary.no_go:
            lines.append(f"- {item.feature_id} - {item.title}")
    else:
        lines.append("- None")
    lines.append("")
    return "\n".join(lines)


def write_reports(
    reports: list[FeatureGateReport],
    summary: BatchSummary,
    output_dir: Path,
) -> dict[str, Path]:
    output_dir.mkdir(parents=True, exist_ok=True)
    stamp = _utc_stamp()

    json_path = output_dir / f"feature_gate_report_{stamp}.json"
    summary_md_path = output_dir / f"feature_gate_summary_{stamp}.md"
    feature_md_dir = output_dir / f"features_{stamp}"
    feature_md_dir.mkdir(parents=True, exist_ok=True)

    payload = {
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "summary": summary.model_dump(mode="json"),
        "reports": [report.model_dump(mode="json") for report in reports],
    }
    json_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    summary_md_path.write_text(_summary_markdown(summary), encoding="utf-8")

    for report in reports:
        feature_md_path = feature_md_dir / f"{report.feature.id}.md"
        feature_md_path.write_text(_feature_markdown(report), encoding="utf-8")

    return {
        "json": json_path,
        "summary_markdown": summary_md_path,
        "feature_markdown_dir": feature_md_dir,
    }
