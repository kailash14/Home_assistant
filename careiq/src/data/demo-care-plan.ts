import { CarePlan } from "@/types/care-plan";

export const DEMO_CARE_PLAN: CarePlan = {
  care_plan_title: "Hypertension & Diabetes Stabilization Plan — Lakshmi Devi (PT-0847)",
  goals: [
    {
      goal: "Restart and stabilize antihypertensive therapy",
      target: "BP < 140/90 mmHg",
      timeline: "7 days",
    },
    {
      goal: "Reduce fasting blood glucose",
      target: "Fasting glucose < 150 mg/dL",
      timeline: "7 days",
    },
    {
      goal: "Resolve bilateral ankle edema",
      target: "No pitting edema on examination",
      timeline: "5 days",
    },
    {
      goal: "Complete diabetic foot wound healing",
      target: "No active discharge, wound closure",
      timeline: "14 days",
    },
  ],
  daily_schedule: [
    {
      day: "Day 1-2",
      tasks: [
        {
          time: "Morning",
          task: "Physician teleconsult — medication review and Telmisartan restart decision",
          owner: "doctor",
          notes: "Priority call within 4 hours. Share BP readings and edema details.",
        },
        {
          time: "Morning",
          task: "Wound photography and discharge documentation",
          owner: "nurse",
          notes: "Photograph wound pre and post dressing. Note color, odor, volume of discharge.",
        },
        {
          time: "Morning",
          task: "Blood draw — serum creatinine, BNP, HbA1c",
          owner: "nurse",
          notes: "Fasting blood draw. Results expected same day via STAT order.",
        },
        {
          time: "Afternoon",
          task: "Leg elevation counseling and positioning",
          owner: "nurse",
          notes: "Elevate legs 30 cm above heart level for 30 mins, 3x daily.",
        },
        {
          time: "Evening",
          task: "WhatsApp medication reminder setup for patient + daughter",
          owner: "coordinator",
          notes: "Tamil language reminders. Include medication times and dosage photos.",
        },
      ],
    },
    {
      day: "Day 3-4",
      tasks: [
        {
          time: "Morning",
          task: "BP check and glucose monitoring",
          owner: "nurse",
          notes: "Monitor response to restarted antihypertensive. Document trend.",
        },
        {
          time: "Morning",
          task: "Wound reassessment — check for infection signs",
          owner: "nurse",
          notes: "If discharge increased or wound deteriorated, order culture immediately.",
        },
        {
          time: "Afternoon",
          task: "Dietary counseling — low-glycemic meal planning",
          owner: "nurse",
          notes: "Tamil-language meal guide. Focus on rice portion control (1/2 cup cooked), vegetable increase.",
        },
        {
          time: "Afternoon",
          task: "Review lab results with physician",
          owner: "doctor",
          notes: "Adjust medications based on creatinine and BNP findings.",
        },
      ],
    },
    {
      day: "Day 5-7",
      tasks: [
        {
          time: "Morning",
          task: "Edema reassessment — pitting test and measurement",
          owner: "nurse",
          notes: "Compare to Day 1 baseline. If no improvement, escalate to specialist.",
        },
        {
          time: "Morning",
          task: "BP and glucose trend review",
          owner: "nurse",
          notes: "Target BP <140/90. If glucose still >150, discuss Metformin dose increase with doctor.",
        },
        {
          time: "Afternoon",
          task: "Family meeting — daughter care plan briefing",
          owner: "coordinator",
          notes: "Schedule video call with daughter. Brief on medication schedule and warning signs.",
        },
        {
          time: "Afternoon",
          task: "7-day care plan review and next-week plan adjustment",
          owner: "doctor",
          notes: "Teleconsult to review progress. Decide on continued 3x/week visits or de-escalate.",
        },
      ],
    },
  ],
  medication_changes: [
    {
      medication: "Telmisartan",
      change: "Restart at physician-determined dose after teleconsult",
      reason:
        "Patient self-discontinued due to dizziness. Physician must rule out orthostatic hypotension before restarting.",
    },
    {
      medication: "Metformin",
      change: "Consider dose increase to 1000mg BD pending HbA1c result",
      reason: "Fasting glucose 187 with poor dietary compliance. Dose adjustment may be required.",
    },
  ],
  monitoring_parameters: [
    {
      parameter: "Blood Pressure",
      frequency: "Twice daily (morning + evening) by patient self-monitoring",
      alert_threshold: "Systolic > 160 or < 100 — call nurse immediately",
    },
    {
      parameter: "Fasting Blood Glucose",
      frequency: "Daily fasting, alternate-day post-prandial",
      alert_threshold: "Fasting > 250 or < 70 mg/dL — call nurse immediately",
    },
    {
      parameter: "Ankle circumference / edema grade",
      frequency: "Every nurse visit",
      alert_threshold: "Grade 3+ pitting edema or bilateral increase in circumference",
    },
    {
      parameter: "Wound status",
      frequency: "Every nurse visit — photograph and document",
      alert_threshold: "Increased discharge, foul odor, fever, redness spreading beyond wound margin",
    },
    {
      parameter: "Body weight",
      frequency: "Daily morning weight",
      alert_threshold: "Weight gain > 1 kg in 24 hours or > 2 kg in 3 days (fluid retention)",
    },
  ],
  patient_education: [
    "Never stop blood pressure medications without consulting your doctor — sudden discontinuation can cause dangerous BP spikes",
    "Elevate your legs on two pillows while resting to reduce ankle swelling",
    "Rice portion control: use a small cup (1/4 cup dry) per meal; increase vegetables and dal",
    "Check your feet daily for new wounds, redness, or discharge — do not walk barefoot",
    "Record your BP and blood sugar in the diary provided and show at every visit",
    "If you feel dizzy with medications, call the care coordinator immediately — do not stop medication on your own",
  ],
  follow_up: {
    next_visit: "Tomorrow (within 24 hours) — BP and edema reassessment",
    teleconsult: "Today within 4 hours — physician medication review",
    lab_tests: "STAT: Serum creatinine, BNP, HbA1c — draw today, results by tomorrow",
  },
};
