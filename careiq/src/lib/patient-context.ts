import { Patient } from "@/types/patient";

export function buildAnalysisUserMessage(patient: Patient, notes: string): string {
  const historyLines = patient.history
    .map((h) => `  [${h.date}] ${h.type}: ${h.note}`)
    .join("\n");

  return `PATIENT: ${patient.name}, ${patient.age}${patient.gender}, ID: ${patient.id}
CONDITIONS: ${patient.conditions.join(", ")}
PROGRAM: ${patient.program} | VISIT #${patient.visits + 1}

VITALS (Current Visit):
- Blood Pressure: ${patient.vitals.bp_sys}/${patient.vitals.bp_dia} mmHg
- Pulse: ${patient.vitals.pulse} bpm
- SpO2: ${patient.vitals.spo2}%
- Temperature: ${patient.vitals.temp}°F
- Fasting Blood Glucose: ${patient.vitals.glucose_fasting} mg/dL
- Weight: ${patient.vitals.weight} kg

VISIT HISTORY (Last ${patient.history.length}):
${historyLines}

NURSE NOTES (Current Visit):
${notes}`;
}

export function buildCarePlanUserMessage(analysisJson: string): string {
  return `Based on this clinical assessment, generate a 7-day care plan:\n\n${analysisJson}`;
}

export function buildHandoffUserMessage(patient: Patient, notes: string, riskFlagsJson: string): string {
  return `Generate SBAR handoff for:
Patient: ${patient.name}, ${patient.age}${patient.gender}
Conditions: ${patient.conditions.join(", ")}
Program: ${patient.program}
Current Visit Notes: ${notes}
Vitals: BP ${patient.vitals.bp_sys}/${patient.vitals.bp_dia}, Pulse ${patient.vitals.pulse}, SpO2 ${patient.vitals.spo2}%, Glucose ${patient.vitals.glucose_fasting} mg/dL, Temp ${patient.vitals.temp}°F
Assessment (Risk Flags): ${riskFlagsJson}`;
}
