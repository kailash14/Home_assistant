export type Severity = "critical" | "high" | "medium" | "low";
export type VitalStatus = "normal" | "elevated" | "low" | "critical";
export type ActionPriority = "immediate" | "today" | "this_week";
export type ActionOwner = "nurse" | "doctor" | "coordinator" | "family";
export type EscalationUrgency = "immediate" | "within_4hrs" | "within_24hrs" | "routine";
export type EscalateTo = "physician" | "specialist" | "emergency";
export type SymptomSeverity = "mild" | "moderate" | "severe";

export interface Symptom {
  symptom: string;
  duration: string;
  severity: SymptomSeverity;
}

export interface MedicationCurrent {
  name: string;
  dose: string;
  frequency: string;
}

export interface MedicationStopped {
  name: string;
  reason: string;
  days_ago: number;
}

export interface ExtractedEntities {
  symptoms: Symptom[];
  medications_current: MedicationCurrent[];
  medications_stopped: MedicationStopped[];
  conditions_active: string[];
  social_determinants: string[];
}

export interface RiskFlag {
  title: string;
  severity: Severity;
  explanation: string;
  action: string;
}

export interface VitalsAssessment {
  vital: string;
  value: string;
  status: VitalStatus;
  note: string;
}

export interface CareAction {
  priority: ActionPriority;
  action: string;
  owner: ActionOwner;
}

export interface Escalation {
  needed: boolean;
  urgency: EscalationUrgency;
  reason: string;
  escalate_to: EscalateTo;
}

export interface AnalysisResult {
  patient_summary: string;
  extracted_entities: ExtractedEntities;
  risk_flags: RiskFlag[];
  vitals_assessment: VitalsAssessment[];
  care_actions: CareAction[];
  escalation: Escalation;
}
