import { AnalysisResult } from "@/types/analysis";

export const DEMO_ANALYSIS: AnalysisResult = {
  patient_summary:
    "67F with uncontrolled Type 2 DM and HTN presenting with self-discontinued antihypertensive (Telmisartan), elevated BP 158/94, bilateral ankle edema x3 days, and fasting glucose 187. Diabetic foot wound showing slow healing with mild discharge. Lives alone with limited family support and poor dietary compliance.",
  extracted_entities: {
    symptoms: [
      { symptom: "Bilateral ankle edema", duration: "3 days", severity: "moderate" },
      { symptom: "Dizziness", duration: "Intermittent", severity: "mild" },
      { symptom: "Foot wound discharge", duration: "Ongoing", severity: "mild" },
    ],
    medications_current: [
      { name: "Metformin", dose: "500mg", frequency: "BD" },
      { name: "Amlodipine", dose: "5mg", frequency: "OD" },
    ],
    medications_stopped: [
      { name: "Telmisartan", reason: "Patient-initiated — felt dizzy", days_ago: 2 },
    ],
    conditions_active: [
      "Type 2 Diabetes Mellitus",
      "Hypertension — Stage 2",
      "Diabetic Foot Ulcer — healing",
      "Bilateral pedal edema",
    ],
    social_determinants: [
      "Lives alone",
      "Daughter visits weekends only",
      "Poor diet compliance — rice-heavy meals",
      "Limited health literacy",
    ],
  },
  risk_flags: [
    {
      title: "Self-discontinued antihypertensive",
      severity: "critical",
      explanation:
        "Patient stopped Telmisartan 2 days ago without medical advice. BP now 158/94 (Stage 2). Combined with new bilateral edema, suggests worsening fluid retention and elevated cardiovascular risk.",
      action:
        "Immediate physician teleconsult for medication review. Do not restart without doctor's order — assess for orthostatic hypotension.",
    },
    {
      title: "Uncontrolled diabetes with active wound",
      severity: "high",
      explanation:
        "Fasting glucose 187 mg/dL is significantly above target (<130). Active diabetic foot wound with discharge at elevated glucose levels increases infection and delayed healing risk.",
      action:
        "Wound culture if discharge persists beyond 48 hrs. Flag for diabetes medication dose adjustment. Daily wound photo documentation.",
    },
    {
      title: "New-onset bilateral edema",
      severity: "high",
      explanation:
        "Bilateral ankle swelling for 3 days is a new symptom. Differential includes medication-related (Amlodipine), cardiac, renal, or venous insufficiency. Requires evaluation.",
      action:
        "Check for pitting edema grade. Request serum creatinine and BNP labs. Elevate legs during visit.",
    },
    {
      title: "Social isolation and compliance risk",
      severity: "medium",
      explanation:
        "Elderly patient living alone with demonstrated poor medication and dietary compliance. Weekend-only family support is insufficient for current clinical complexity.",
      action:
        "Increase visit frequency to 3x/week. Engage daughter via WhatsApp group for medication reminders. Refer to community health worker.",
    },
  ],
  vitals_assessment: [
    {
      vital: "Blood Pressure",
      value: "158/94 mmHg",
      status: "elevated",
      note: "Stage 2 HTN — likely worsened by Telmisartan discontinuation",
    },
    {
      vital: "Fasting Glucose",
      value: "187 mg/dL",
      status: "elevated",
      note: "Above target (>130). Poor diet compliance contributing.",
    },
    {
      vital: "SpO2",
      value: "96%",
      status: "normal",
      note: "Acceptable range for age.",
    },
    {
      vital: "Pulse",
      value: "82 bpm",
      status: "normal",
      note: "Regular rate.",
    },
    {
      vital: "Temperature",
      value: "98.4°F",
      status: "normal",
      note: "Afebrile.",
    },
  ],
  care_actions: [
    {
      priority: "immediate",
      action: "Schedule physician teleconsult for antihypertensive review and edema evaluation",
      owner: "coordinator",
    },
    {
      priority: "immediate",
      action: "Photograph wound and document discharge characteristics",
      owner: "nurse",
    },
    {
      priority: "today",
      action: "Provide Tamil-language low-glycemic meal guide with rice portion control",
      owner: "nurse",
    },
    {
      priority: "today",
      action: "Set up daily WhatsApp medication reminder for patient and daughter",
      owner: "coordinator",
    },
    {
      priority: "today",
      action: "Order serum creatinine and BNP labs for next-day collection",
      owner: "doctor",
    },
    {
      priority: "this_week",
      action: "Increase home visit frequency from 2x to 3x per week",
      owner: "coordinator",
    },
    {
      priority: "this_week",
      action: "Reassess BP after medication restart — target <140/90 within 7 days",
      owner: "nurse",
    },
  ],
  escalation: {
    needed: true,
    urgency: "within_4hrs",
    reason:
      "Self-discontinued antihypertensive with Stage 2 BP and new bilateral edema. Requires physician review before restarting or substituting Telmisartan.",
    escalate_to: "physician",
  },
};
