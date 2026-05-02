from __future__ import annotations

from schemas.agents import EvidenceOutput, FeatureRequest, ValidationSignals

from .base import run_agent


def run_evidence(feature: FeatureRequest, validation_signals: ValidationSignals) -> EvidenceOutput:
    payload = {
        "feature_request": feature.model_dump(mode="json"),
        "validation_signals": validation_signals.model_dump(mode="json"),
        "validation_signal_summary": validation_signals.combined_summary,
    }
    return run_agent(
        prompt_name="evidence.md",
        output_model=EvidenceOutput,
        payload=payload,
    )
