"""Feature Gate orchestration pipeline."""

from __future__ import annotations

import asyncio
from pathlib import Path
from typing import Iterable

from agents import (
    run_evidence,
    run_risk,
    run_roi,
    run_sizing,
    run_strategic_fit,
    run_verdict,
)
from ranker import rank_reports
from schemas import (
    BatchSummary,
    FeatureGateReport,
    FeatureRequest,
)
from validators import run_all_validators


PROJECT_ROOT = Path(__file__).resolve().parent
DEFAULT_PRODUCT_STRATEGY_PATH = PROJECT_ROOT / "context" / "product_strategy.md"


def _load_product_strategy(path: str | None = None) -> str:
    strategy_path = Path(path) if path else DEFAULT_PRODUCT_STRATEGY_PATH
    return strategy_path.read_text(encoding="utf-8")


async def run_feature_pipeline(
    feature: FeatureRequest,
    product_strategy: str,
) -> FeatureGateReport:
    """Run validators + all agents for one feature request."""
    validation_signals = await run_all_validators(feature)

    strategic_fit_task = asyncio.to_thread(
        run_strategic_fit, feature=feature, product_strategy=product_strategy
    )
    evidence_task = asyncio.to_thread(
        run_evidence, feature=feature, validation_signals=validation_signals
    )
    sizing_task = asyncio.to_thread(run_sizing, feature=feature)

    strategic_fit, evidence, sizing = await asyncio.gather(
        strategic_fit_task, evidence_task, sizing_task
    )

    roi_task = asyncio.to_thread(
        run_roi,
        feature=feature,
        strategic_fit=strategic_fit,
        evidence=evidence,
        sizing=sizing,
    )
    risk_task = asyncio.to_thread(
        run_risk,
        feature=feature,
        strategic_fit=strategic_fit,
        sizing=sizing,
    )
    roi, risk = await asyncio.gather(roi_task, risk_task)

    verdict = await asyncio.to_thread(
        run_verdict,
        strategic_fit=strategic_fit,
        evidence=evidence,
        sizing=sizing,
        roi=roi,
        risk=risk,
    )

    return FeatureGateReport(
        feature=feature,
        validation_signals=validation_signals,
        strategic_fit=strategic_fit,
        evidence=evidence,
        sizing=sizing,
        roi=roi,
        risk=risk,
        verdict=verdict,
    )


async def run_batch(
    features: Iterable[FeatureRequest],
    *,
    concurrency: int = 5,
    product_strategy_path: str | None = None,
) -> tuple[list[FeatureGateReport], BatchSummary]:
    """Run Feature Gate for a batch of features with bounded concurrency."""
    strategy = _load_product_strategy(product_strategy_path)
    semaphore = asyncio.Semaphore(concurrency)

    async def _run_with_limit(feature: FeatureRequest) -> FeatureGateReport:
        async with semaphore:
            return await run_feature_pipeline(feature=feature, product_strategy=strategy)

    reports = await asyncio.gather(*(_run_with_limit(feature) for feature in features))
    summary = rank_reports(reports)
    return reports, summary
