import { Vitals } from "@/types/patient";
import { AnalysisResult, Severity, VitalStatus, ActionPriority, ActionOwner, EscalationUrgency, EscalateTo } from "@/types/analysis";

const VITAL_RANGES = {
  bp_sys: { min: 60, max: 250, label: "BP Systolic" },
  bp_dia: { min: 30, max: 150, label: "BP Diastolic" },
  pulse: { min: 30, max: 200, label: "Pulse" },
  spo2: { min: 50, max: 100, label: "SpO2" },
  temp: { min: 90, max: 108, label: "Temperature" },
  glucose_fasting: { min: 20, max: 600, label: "Fasting Glucose" },
  weight: { min: 10, max: 300, label: "Weight" },
};

export interface VitalValidationError {
  field: string;
  value: number;
  message: string;
}

export function validateVitals(vitals: Vitals): VitalValidationError[] {
  const errors: VitalValidationError[] = [];

  for (const [key, range] of Object.entries(VITAL_RANGES)) {
    const value = vitals[key as keyof Vitals];
    if (value !== undefined && value !== null) {
      if (value < range.min || value > range.max) {
        errors.push({
          field: key,
          value,
          message: `${range.label} value ${value} is outside valid range (${range.min}-${range.max})`,
        });
      }
    }
  }

  return errors;
}

const VALID_SEVERITIES: Severity[] = ["critical", "high", "medium", "low"];
const VALID_VITAL_STATUSES: VitalStatus[] = ["normal", "elevated", "low", "critical"];
const VALID_PRIORITIES: ActionPriority[] = ["immediate", "today", "this_week"];
const VALID_OWNERS: ActionOwner[] = ["nurse", "doctor", "coordinator", "family"];
const VALID_URGENCIES: EscalationUrgency[] = ["immediate", "within_4hrs", "within_24hrs", "routine"];
const VALID_ESCALATE_TO: EscalateTo[] = ["physician", "specialist", "emergency"];

function normalizeEnum<T extends string>(value: string, valid: T[], fallback: T): T {
  if (valid.includes(value as T)) return value as T;
  return fallback;
}

export function validateAndNormalizeAnalysis(data: unknown): AnalysisResult {
  const d = data as Record<string, unknown>;

  return {
    patient_summary: String(d.patient_summary || ""),
    extracted_entities: {
      symptoms: Array.isArray(d.extracted_entities && (d.extracted_entities as Record<string, unknown>).symptoms)
        ? ((d.extracted_entities as Record<string, unknown>).symptoms as unknown[]).map((s) => {
            const sym = s as Record<string, unknown>;
            return {
              symptom: String(sym.symptom || ""),
              duration: String(sym.duration || ""),
              severity: normalizeEnum(String(sym.severity || ""), ["mild", "moderate", "severe"] as const, "mild"),
            };
          })
        : [],
      medications_current: Array.isArray(d.extracted_entities && (d.extracted_entities as Record<string, unknown>).medications_current)
        ? ((d.extracted_entities as Record<string, unknown>).medications_current as unknown[]).map((m) => {
            const med = m as Record<string, unknown>;
            return {
              name: String(med.name || ""),
              dose: String(med.dose || ""),
              frequency: String(med.frequency || ""),
            };
          })
        : [],
      medications_stopped: Array.isArray(d.extracted_entities && (d.extracted_entities as Record<string, unknown>).medications_stopped)
        ? ((d.extracted_entities as Record<string, unknown>).medications_stopped as unknown[]).map((m) => {
            const med = m as Record<string, unknown>;
            return {
              name: String(med.name || ""),
              reason: String(med.reason || ""),
              days_ago: Number(med.days_ago || 0),
            };
          })
        : [],
      conditions_active: Array.isArray(d.extracted_entities && (d.extracted_entities as Record<string, unknown>).conditions_active)
        ? ((d.extracted_entities as Record<string, unknown>).conditions_active as unknown[]).map(String)
        : [],
      social_determinants: Array.isArray(d.extracted_entities && (d.extracted_entities as Record<string, unknown>).social_determinants)
        ? ((d.extracted_entities as Record<string, unknown>).social_determinants as unknown[]).map(String)
        : [],
    },
    risk_flags: Array.isArray(d.risk_flags)
      ? (d.risk_flags as unknown[]).map((f) => {
          const flag = f as Record<string, unknown>;
          return {
            title: String(flag.title || ""),
            severity: normalizeEnum(String(flag.severity || ""), VALID_SEVERITIES, "low"),
            explanation: String(flag.explanation || ""),
            action: String(flag.action || ""),
          };
        })
      : [],
    vitals_assessment: Array.isArray(d.vitals_assessment)
      ? (d.vitals_assessment as unknown[]).map((v) => {
          const vital = v as Record<string, unknown>;
          return {
            vital: String(vital.vital || ""),
            value: String(vital.value || ""),
            status: normalizeEnum(String(vital.status || ""), VALID_VITAL_STATUSES, "normal"),
            note: String(vital.note || ""),
          };
        })
      : [],
    care_actions: Array.isArray(d.care_actions)
      ? (d.care_actions as unknown[]).map((a) => {
          const action = a as Record<string, unknown>;
          return {
            priority: normalizeEnum(String(action.priority || ""), VALID_PRIORITIES, "today"),
            action: String(action.action || ""),
            owner: normalizeEnum(String(action.owner || ""), VALID_OWNERS, "nurse"),
          };
        })
      : [],
    escalation: (() => {
      const esc = (d.escalation || {}) as Record<string, unknown>;
      return {
        needed: Boolean(esc.needed),
        urgency: normalizeEnum(String(esc.urgency || ""), VALID_URGENCIES, "routine"),
        reason: String(esc.reason || ""),
        escalate_to: normalizeEnum(String(esc.escalate_to || ""), VALID_ESCALATE_TO, "physician"),
      };
    })(),
  };
}
