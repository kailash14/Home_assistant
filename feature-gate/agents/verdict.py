from __future__ import annotations

from schemas.agents import (
    EvidenceOutput,
    ROIOutput,
    RiskOutput,
    SizingOutput,
    StrategicFitOutput,
    VerdictOutput,
)

from .base import run_agent


def run_verdict(
    strategic_fit: StrategicFitOutput,
    evidence: EvidenceOutput,
    sizing: SizingOutput,
    roi: ROIOutput,
    risk: RiskOutput,
) -> VerdictOutput:
    payload = {
        "strategic_fit": strategic_fit.model_dump(mode="json"),
        "evidence": evidence.model_dump(mode="json"),
        "sizing": sizing.model_dump(mode="json"),
        "roi": roi.model_dump(mode="json"),
        "risk": risk.model_dump(mode="json"),
    }
    return run_agent(
        prompt_name="verdict.md",
        output_model=VerdictOutput,
        payload=payload,
    )
