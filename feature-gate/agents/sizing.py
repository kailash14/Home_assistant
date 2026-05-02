from __future__ import annotations

from schemas.agents import FeatureRequest, SizingOutput

from .base import run_agent

TECH_CONTEXT = (
    "Azure cloud-native stack: Cosmos DB, Durable Functions, APIM, Event Grid, "
    "Python/.NET services, React frontend."
)


def run_sizing(feature: FeatureRequest) -> SizingOutput:
    payload = {
        "feature_request": feature.model_dump(),
        "tech_context": TECH_CONTEXT,
    }
    return run_agent(
        prompt_name="sizing.md",
        output_model=SizingOutput,
        payload=payload,
    )
