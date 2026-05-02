from __future__ import annotations

from schemas.agents import FeatureRequest, RiskOutput, SizingOutput, StrategicFitOutput

from .base import run_agent


def run_risk(
    feature: FeatureRequest,
    sizing: SizingOutput,
    strategic_fit: StrategicFitOutput,
) -> RiskOutput:
    payload = {
        "feature_request": feature.model_dump(mode="json"),
        "sizing": sizing.model_dump(mode="json"),
        "strategic_fit": strategic_fit.model_dump(mode="json"),
    }
    return run_agent(prompt_name="risk.md", output_model=RiskOutput, payload=payload)
