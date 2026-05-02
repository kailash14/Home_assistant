"""Ranking logic for batch feature evaluation outputs."""

from __future__ import annotations

from schemas import BatchSummary, FeatureGateReport, RankedFeature, VerdictEnum


def _to_ranked_feature(report: FeatureGateReport) -> RankedFeature:
    return RankedFeature(
        feature_id=report.feature.id,
        title=report.feature.title,
        verdict=report.verdict.verdict,
        rice_score=round(report.roi.rice.score, 2),
        custom_score=round(report.roi.custom.score, 2),
        strategic_fit_score=report.strategic_fit.score,
        evidence_score=report.evidence.evidence_score,
        confidence=round(report.verdict.confidence, 2),
    )


def rank_reports(reports: list[FeatureGateReport]) -> BatchSummary:
    """Create ranked GO list and grouped PARK/NO_GO lists."""
    items = [_to_ranked_feature(report) for report in reports]

    go_items = [item for item in items if item.verdict == VerdictEnum.GO]
    park_items = [item for item in items if item.verdict == VerdictEnum.PARK_PENDING_EVIDENCE]
    no_go_items = [item for item in items if item.verdict == VerdictEnum.NO_GO]

    go_items.sort(key=lambda item: (item.rice_score, item.custom_score), reverse=True)
    park_items.sort(key=lambda item: (item.evidence_score, item.strategic_fit_score), reverse=True)
    no_go_items.sort(key=lambda item: (item.strategic_fit_score, item.evidence_score))

    return BatchSummary(
        go_ranked=go_items,
        park_pending_evidence=park_items,
        no_go=no_go_items,
    )
