import { Handoff } from "@/types/handoff";

export const DEMO_HANDOFF: Handoff = {
  sbar: {
    situation:
      "67F with Type 2 DM, Hypertension, and active Diabetic Foot Ulcer presenting with self-discontinued Telmisartan (2 days), BP 158/94 mmHg (Stage 2), new bilateral ankle edema x3 days, and fasting glucose 187 mg/dL. Physician teleconsult scheduled within 4 hours for medication review.",
    background:
      "PT-0847 Lakshmi Devi is Visit #13 in the Chronic Care program. Recent visit history shows BP trending up (142/88 → 158/94) and glucose increasing (165 → 187). Stopped Telmisartan 2 days ago due to dizziness. Diabetic foot wound has mild discharge but no infection signs at current visit. Lives alone; daughter available only on weekends. Poor dietary compliance with rice-heavy meals documented.",
    assessment:
      "HIGH RISK — Compound risk scenario. Uncontrolled HTN due to self-discontinued antihypertensive, combined with new-onset bilateral edema and poorly controlled diabetes with active wound creates elevated risk for cardiovascular event, wound infection, and preventable hospitalization. Social isolation amplifies risk. Escalation triggered: physician review within 4 hours.",
    recommendation:
      "Priority 1: Confirm physician teleconsult is scheduled and completed. Priority 2: Review BP and edema status at start of visit — compare to yesterday baseline. Priority 3: Check wound for any signs of worsening (increased discharge, odor, spreading redness). Priority 4: Verify patient has restarted Telmisartan per physician instruction. Priority 5: Confirm lab draw (creatinine, BNP, HbA1c) completed or schedule.",
  },
  critical_alerts: [
    "⚠️ MEDICATION ALERT: Telmisartan STOPPED 2 days ago — confirm restart status with physician order before administering",
    "⚠️ BP ALERT: Last recorded 158/94 — Stage 2 Hypertension. Monitor closely. If >180/110, call physician immediately",
    "⚠️ EDEMA: New bilateral ankle edema. Grade pitting edema at each visit. Escalate if worsening.",
    "⚠️ WOUND: Diabetic foot ulcer with active discharge. Photograph every visit. Watch for infection signs.",
  ],
  pending_tasks: [
    "Physician teleconsult — medication review (within 4 hours from last visit)",
    "Lab draw: Serum creatinine, BNP, HbA1c — STAT order placed",
    "Wound culture (if discharge still present at this visit)",
    "Dietary counseling completion — Tamil-language meal guide handover",
    "WhatsApp reminder group setup — patient + daughter contact",
    "Visit frequency increase approval — 2x → 3x per week pending coordinator action",
  ],
  family_notes:
    "Daughter (Kavitha, +91-98765-XXXXX) should be contacted today to brief on medication changes and escalation. She should be added to the WhatsApp reminder group and given clear instructions on warning signs requiring immediate nurse call: BP dizziness, severe swelling, wound changes, confusion or drowsiness.",
};
