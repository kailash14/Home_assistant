"""ROI agent wrapper."""

from __future__ import annotations

from schemas.agents import EvidenceOutput, FeatureRequest, ROIOutput, SizingOutput, StrategicFitOutput

from .base import run_agent


def run_roi(
    feature: FeatureRequest,
    strategic_fit: StrategicFitOutput,
    evidence: EvidenceOutput,
    sizing: SizingOutput,
) -> ROIOutput:
    payload = {
        "feature_request": feature.model_dump(mode="json"),
        "strategic_fit_output": strategic_fit.model_dump(mode="json"),
        "evidence_output": evidence.model_dump(mode="json"),
        "sizing_output": sizing.model_dump(mode="json"),
    }
    return run_agent(prompt_name="roi.md", output_model=ROIOutput, payload=payload)
