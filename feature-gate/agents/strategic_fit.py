from __future__ import annotations

from schemas.agents import FeatureRequest, StrategicFitOutput

from .base import run_agent


def run_strategic_fit(feature: FeatureRequest, product_strategy: str) -> StrategicFitOutput:
    payload = {
        "product_strategy": product_strategy,
        "feature_request": feature.model_dump(),
    }
    return run_agent(
        prompt_name="strategic_fit.md",
        output_model=StrategicFitOutput,
        payload=payload,
    )
