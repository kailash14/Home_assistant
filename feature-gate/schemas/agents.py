from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field, field_validator, model_validator


class VerdictEnum(str, Enum):
    GO = "GO"
    NO_GO = "NO_GO"
    PARK_PENDING_EVIDENCE = "PARK_PENDING_EVIDENCE"


class SignalStrength(str, Enum):
    NONE = "none"
    WEAK = "weak"
    MODERATE = "moderate"
    STRONG = "strong"


class ClaimType(str, Enum):
    VALIDATED = "validated"
    ANECDOTAL = "anecdotal"
    ASSUMPTION = "assumption"
    OPINION = "opinion"


class TShirtSize(str, Enum):
    XS = "XS"
    S = "S"
    M = "M"
    L = "L"
    XL = "XL"


class RiskCategory(str, Enum):
    TECHNICAL = "technical"
    GTM = "gtm"
    DEPENDENCY = "dependency"
    COMPLIANCE = "compliance"
    OPPORTUNITY_COST = "opportunity_cost"
    OTHER = "other"


class Level(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class FeatureRequest(BaseModel):
    id: str = Field(..., min_length=1)
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    source: str = Field(..., min_length=1)
    submitted_by: str = Field(..., min_length=1)
    raw_brief: str = Field(..., min_length=1)


class ValidatorSignal(BaseModel):
    queried: str
    raw: list[dict[str, Any]] = Field(default_factory=list)
    signal_summary: str
    signal_strength: SignalStrength


class ValidationSignals(BaseModel):
    trends: ValidatorSignal
    reddit: ValidatorSignal
    hackernews: ValidatorSignal
    github: ValidatorSignal
    combined_summary: str


class StrategicFitOutput(BaseModel):
    score: int = Field(..., ge=0, le=10)
    aligned_pillars: list[str] = Field(default_factory=list)
    misalignment_concerns: list[str] = Field(default_factory=list)
    rationale: str

    @model_validator(mode="after")
    def enforce_score_rule(self) -> "StrategicFitOutput":
        if not self.aligned_pillars and self.score > 4:
            raise ValueError("score must be <= 4 when aligned_pillars is empty")
        return self


class EvidenceClaim(BaseModel):
    text: str
    type: ClaimType
    supporting_signal: str | None = None
    evidence_gap: str | None = None


class EvidenceOutput(BaseModel):
    evidence_score: int = Field(..., ge=0, le=10)
    claims: list[EvidenceClaim] = Field(default_factory=list)
    assumptions_in_disguise: list[str] = Field(default_factory=list)
    missing_evidence: list[str] = Field(default_factory=list)
    rationale: str


class SizingOutput(BaseModel):
    tshirt: TShirtSize
    person_weeks_estimate: float = Field(..., ge=0)
    complexity_drivers: list[str] = Field(default_factory=list)
    hidden_complexity: list[str] = Field(default_factory=list)
    rationale: str

    @model_validator(mode="after")
    def validate_tshirt_band(self) -> "SizingOutput":
        bands = {
            TShirtSize.XS: (0.5, 1),
            TShirtSize.S: (1, 3),
            TShirtSize.M: (3, 8),
            TShirtSize.L: (8, 20),
            TShirtSize.XL: (20, float("inf")),
        }
        lower, upper = bands[self.tshirt]
        value = self.person_weeks_estimate
        if value < lower or value > upper:
            raise ValueError(
                f"person_weeks_estimate={value} is outside {self.tshirt.value} band [{lower}, {upper}]"
            )
        return self


class RICEOutput(BaseModel):
    reach: float = Field(..., ge=0)
    impact: float
    confidence: float = Field(..., ge=0, le=1)
    effort: float = Field(..., gt=0)
    score: float = Field(..., ge=0)

    @field_validator("impact")
    @classmethod
    def impact_is_allowed(cls, value: float) -> float:
        allowed = {0.25, 0.5, 1, 2, 3}
        if value not in allowed:
            raise ValueError(f"impact must be one of {sorted(allowed)}")
        return value


class CustomROIOutput(BaseModel):
    strategic_fit: float = Field(..., ge=0, le=10)
    evidence: float = Field(..., ge=0, le=10)
    reach: float = Field(..., ge=0)
    effort: float = Field(..., gt=0)
    score: float = Field(..., ge=0)


class ROIOutput(BaseModel):
    rice: RICEOutput
    custom: CustomROIOutput
    rationale: str


class RiskItem(BaseModel):
    category: RiskCategory
    description: str
    likelihood: Level
    impact: Level
    mitigation: str


class RiskOutput(BaseModel):
    risks: list[RiskItem] = Field(default_factory=list, min_length=4, max_length=6)
    top_3: list[RiskItem] = Field(..., min_length=3, max_length=3)
    opportunity_cost: str
    rationale: str

    @model_validator(mode="after")
    def top3_must_be_subset(self) -> "RiskOutput":
        risk_keys = {
            (risk.category, risk.description, risk.likelihood, risk.impact, risk.mitigation)
            for risk in self.risks
        }
        for risk in self.top_3:
            key = (risk.category, risk.description, risk.likelihood, risk.impact, risk.mitigation)
            if key not in risk_keys:
                raise ValueError("All top_3 risks must be drawn from risks")
        return self


class VerdictOutput(BaseModel):
    verdict: VerdictEnum
    confidence: float = Field(..., ge=0, le=1)
    one_line_rationale: str
    what_would_change_my_mind: list[str] = Field(default_factory=list)
    recommended_next_step: str


class FeatureGateReport(BaseModel):
    feature: FeatureRequest
    validation_signals: ValidationSignals
    strategic_fit: StrategicFitOutput
    evidence: EvidenceOutput
    sizing: SizingOutput
    roi: ROIOutput
    risk: RiskOutput
    verdict: VerdictOutput


class RankedFeature(BaseModel):
    feature_id: str
    title: str
    verdict: VerdictEnum
    rice_score: float
    custom_score: float
    strategic_fit_score: int
    evidence_score: int
    confidence: float


class BatchSummary(BaseModel):
    go_ranked: list[RankedFeature] = Field(default_factory=list)
    park_pending_evidence: list[RankedFeature] = Field(default_factory=list)
    no_go: list[RankedFeature] = Field(default_factory=list)
