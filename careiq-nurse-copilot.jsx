import React, { useMemo, useState } from "react";

const COLORS = {
  background: "#F1F5F9",
  sidebar: "#1E293B",
  primary: "#0D9488",
  critical: "#DC2626",
  high: "#EA580C",
  medium: "#CA8A04",
  low: "#16A34A",
  codeBg: "#0F172A",
  codeText: "#A5F3FC",
  card: "#FFFFFF",
  border: "#CBD5E1",
  textMain: "#0F172A",
  textMuted: "#475569",
};

const VITAL_RANGES = {
  bp_sys: [60, 250],
  bp_dia: [30, 150],
  pulse: [30, 200],
  spo2: [50, 100],
  temp: [90, 108],
  glucose_fasting: [20, 600],
  weight: [20, 300],
};

const PATIENTS = [
  {
    id: "PT-0847",
    name: "Lakshmi Devi",
    age: 67,
    gender: "F",
    conditions: ["Type 2 Diabetes", "Hypertension", "Diabetic Foot Ulcer"],
    address: "14, Kasturi Rangan Rd, Adyar, Chennai",
    nurse: "Priya Krishnan",
    visits: 12,
    risk: 82,
    program: "Chronic Care",
    lastVisit: "2026-04-21",
    vitals: {
      bp_sys: 158,
      bp_dia: 94,
      pulse: 82,
      spo2: 96,
      temp: 98.4,
      glucose_fasting: 187,
      weight: 72.5,
    },
    notes:
      "Patient Mrs. Lakshmi Devi, 67F, visited for chronic care follow-up. BP slightly elevated at 158/94. Sugar fasting 187 mg/dL, PP not taken today. Patient complains of persistent swelling in both ankles for past 3 days. Says she stopped taking Telmisartan 2 days back because she felt dizzy. Currently on Metformin 500mg BD, Amlodipine 5mg OD. Wound on left foot from last visit is healing but still has mild discharge. Patient lives alone, daughter visits on weekends. Diet compliance poor - patient admits to eating rice-heavy meals.",
    history: [
      {
        date: "2026-04-21",
        type: "Wound Care",
        note: "Wound dressing changed. Mild improvement noted.",
      },
      {
        date: "2026-04-18",
        type: "Chronic Care",
        note: "BP 142/88, Glucose 165. Medications continued.",
      },
      {
        date: "2026-04-14",
        type: "Wound Care",
        note: "Wound cleaning. Started Mupirocin ointment.",
      },
    ],
  },
  {
    id: "PT-1203",
    name: "Rajesh Sharma",
    age: 55,
    gender: "M",
    conditions: ["Post-CABG Day 18", "Cardiac Rehab", "Dyslipidemia"],
    address: "23, Anna Nagar East, Chennai",
    nurse: "Meena Sundaram",
    visits: 8,
    risk: 45,
    program: "Post-Surgical",
    lastVisit: "2026-04-22",
    vitals: {
      bp_sys: 128,
      bp_dia: 82,
      pulse: 74,
      spo2: 98,
      temp: 98.6,
      glucose_fasting: 112,
      weight: 78,
    },
    notes:
      "Mr. Rajesh Sharma, 55M, post-CABG day 18. Surgical wound healing well, no signs of infection. Mild chest discomfort on exertion which subsides with rest. Walking 15 mins daily as advised. Compliance with medications good - taking Aspirin, Clopidogrel, Atorvastatin, Metoprolol. Wife monitors medication schedule. Appetite improving. Sleep disturbed due to anxiety about returning to work.",
    history: [
      {
        date: "2026-04-22",
        type: "Post-Surgical",
        note: "Wound inspection. Normal healing trajectory.",
      },
      {
        date: "2026-04-19",
        type: "Cardiac Rehab",
        note: "Started supervised walking program. Tolerated well.",
      },
    ],
  },
  {
    id: "PT-0592",
    name: "Fatima Begum",
    age: 78,
    gender: "F",
    conditions: ["COPD Stage III", "Home O2 Therapy", "Osteoporosis"],
    address: "7, Triplicane High Rd, Chennai",
    nurse: "Anitha Rajan",
    visits: 24,
    risk: 71,
    program: "Respiratory Care",
    lastVisit: "2026-04-23",
    vitals: {
      bp_sys: 134,
      bp_dia: 78,
      pulse: 92,
      spo2: 89,
      temp: 99.2,
      glucose_fasting: 104,
      weight: 58,
    },
    notes:
      "Mrs. Fatima Begum, 78F, COPD Stage III on home O2 at 2L/min. SpO2 on O2 is 89% which is below her baseline of 92-93%. Increased breathlessness since yesterday, especially on moving from bed to bathroom. Using accessory muscles. No fever but temp slightly elevated at 99.2F. Sputum yellowish-green since morning, increased volume. Nebulisation with Duolin and Budecort given. Son reports she refuses O2 cannula at night. Near-fall yesterday going to bathroom.",
    history: [
      {
        date: "2026-04-23",
        type: "Respiratory",
        note: "SpO2 drop noted. Nebulisation administered.",
      },
      {
        date: "2026-04-20",
        type: "Respiratory",
        note: "Stable day. O2 compliance counseling done.",
      },
    ],
  },
];

const DEMO_ANALYSIS = {
  "PT-0847": {
    patient_summary:
      "67F with uncontrolled Type 2 DM and HTN presenting with self-discontinued antihypertensive (Telmisartan), elevated BP 158/94, bilateral ankle edema x3 days, and fasting glucose 187. Diabetic foot wound showing slow healing with mild discharge. Lives alone with limited family support and poor dietary compliance.",
    extracted_entities: {
      symptoms: [
        {
          symptom: "Bilateral ankle edema",
          duration: "3 days",
          severity: "moderate",
        },
        {
          symptom: "Dizziness",
          duration: "Intermittent",
          severity: "mild",
        },
        {
          symptom: "Foot wound discharge",
          duration: "Ongoing",
          severity: "mild",
        },
      ],
      medications_current: [
        { name: "Metformin", dose: "500mg", frequency: "BD" },
        { name: "Amlodipine", dose: "5mg", frequency: "OD" },
      ],
      medications_stopped: [
        {
          name: "Telmisartan",
          reason: "Patient-initiated - felt dizzy",
          days_ago: 2,
        },
      ],
      conditions_active: [
        "Type 2 Diabetes Mellitus",
        "Hypertension - Stage 2",
        "Diabetic Foot Ulcer - healing",
        "Bilateral pedal edema",
      ],
      social_determinants: [
        "Lives alone",
        "Daughter visits weekends only",
        "Poor diet compliance - rice-heavy meals",
      ],
    },
    risk_flags: [
      {
        title: "Self-discontinued antihypertensive",
        severity: "critical",
        explanation:
          "Patient stopped Telmisartan 2 days ago without medical advice. BP now 158/94 with new bilateral edema, suggesting worsening cardiovascular risk.",
        action:
          "Immediate physician teleconsult for medication review and dizziness assessment before restart.",
      },
      {
        title: "Uncontrolled diabetes with active wound",
        severity: "high",
        explanation:
          "Fasting glucose 187 mg/dL with active foot wound discharge increases infection and delayed healing risk.",
        action:
          "Escalate for glycemic optimization and daily wound review protocol.",
      },
      {
        title: "Social isolation and adherence risk",
        severity: "medium",
        explanation:
          "Patient lives alone with weak daily support and documented medication/diet non-adherence.",
        action:
          "Increase visit frequency and involve daughter in reminders and monitoring.",
      },
    ],
    vitals_assessment: [
      {
        vital: "Blood Pressure",
        value: "158/94 mmHg",
        status: "elevated",
        note: "Stage 2 hypertension; likely worsened by missed antihypertensive.",
      },
      {
        vital: "Fasting Glucose",
        value: "187 mg/dL",
        status: "elevated",
        note: "Above target for diabetic care.",
      },
      {
        vital: "SpO2",
        value: "96%",
        status: "normal",
        note: "No oxygenation concern this visit.",
      },
      {
        vital: "Pulse",
        value: "82 bpm",
        status: "normal",
        note: "Within expected range.",
      },
      {
        vital: "Temperature",
        value: "98.4 deg F",
        status: "normal",
        note: "Afebrile.",
      },
    ],
    care_actions: [
      {
        priority: "immediate",
        action:
          "Coordinate physician teleconsult for antihypertensive review within 4 hours.",
        owner: "coordinator",
      },
      {
        priority: "immediate",
        action: "Document wound discharge with photo and dressing notes.",
        owner: "nurse",
      },
      {
        priority: "today",
        action:
          "Start caregiver WhatsApp reminder cadence for medications and meals.",
        owner: "coordinator",
      },
      {
        priority: "this_week",
        action:
          "Increase visit cadence from 2x/week to 3x/week until BP and wound trend improves.",
        owner: "coordinator",
      },
    ],
    escalation: {
      needed: true,
      urgency: "within_4hrs",
      reason:
        "Medication discontinuation with elevated BP and edema needs physician review for safe treatment adjustment.",
      escalate_to: "physician",
    },
  },
  "PT-1203": {
    patient_summary:
      "55M post-CABG day 18 with stable vitals and good medication adherence. Mild exertional chest discomfort improves with rest, and wound healing appears appropriate. Anxiety around return-to-work is emerging and needs counseling.",
    extracted_entities: {
      symptoms: [
        {
          symptom: "Mild chest discomfort on exertion",
          duration: "Ongoing in rehab period",
          severity: "mild",
        },
        {
          symptom: "Sleep disturbance due to anxiety",
          duration: "Recent",
          severity: "moderate",
        },
      ],
      medications_current: [
        { name: "Aspirin", dose: "As prescribed", frequency: "OD" },
        { name: "Clopidogrel", dose: "As prescribed", frequency: "OD" },
        { name: "Atorvastatin", dose: "As prescribed", frequency: "HS" },
        { name: "Metoprolol", dose: "As prescribed", frequency: "BD/OD" },
      ],
      medications_stopped: [],
      conditions_active: ["Post-CABG recovery", "Cardiac rehabilitation"],
      social_determinants: ["Work anxiety", "Strong family support from spouse"],
    },
    risk_flags: [
      {
        title: "Post-surgical exertional symptom monitoring",
        severity: "medium",
        explanation:
          "Symptoms are mild and self-limiting but still require trend monitoring during early rehab.",
        action:
          "Track symptom frequency and trigger review if discomfort increases or appears at rest.",
      },
      {
        title: "Recovery anxiety impacting sleep",
        severity: "medium",
        explanation:
          "Poor sleep and work-related anxiety can reduce recovery adherence and quality of life.",
        action:
          "Provide structured reassurance and schedule brief physician counseling.",
      },
    ],
    vitals_assessment: [
      {
        vital: "Blood Pressure",
        value: "128/82 mmHg",
        status: "normal",
        note: "On target for post-cardiac recovery.",
      },
      {
        vital: "SpO2",
        value: "98%",
        status: "normal",
        note: "No respiratory compromise.",
      },
      {
        vital: "Pulse",
        value: "74 bpm",
        status: "normal",
        note: "Stable.",
      },
    ],
    care_actions: [
      {
        priority: "today",
        action: "Continue graded walking with symptom diary.",
        owner: "patient",
      },
      {
        priority: "today",
        action: "Educate on warning symptoms that require urgent contact.",
        owner: "nurse",
      },
      {
        priority: "this_week",
        action:
          "Plan phased return-to-work discussion during follow-up teleconsult.",
        owner: "doctor",
      },
    ],
    escalation: {
      needed: false,
      urgency: "routine",
      reason: "Stable postoperative trajectory without acute red flags.",
      escalate_to: "physician",
    },
  },
  "PT-0592": {
    patient_summary:
      "78F with COPD Stage III on home oxygen shows acute deterioration from baseline with SpO2 89% on O2, increased dyspnea, and purulent sputum. Nighttime oxygen refusal and near-fall add substantial safety risk. Requires urgent clinical review.",
    extracted_entities: {
      symptoms: [
        {
          symptom: "Increased breathlessness",
          duration: "Since yesterday",
          severity: "severe",
        },
        {
          symptom: "Yellowish-green sputum",
          duration: "Since morning",
          severity: "moderate",
        },
        {
          symptom: "Near-fall episode",
          duration: "Yesterday",
          severity: "moderate",
        },
      ],
      medications_current: [
        { name: "Duolin nebulization", dose: "As given", frequency: "PRN" },
        { name: "Budecort nebulization", dose: "As given", frequency: "PRN" },
      ],
      medications_stopped: [],
      conditions_active: ["COPD exacerbation concern", "Home oxygen non-adherence"],
      social_determinants: ["Refuses O2 at night", "Mobility/fall risk at home"],
    },
    risk_flags: [
      {
        title: "Acute COPD deterioration",
        severity: "critical",
        explanation:
          "SpO2 below baseline with escalating dyspnea and purulent sputum suggests acute exacerbation and possible infection.",
        action:
          "Urgent physician review with same-day escalation and treatment adjustment.",
      },
      {
        title: "Night oxygen non-adherence",
        severity: "high",
        explanation:
          "Refusal of oxygen support increases overnight hypoxemia risk and worsening respiratory status.",
        action:
          "Family counseling and adherence plan with nighttime supervision.",
      },
      {
        title: "Fall risk under respiratory distress",
        severity: "high",
        explanation:
          "Near-fall with breathlessness indicates immediate home safety vulnerability.",
        action: "Implement fall precautions and bathroom assist strategy.",
      },
    ],
    vitals_assessment: [
      {
        vital: "SpO2",
        value: "89%",
        status: "critical",
        note: "Below patient baseline despite oxygen therapy.",
      },
      {
        vital: "Pulse",
        value: "92 bpm",
        status: "elevated",
        note: "Likely respiratory stress response.",
      },
      {
        vital: "Temperature",
        value: "99.2 deg F",
        status: "elevated",
        note: "Low-grade rise with purulent sputum; monitor infection.",
      },
    ],
    care_actions: [
      {
        priority: "immediate",
        action:
          "Escalate to physician for suspected COPD exacerbation and infection workup.",
        owner: "nurse",
      },
      {
        priority: "immediate",
        action: "Reinforce oxygen adherence and supervise nocturnal oxygen use.",
        owner: "family",
      },
      {
        priority: "today",
        action: "Implement fall-prevention setup in home environment.",
        owner: "coordinator",
      },
    ],
    escalation: {
      needed: true,
      urgency: "immediate",
      reason:
        "Respiratory deterioration with low SpO2 on oxygen and probable infective trigger.",
      escalate_to: "physician",
    },
  },
};

const DEMO_CARE_PLAN = {
  "PT-0847": {
    care_plan_title: "7-Day Stabilization Plan: BP, Glycemic Control, Wound Recovery",
    goals: [
      {
        goal: "Restore antihypertensive safety and control",
        target: "BP < 140/90",
        timeline: "Within 7 days",
      },
      {
        goal: "Improve glycemic control",
        target: "Fasting glucose < 150 mg/dL",
        timeline: "Within 7 days",
      },
      {
        goal: "Reduce wound infection risk",
        target: "No active discharge",
        timeline: "Within 7 days",
      },
    ],
    daily_schedule: [
      {
        day: "Day 1-2",
        tasks: [
          {
            time: "Morning",
            task: "Physician teleconsult for medication reconciliation",
            owner: "doctor",
            notes: "Review telmisartan stoppage and dizziness history.",
          },
          {
            time: "Afternoon",
            task: "Wound dressing and discharge documentation",
            owner: "nurse",
            notes: "Add photo and wound progression note.",
          },
        ],
      },
      {
        day: "Day 3-4",
        tasks: [
          {
            time: "Morning",
            task: "Monitor BP and fasting glucose trends",
            owner: "nurse",
            notes: "Escalate if BP worsens or glucose remains >180.",
          },
          {
            time: "Evening",
            task: "Diet adherence coaching with daughter",
            owner: "family",
            notes: "Focus on rice portion control and meal timing.",
          },
        ],
      },
      {
        day: "Day 5-7",
        tasks: [
          {
            time: "Morning",
            task: "Review wound healing and edema status",
            owner: "nurse",
            notes: "Assess if visit frequency can step down.",
          },
        ],
      },
    ],
    medication_changes: [
      {
        medication: "Telmisartan",
        change: "Review and resume/adjust by physician",
        reason: "Patient self-discontinued due to dizziness.",
      },
    ],
    monitoring_parameters: [
      {
        parameter: "Blood Pressure",
        frequency: "Daily",
        alert_threshold: ">160/100 or symptomatic dizziness",
      },
      {
        parameter: "Fasting Glucose",
        frequency: "Daily",
        alert_threshold: ">200 mg/dL",
      },
      {
        parameter: "Wound discharge",
        frequency: "Every dressing",
        alert_threshold: "Increasing discharge, odor, or redness",
      },
    ],
    patient_education: [
      "Do not stop BP medicines without physician advice.",
      "Use measured rice portions and balanced meals for sugar control.",
      "Report swelling, dizziness, or wound changes early.",
    ],
    follow_up: {
      next_visit: "Within 48 hours",
      teleconsult: "Today within 4 hours",
      lab_tests: "Serum creatinine, BNP if edema persists",
    },
  },
  "PT-1203": {
    care_plan_title: "7-Day Cardiac Recovery Confidence Plan",
    goals: [
      {
        goal: "Maintain stable post-CABG recovery",
        target: "No worsening exertional symptoms",
        timeline: "7 days",
      },
    ],
    daily_schedule: [
      {
        day: "Day 1-2",
        tasks: [
          {
            time: "Morning",
            task: "Continue prescribed cardiac rehab walk",
            owner: "patient",
            notes: "Stop and rest if discomfort increases.",
          },
        ],
      },
      {
        day: "Day 3-4",
        tasks: [
          {
            time: "Evening",
            task: "Sleep hygiene and anxiety counseling",
            owner: "nurse",
            notes: "Guide breathing routine before sleep.",
          },
        ],
      },
      {
        day: "Day 5-7",
        tasks: [
          {
            time: "Morning",
            task: "Return-to-work readiness review",
            owner: "doctor",
            notes: "Teleconsult for phased plan.",
          },
        ],
      },
    ],
    medication_changes: [],
    monitoring_parameters: [
      {
        parameter: "Chest discomfort frequency",
        frequency: "Daily diary",
        alert_threshold: "Pain at rest or increasing frequency",
      },
    ],
    patient_education: [
      "Recovery anxiety is common and treatable.",
      "Seek urgent care for persistent chest pain at rest.",
    ],
    follow_up: {
      next_visit: "In 3 days",
      teleconsult: "Within this week",
      lab_tests: "As per cardiology follow-up",
    },
  },
  "PT-0592": {
    care_plan_title: "7-Day COPD Exacerbation Response Plan",
    goals: [
      {
        goal: "Stabilize oxygenation",
        target: "SpO2 at baseline 92-93% on prescribed O2",
        timeline: "Within 72 hours",
      },
    ],
    daily_schedule: [
      {
        day: "Day 1-2",
        tasks: [
          {
            time: "Immediate",
            task: "Urgent physician review and treatment plan update",
            owner: "doctor",
            notes: "Assess need for antibiotics/steroids.",
          },
          {
            time: "Night",
            task: "Supervised oxygen adherence",
            owner: "family",
            notes: "Prevent nighttime oxygen refusal.",
          },
        ],
      },
      {
        day: "Day 3-4",
        tasks: [
          {
            time: "Morning/Evening",
            task: "Repeat SpO2 and symptom monitoring",
            owner: "nurse",
            notes: "Escalate if SpO2 remains <90%.",
          },
        ],
      },
      {
        day: "Day 5-7",
        tasks: [
          {
            time: "Daily",
            task: "Home fall-risk checks and bathroom assist setup",
            owner: "coordinator",
            notes: "Prioritize mobility safety.",
          },
        ],
      },
    ],
    medication_changes: [
      {
        medication: "Nebulization regimen",
        change: "Reassess frequency/intensity with physician",
        reason: "Increased dyspnea and sputum burden.",
      },
    ],
    monitoring_parameters: [
      {
        parameter: "SpO2 on oxygen",
        frequency: "3x/day",
        alert_threshold: "<90% sustained",
      },
      {
        parameter: "Breathlessness severity",
        frequency: "Each visit",
        alert_threshold: "Accessory muscle use or inability to ambulate",
      },
    ],
    patient_education: [
      "Do not remove oxygen overnight without clinical advice.",
      "Report sputum color/volume changes immediately.",
    ],
    follow_up: {
      next_visit: "Within 24 hours",
      teleconsult: "Immediate",
      lab_tests: "CBC/CRP as clinically indicated",
    },
  },
};

const DEMO_HANDOFF = {
  "PT-0847": {
    sbar: {
      situation:
        "67F diabetic and hypertensive patient with elevated BP, fasting hyperglycemia, and persistent bilateral ankle edema. Telmisartan was self-stopped 2 days ago due to dizziness.",
      background:
        "Known Type 2 diabetes, hypertension, and diabetic foot ulcer. Recent wound care showed mild improvement but current visit still has mild discharge.",
      assessment:
        "High-to-critical risk due to medication discontinuation, active wound, and poor home support. Requires physician medication review and close follow-up.",
      recommendation:
        "Prioritize teleconsult completion, wound monitoring, and daily BP/glucose checks. Involve daughter for adherence support and escalate if edema worsens.",
    },
    critical_alerts: [
      "Telmisartan self-discontinued",
      "BP 158/94 with new edema",
      "Active diabetic wound with discharge",
    ],
    pending_tasks: [
      "Confirm physician teleconsult within 4 hours",
      "Capture wound photo and document progression",
      "Set up family medication reminder workflow",
    ],
    family_notes:
      "Daughter visits weekends. Family engagement needed for daily medication and diet adherence support.",
  },
  "PT-1203": {
    sbar: {
      situation:
        "55M post-CABG day 18, currently hemodynamically stable with normal wound healing.",
      background:
        "Mild exertional chest discomfort remains but resolves with rest. Medication adherence is good with spouse support.",
      assessment:
        "Medium risk primarily from anxiety and recovery confidence concerns rather than acute clinical instability.",
      recommendation:
        "Continue rehab progression, monitor symptom trend, and reinforce return-to-work counseling.",
    },
    critical_alerts: [],
    pending_tasks: [
      "Track chest discomfort trend in symptom diary",
      "Provide sleep hygiene and anxiety support",
    ],
    family_notes: "Wife actively supports medication compliance.",
  },
  "PT-0592": {
    sbar: {
      situation:
        "78F COPD patient with current SpO2 drop to 89% on oxygen and increased breathlessness.",
      background:
        "Baseline SpO2 92-93%. Current visit includes purulent sputum and reported refusal of nighttime oxygen.",
      assessment:
        "Critical respiratory deterioration risk with infection possibility and fall vulnerability.",
      recommendation:
        "Urgently escalate to physician, enforce oxygen adherence, and activate home fall precautions immediately.",
    },
    critical_alerts: [
      "SpO2 89% despite home oxygen",
      "Worsening breathlessness with accessory muscle use",
      "Purulent sputum and nighttime O2 refusal",
    ],
    pending_tasks: [
      "Urgent physician review",
      "Family adherence reinforcement for nocturnal O2",
      "Implement fall safety setup",
    ],
    family_notes:
      "Son is aware of symptoms; needs clear escalation instructions and adherence checklist.",
  },
};

const ANALYSIS_PROMPT =
  "You are CareIQ, a clinical decision-support system for home healthcare nurses in India.\n" +
  "Analyze the nurse's visit data and produce a structured clinical assessment.\n\n" +
  "Only extract information that is directly stated or clearly implied in the nurse notes and vitals.\n" +
  "If a vital is missing, state that it was not recorded and discuss clinical significance of the gap.\n\n" +
  "Respond with ONLY valid JSON. No markdown fences, no preamble, no explanation.\n\n" +
  "Use this exact schema:\n" +
  "{\n" +
  "  \"patient_summary\": \"string - 2-3 line clinical summary of current visit\",\n" +
  "  \"extracted_entities\": {\n" +
  "    \"symptoms\": [{\"symptom\":\"string\",\"duration\":\"string\",\"severity\":\"mild|moderate|severe\"}],\n" +
  "    \"medications_current\": [{\"name\":\"string\",\"dose\":\"string\",\"frequency\":\"string\"}],\n" +
  "    \"medications_stopped\": [{\"name\":\"string\",\"reason\":\"string\",\"days_ago\":0}],\n" +
  "    \"conditions_active\": [\"string\"],\n" +
  "    \"social_determinants\": [\"string\"]\n" +
  "  },\n" +
  "  \"risk_flags\": [\n" +
  "    {\"title\":\"string\",\"severity\":\"critical|high|medium|low\",\"explanation\":\"string - clinical rationale in 1-2 sentences\",\"action\":\"string - specific recommended next step\"}\n" +
  "  ],\n" +
  "  \"vitals_assessment\": [\n" +
  "    {\"vital\":\"string\",\"value\":\"string\",\"status\":\"normal|elevated|low|critical\",\"note\":\"string\"}\n" +
  "  ],\n" +
  "  \"care_actions\": [\n" +
  "    {\"priority\":\"immediate|today|this_week\",\"action\":\"string\",\"owner\":\"nurse|doctor|coordinator|family\"}\n" +
  "  ],\n" +
  "  \"escalation\": {\n" +
  "    \"needed\": true,\n" +
  "    \"urgency\": \"immediate|within_4hrs|within_24hrs|routine\",\n" +
  "    \"reason\": \"string\",\n" +
  "    \"escalate_to\": \"physician|specialist|emergency\"\n" +
  "  }\n" +
  "}";

const CARE_PLAN_PROMPT =
  "You are CareIQ. Based on the clinical assessment provided, generate a structured 7-day care plan.\n\n" +
  "Respond with ONLY valid JSON:\n" +
  "{\n" +
  "  \"care_plan_title\": \"string\",\n" +
  "  \"goals\": [{\"goal\":\"string\",\"target\":\"string\",\"timeline\":\"string\"}],\n" +
  "  \"daily_schedule\": [\n" +
  "    {\"day\":\"Day 1-2|Day 3-4|Day 5-7\",\"tasks\":[{\"time\":\"string\",\"task\":\"string\",\"owner\":\"nurse|doctor|patient|family\",\"notes\":\"string\"}]}\n" +
  "  ],\n" +
  "  \"medication_changes\": [{\"medication\":\"string\",\"change\":\"string\",\"reason\":\"string\"}],\n" +
  "  \"monitoring_parameters\": [{\"parameter\":\"string\",\"frequency\":\"string\",\"alert_threshold\":\"string\"}],\n" +
  "  \"patient_education\": [\"string\"],\n" +
  "  \"follow_up\": {\"next_visit\":\"string\",\"teleconsult\":\"string\",\"lab_tests\":\"string\"}\n" +
  "}";

const HANDOFF_PROMPT =
  "You are CareIQ. Generate a concise clinical shift handoff summary using SBAR format.\n\n" +
  "Respond with ONLY valid JSON:\n" +
  "{\n" +
  "  \"sbar\": {\n" +
  "    \"situation\": \"string - current clinical status in 2-3 sentences\",\n" +
  "    \"background\": \"string - relevant history and recent changes\",\n" +
  "    \"assessment\": \"string - clinical judgment and risk level\",\n" +
  "    \"recommendation\": \"string - priority actions for incoming nurse\"\n" +
  "  },\n" +
  "  \"critical_alerts\": [\"string\"],\n" +
  "  \"pending_tasks\": [\"string\"],\n" +
  "  \"family_notes\": \"string\"\n" +
  "}";

function severityFromRiskScore(score) {
  if (score >= 80) return "critical";
  if (score >= 65) return "high";
  if (score >= 40) return "medium";
  return "low";
}

function severityColor(severity) {
  if (severity === "critical") return COLORS.critical;
  if (severity === "high") return COLORS.high;
  if (severity === "medium") return COLORS.medium;
  return COLORS.low;
}

function normalizeStatus(status) {
  if (!status) return "normal";
  const lowered = String(status).toLowerCase();
  if (["critical", "high"].includes(lowered)) return "critical";
  if (["elevated", "medium"].includes(lowered)) return "elevated";
  if (["low"].includes(lowered)) return "low";
  return "normal";
}

function vitalDisplayStatus(key, vitals) {
  if (key === "bp") {
    const sys = vitals.bp_sys;
    const dia = vitals.bp_dia;
    if (sys >= 180 || dia >= 110) return "critical";
    if (sys >= 140 || dia >= 90) return "elevated";
    if (sys < 90 || dia < 60) return "low";
    return "normal";
  }
  if (key === "spo2") {
    if (vitals.spo2 < 88) return "critical";
    if (vitals.spo2 < 92) return "elevated";
    return "normal";
  }
  if (key === "pulse") {
    if (vitals.pulse > 120 || vitals.pulse < 40) return "critical";
    if (vitals.pulse > 100 || vitals.pulse < 60) return "elevated";
    return "normal";
  }
  if (key === "temp") {
    if (vitals.temp >= 102 || vitals.temp <= 95) return "critical";
    if (vitals.temp >= 99.5) return "elevated";
    return "normal";
  }
  if (key === "glucose_fasting") {
    if (vitals.glucose_fasting >= 250) return "critical";
    if (vitals.glucose_fasting >= 130) return "elevated";
    if (vitals.glucose_fasting < 70) return "low";
    return "normal";
  }
  return "normal";
}

function formatAnalysisInput(patient, notes) {
  const vitals = patient.vitals;
  const historyLines = patient.history
    .slice(0, 3)
    .map((entry) => `  [${entry.date}] ${entry.type}: ${entry.note}`)
    .join("\n");
  return `PATIENT: ${patient.name}, ${patient.age}${patient.gender}, ID: ${patient.id}
CONDITIONS: ${patient.conditions.join(", ")}
PROGRAM: ${patient.program} | VISIT #${patient.visits + 1}

VITALS (Current Visit):
- Blood Pressure: ${vitals.bp_sys}/${vitals.bp_dia} mmHg
- Pulse: ${vitals.pulse} bpm
- SpO2: ${vitals.spo2}%
- Temperature: ${vitals.temp} deg F
- Fasting Blood Glucose: ${vitals.glucose_fasting} mg/dL
- Weight: ${vitals.weight} kg

VISIT HISTORY (Last 3):
${historyLines}

NURSE NOTES (Current Visit):
${notes}`;
}

function formatHandoffInput(patient, notes, analysis) {
  const vitals = patient.vitals;
  return `Generate SBAR handoff for:
Patient: ${patient.name}, ${patient.age}${patient.gender}
Conditions: ${patient.conditions.join(", ")}
Current Visit Notes: ${notes}
Vitals: BP ${vitals.bp_sys}/${vitals.bp_dia}, Pulse ${vitals.pulse}, SpO2 ${vitals.spo2}%, Glucose ${vitals.glucose_fasting}
Assessment: ${JSON.stringify(analysis?.risk_flags || [], null, 2)}`;
}

function validateVitals(vitals) {
  const problems = [];
  Object.keys(VITAL_RANGES).forEach((key) => {
    const value = vitals[key];
    const [min, max] = VITAL_RANGES[key];
    if (typeof value !== "number" || Number.isNaN(value)) {
      problems.push(`${key} is missing or invalid.`);
      return;
    }
    if (value < min || value > max) {
      problems.push(`${key}=${value} is outside allowed range (${min}-${max}).`);
    }
  });
  return problems;
}

function parseModelJson(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Model returned empty text.");
  }
  try {
    return JSON.parse(rawText);
  } catch (_err) {
    const firstBrace = rawText.indexOf("{");
    const lastBrace = rawText.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      const maybeJson = rawText.slice(firstBrace, lastBrace + 1);
      return JSON.parse(maybeJson);
    }
    throw new Error("Failed to parse model JSON output.");
  }
}

function Card({ title, children, style }) {
  return (
    <section
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: 16,
        ...style,
      }}
    >
      <div
        style={{
          fontSize: 14,
          textTransform: "uppercase",
          letterSpacing: 0.4,
          color: COLORS.textMuted,
          marginBottom: 10,
          fontWeight: 700,
        }}
      >
        {title}
      </div>
      {children}
    </section>
  );
}

function SeverityBadge({ severity }) {
  const tone = normalizeStatus(severity);
  const bg =
    tone === "critical"
      ? "#FEE2E2"
      : tone === "elevated"
      ? "#FEF3C7"
      : tone === "low"
      ? "#E0F2FE"
      : "#DCFCE7";
  const color =
    tone === "critical"
      ? COLORS.critical
      : tone === "elevated"
      ? COLORS.medium
      : tone === "low"
      ? "#0369A1"
      : COLORS.low;
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 12,
        fontWeight: 700,
        borderRadius: 999,
        padding: "4px 10px",
        background: bg,
        color,
      }}
    >
      {severity}
    </span>
  );
}

function App() {
  const initialNotes = useMemo(() => {
    const map = {};
    PATIENTS.forEach((patient) => {
      map[patient.id] = patient.notes;
    });
    return map;
  }, []);

  const [activeTab, setActiveTab] = useState("copilot");
  const [selectedPatientId, setSelectedPatientId] = useState(PATIENTS[0].id);
  const [notesByPatient, setNotesByPatient] = useState(initialNotes);
  const [analysisByPatient, setAnalysisByPatient] = useState({});
  const [carePlanByPatient, setCarePlanByPatient] = useState({});
  const [handoffByPatient, setHandoffByPatient] = useState({});
  const [showInspector, setShowInspector] = useState(true);
  const [inspectorLogs, setInspectorLogs] = useState([]);
  const [loadingAction, setLoadingAction] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  const selectedPatient =
    PATIENTS.find((patient) => patient.id === selectedPatientId) || PATIENTS[0];
  const notes = notesByPatient[selectedPatientId] || "";
  const analysis = analysisByPatient[selectedPatientId];
  const carePlan = carePlanByPatient[selectedPatientId];
  const handoff = handoffByPatient[selectedPatientId];

  const noteLength = notes.trim().length;

  const addInspectorLog = (entry) => {
    setInspectorLogs((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        ...entry,
      },
      ...prev,
    ]);
  };

  async function callClaude({ actionName, systemPrompt, userContent, maxTokens }) {
    const requestBody = {
      model: "claude-haiku-4-5-20251001",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userContent }],
    };
    const startedAt = Date.now();

    try {
      const response = await fetch("https://careiq-proxy.onrender.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const payload = await response.json();
      const rawText = payload?.content?.[0]?.text || "";
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${payload?.error?.message || "API error"}`
        );
      }
      const parsed = parseModelJson(rawText);
      addInspectorLog({
        actionName,
        status: "success",
        durationMs: Date.now() - startedAt,
        request: requestBody,
        response: payload,
      });
      return parsed;
    } catch (error) {
      addInspectorLog({
        actionName,
        status: "error",
        durationMs: Date.now() - startedAt,
        request: requestBody,
        response: { error: error?.message || "Unknown error" },
      });
      throw error;
    }
  }

  const updateNotes = (value) => {
    setNotesByPatient((prev) => ({ ...prev, [selectedPatientId]: value }));
  };

  const runAnalysis = async () => {
    setErrorMessage("");
    setWarningMessage("");

    const vitalIssues = validateVitals(selectedPatient.vitals);
    if (vitalIssues.length > 0) {
      setErrorMessage(
        `Vitals validation failed: ${vitalIssues.join(" ")} Please correct before analysis.`
      );
      return;
    }

    if (noteLength < 10) {
      setErrorMessage("Please enter visit notes before running analysis.");
      return;
    }
    if (noteLength < 50) {
      setWarningMessage("Brief notes may result in less accurate analysis.");
    }

    setLoadingAction("analysis");
    setCarePlanByPatient((prev) => ({ ...prev, [selectedPatientId]: null }));
    setHandoffByPatient((prev) => ({ ...prev, [selectedPatientId]: null }));

    try {
      const output = await callClaude({
        actionName: "Visit Analysis",
        systemPrompt: ANALYSIS_PROMPT,
        userContent: formatAnalysisInput(selectedPatient, notes),
        maxTokens: 1000,
      });
      setAnalysisByPatient((prev) => ({ ...prev, [selectedPatientId]: output }));
    } catch (_error) {
      setErrorMessage("Analysis failed - try again or load demo data.");
    } finally {
      setLoadingAction(null);
    }
  };

  const loadDemoAnalysis = () => {
    const demo = DEMO_ANALYSIS[selectedPatientId];
    setAnalysisByPatient((prev) => ({ ...prev, [selectedPatientId]: demo }));
    setCarePlanByPatient((prev) => ({ ...prev, [selectedPatientId]: null }));
    setHandoffByPatient((prev) => ({ ...prev, [selectedPatientId]: null }));
    setErrorMessage("");
    setWarningMessage("");
    addInspectorLog({
      actionName: "Visit Analysis (Demo Fallback)",
      status: "success",
      durationMs: 0,
      request: { source: "local-demo", patient_id: selectedPatientId },
      response: demo,
    });
  };

  const generateCarePlan = async () => {
    setErrorMessage("");
    if (!analysis) {
      setErrorMessage("Run analysis first before generating a care plan.");
      return;
    }
    setLoadingAction("carePlan");
    try {
      const output = await callClaude({
        actionName: "Care Plan Generation",
        systemPrompt: CARE_PLAN_PROMPT,
        userContent: `Based on this clinical assessment, generate a 7-day care plan:\n\n${JSON.stringify(
          analysis,
          null,
          2
        )}`,
        maxTokens: 1000,
      });
      setCarePlanByPatient((prev) => ({ ...prev, [selectedPatientId]: output }));
    } catch (_error) {
      const fallback = DEMO_CARE_PLAN[selectedPatientId];
      setCarePlanByPatient((prev) => ({ ...prev, [selectedPatientId]: fallback }));
      setWarningMessage(
        "Care plan API call failed - loaded pre-computed demo care plan."
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const generateHandoff = async () => {
    setErrorMessage("");
    if (!analysis) {
      setErrorMessage("Run analysis first before generating shift handoff.");
      return;
    }
    setLoadingAction("handoff");
    try {
      const output = await callClaude({
        actionName: "Shift Handoff (SBAR)",
        systemPrompt: HANDOFF_PROMPT,
        userContent: formatHandoffInput(selectedPatient, notes, analysis),
        maxTokens: 1000,
      });
      setHandoffByPatient((prev) => ({ ...prev, [selectedPatientId]: output }));
    } catch (_error) {
      const fallback = DEMO_HANDOFF[selectedPatientId];
      setHandoffByPatient((prev) => ({ ...prev, [selectedPatientId]: fallback }));
      setWarningMessage("Handoff API call failed - loaded demo SBAR output.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div
      style={{
        background: COLORS.background,
        minHeight: "100vh",
        fontFamily: "'DM Sans', system-ui, -apple-system, Segoe UI, sans-serif",
        color: COLORS.textMain,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');
      `}</style>

      <header
        style={{
          height: 72,
          borderBottom: `1px solid ${COLORS.border}`,
          background: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
          gap: 12,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: COLORS.primary,
              display: "grid",
              placeItems: "center",
              color: "white",
              fontWeight: 700,
            }}
          >
            C
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>CareIQ</div>
            <div style={{ color: COLORS.textMuted, fontSize: 12 }}>
              AI Nurse Copilot
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setActiveTab("copilot")}
            style={{
              border: "none",
              padding: "10px 14px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 700,
              background: activeTab === "copilot" ? COLORS.primary : "#E2E8F0",
              color: activeTab === "copilot" ? "white" : "#1E293B",
            }}
          >
            Copilot
          </button>
          <button
            onClick={() => setActiveTab("api")}
            style={{
              border: "none",
              padding: "10px 14px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 700,
              background: activeTab === "api" ? COLORS.primary : "#E2E8F0",
              color: activeTab === "api" ? "white" : "#1E293B",
            }}
          >
            API Reference
          </button>
          <button
            onClick={() => setShowInspector((prev) => !prev)}
            style={{
              border: `1px solid ${COLORS.border}`,
              padding: "10px 14px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 700,
              background: "white",
              color: "#1E293B",
            }}
          >
            {showInspector ? "Hide Inspector" : "Show Inspector"}
          </button>
        </div>
      </header>

      <div style={{ display: "flex", minHeight: "calc(100vh - 72px)" }}>
        <aside
          style={{
            width: 300,
            background: COLORS.sidebar,
            color: "#E2E8F0",
            padding: 14,
            borderRight: `1px solid #0F172A`,
          }}
        >
          <div
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              marginBottom: 10,
              color: "#94A3B8",
              fontWeight: 700,
            }}
          >
            Patients (3)
          </div>
          {PATIENTS.map((patient) => {
            const severity = severityFromRiskScore(patient.risk);
            const selected = patient.id === selectedPatientId;
            return (
              <button
                key={patient.id}
                onClick={() => {
                  setSelectedPatientId(patient.id);
                  setErrorMessage("");
                  setWarningMessage("");
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  border: selected
                    ? `1px solid ${COLORS.primary}`
                    : "1px solid #334155",
                  background: selected ? "#0F172A" : "#1E293B",
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 10,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <div style={{ color: "white", fontWeight: 700 }}>
                    {patient.name}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      borderRadius: 999,
                      padding: "4px 8px",
                      color: "white",
                      background: severityColor(severity),
                    }}
                  >
                    {severity.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8" }}>
                  {patient.id} | {patient.program}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: "#CBD5E1",
                    lineHeight: 1.35,
                  }}
                >
                  {patient.conditions.join(", ")}
                </div>
                <div style={{ marginTop: 8, fontSize: 12, color: "#A5B4FC" }}>
                  Risk Score: {patient.risk}
                </div>
              </button>
            );
          })}
        </aside>

        <main style={{ flex: 1, padding: 18, overflow: "auto" }}>
          {activeTab === "copilot" ? (
            <>
              <Card title="Patient Overview" style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>
                      {selectedPatient.name}
                    </div>
                    <div style={{ color: COLORS.textMuted, marginTop: 4 }}>
                      {selectedPatient.age}
                      {selectedPatient.gender} | {selectedPatient.id} |{" "}
                      {selectedPatient.program}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      {selectedPatient.conditions.map((condition) => (
                        <span
                          key={condition}
                          style={{
                            display: "inline-block",
                            marginRight: 8,
                            marginBottom: 8,
                            background: "#E2E8F0",
                            borderRadius: 999,
                            padding: "6px 10px",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>Assigned Nurse:</strong> {selectedPatient.nurse}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>Completed Visits:</strong> {selectedPatient.visits}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>Last Visit:</strong> {selectedPatient.lastVisit}
                    </div>
                    <div>
                      <strong>Address:</strong> {selectedPatient.address}
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Vitals (Current Visit)" style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: 10,
                  }}
                >
                  {[
                    {
                      key: "bp",
                      label: "Blood Pressure",
                      value: `${selectedPatient.vitals.bp_sys}/${selectedPatient.vitals.bp_dia}`,
                      unit: "mmHg",
                    },
                    {
                      key: "pulse",
                      label: "Pulse",
                      value: selectedPatient.vitals.pulse,
                      unit: "bpm",
                    },
                    {
                      key: "spo2",
                      label: "SpO2",
                      value: selectedPatient.vitals.spo2,
                      unit: "%",
                    },
                    {
                      key: "temp",
                      label: "Temperature",
                      value: selectedPatient.vitals.temp,
                      unit: "deg F",
                    },
                    {
                      key: "glucose_fasting",
                      label: "Fasting Glucose",
                      value: selectedPatient.vitals.glucose_fasting,
                      unit: "mg/dL",
                    },
                    {
                      key: "weight",
                      label: "Weight",
                      value: selectedPatient.vitals.weight,
                      unit: "kg",
                    },
                  ].map((vital) => {
                    const status = vitalDisplayStatus(vital.key, selectedPatient.vitals);
                    return (
                      <div
                        key={vital.key}
                        style={{
                          border: `1px solid ${COLORS.border}`,
                          borderLeft: `6px solid ${severityColor(status)}`,
                          borderRadius: 10,
                          padding: 10,
                          background: "#F8FAFC",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            color: COLORS.textMuted,
                            marginBottom: 6,
                          }}
                        >
                          {vital.label}
                        </div>
                        <div style={{ fontSize: 20, fontWeight: 800 }}>
                          {vital.value}{" "}
                          <span style={{ fontSize: 12, color: COLORS.textMuted }}>
                            {vital.unit}
                          </span>
                        </div>
                        <div style={{ marginTop: 6 }}>
                          <SeverityBadge severity={status} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card title="Nurse Notes (Editable)" style={{ marginBottom: 14 }}>
                <textarea
                  value={notes}
                  onChange={(event) => updateNotes(event.target.value)}
                  rows={8}
                  style={{
                    width: "100%",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 10,
                    resize: "vertical",
                    padding: 12,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    lineHeight: 1.45,
                  }}
                />
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: noteLength < 50 ? COLORS.medium : COLORS.textMuted,
                  }}
                >
                  Characters: {noteLength}{" "}
                  {noteLength < 50
                    ? "(brief notes can reduce AI quality)"
                    : "(good detail level)"}
                </div>
              </Card>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                <button
                  onClick={runAnalysis}
                  disabled={loadingAction !== null}
                  style={{
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 16px",
                    cursor: loadingAction ? "not-allowed" : "pointer",
                    color: "white",
                    fontWeight: 700,
                    background: COLORS.primary,
                    opacity: loadingAction ? 0.65 : 1,
                  }}
                >
                  {loadingAction === "analysis" ? "Analyzing..." : "Run AI Analysis"}
                </button>
                <button
                  onClick={loadDemoAnalysis}
                  disabled={loadingAction !== null}
                  style={{
                    border: `1px solid ${COLORS.primary}`,
                    borderRadius: 10,
                    padding: "10px 16px",
                    cursor: loadingAction ? "not-allowed" : "pointer",
                    color: COLORS.primary,
                    fontWeight: 700,
                    background: "white",
                  }}
                >
                  Load Demo Data
                </button>
                {analysis ? (
                  <button
                    onClick={generateCarePlan}
                    disabled={loadingAction !== null}
                    style={{
                      border: "none",
                      borderRadius: 10,
                      padding: "10px 16px",
                      cursor: loadingAction ? "not-allowed" : "pointer",
                      color: "white",
                      fontWeight: 700,
                      background: "#1D4ED8",
                      opacity: loadingAction ? 0.65 : 1,
                    }}
                  >
                    {loadingAction === "carePlan"
                      ? "Generating Plan..."
                      : "Generate 7-Day Care Plan"}
                  </button>
                ) : null}
                {analysis ? (
                  <button
                    onClick={generateHandoff}
                    disabled={loadingAction !== null}
                    style={{
                      border: "none",
                      borderRadius: 10,
                      padding: "10px 16px",
                      cursor: loadingAction ? "not-allowed" : "pointer",
                      color: "white",
                      fontWeight: 700,
                      background: "#7C3AED",
                      opacity: loadingAction ? 0.65 : 1,
                    }}
                  >
                    {loadingAction === "handoff"
                      ? "Generating Handoff..."
                      : "Generate Shift Handoff"}
                  </button>
                ) : null}
              </div>

              {errorMessage ? (
                <div
                  style={{
                    marginBottom: 14,
                    border: `1px solid #FCA5A5`,
                    background: "#FEF2F2",
                    borderRadius: 10,
                    padding: 12,
                    color: "#991B1B",
                    fontWeight: 600,
                  }}
                >
                  {errorMessage}
                </div>
              ) : null}

              {warningMessage ? (
                <div
                  style={{
                    marginBottom: 14,
                    border: `1px solid #FCD34D`,
                    background: "#FFFBEB",
                    borderRadius: 10,
                    padding: 12,
                    color: "#92400E",
                    fontWeight: 600,
                  }}
                >
                  {warningMessage}
                </div>
              ) : null}

              {analysis ? (
                <Card title="Visit Intelligence Analysis" style={{ marginBottom: 14 }}>
                  <div style={{ marginBottom: 12, lineHeight: 1.45 }}>
                    {analysis.patient_summary}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: 12,
                    }}
                  >
                    <div>
                      <h4 style={{ margin: "0 0 8px 0" }}>Extracted Symptoms</h4>
                      {(analysis.extracted_entities?.symptoms || []).map((item, index) => (
                        <div
                          key={`${item.symptom}-${index}`}
                          style={{
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: 8,
                            padding: 8,
                            marginBottom: 8,
                            background: "#F8FAFC",
                          }}
                        >
                          <strong>{item.symptom}</strong> | {item.duration} |{" "}
                          <SeverityBadge severity={item.severity} />
                        </div>
                      ))}

                      <h4 style={{ margin: "12px 0 8px 0" }}>Medications Stopped</h4>
                      {(analysis.extracted_entities?.medications_stopped || []).length ? (
                        (analysis.extracted_entities?.medications_stopped || []).map(
                          (item, index) => (
                            <div key={`${item.name}-${index}`} style={{ marginBottom: 6 }}>
                              {item.name} - {item.reason} ({item.days_ago} days ago)
                            </div>
                          )
                        )
                      ) : (
                        <div style={{ color: COLORS.textMuted }}>None reported</div>
                      )}
                    </div>

                    <div>
                      <h4 style={{ margin: "0 0 8px 0" }}>Risk Flags</h4>
                      {(analysis.risk_flags || []).map((flag, index) => (
                        <div
                          key={`${flag.title}-${index}`}
                          style={{
                            border: `1px solid ${COLORS.border}`,
                            borderLeft: `6px solid ${severityColor(flag.severity)}`,
                            borderRadius: 8,
                            padding: 10,
                            marginBottom: 10,
                            background: "#FFFFFF",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 10,
                              marginBottom: 6,
                            }}
                          >
                            <strong>{flag.title}</strong>
                            <SeverityBadge severity={flag.severity} />
                          </div>
                          <div style={{ fontSize: 13, marginBottom: 6 }}>
                            {flag.explanation}
                          </div>
                          <div style={{ fontSize: 13, color: COLORS.textMuted }}>
                            <strong>Action:</strong> {flag.action}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <h4 style={{ margin: "0 0 8px 0" }}>Vitals Assessment</h4>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {(analysis.vitals_assessment || []).map((item, index) => (
                        <div
                          key={`${item.vital}-${index}`}
                          style={{
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: 8,
                            padding: "8px 10px",
                            background: "#F8FAFC",
                            minWidth: 180,
                          }}
                        >
                          <div style={{ fontWeight: 700 }}>{item.vital}</div>
                          <div>{item.value}</div>
                          <div style={{ marginTop: 4 }}>
                            <SeverityBadge severity={item.status} />
                          </div>
                          <div
                            style={{
                              marginTop: 6,
                              color: COLORS.textMuted,
                              fontSize: 12,
                            }}
                          >
                            {item.note}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <h4 style={{ margin: "0 0 8px 0" }}>Care Actions</h4>
                    {(analysis.care_actions || []).map((item, index) => (
                      <div
                        key={`${item.action}-${index}`}
                        style={{
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: 8,
                          padding: 10,
                          marginBottom: 8,
                          background: "#F8FAFC",
                        }}
                      >
                        <div>
                          <strong>{item.action}</strong>
                        </div>
                        <div style={{ marginTop: 6, fontSize: 13 }}>
                          Priority: <strong>{item.priority}</strong> | Owner:{" "}
                          <strong>{item.owner}</strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      marginTop: 14,
                      border: `1px solid ${analysis.escalation?.needed ? "#FCA5A5" : "#BBF7D0"}`,
                      background: analysis.escalation?.needed ? "#FEF2F2" : "#F0FDF4",
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>
                      Escalation: {analysis.escalation?.needed ? "Required" : "Not Required"}
                    </div>
                    <div style={{ fontSize: 14 }}>
                      <strong>Urgency:</strong> {analysis.escalation?.urgency} |{" "}
                      <strong>Escalate To:</strong> {analysis.escalation?.escalate_to}
                    </div>
                    <div style={{ marginTop: 6 }}>{analysis.escalation?.reason}</div>
                  </div>
                </Card>
              ) : null}

              {carePlan ? (
                <Card title="Generated 7-Day Care Plan" style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>
                    {carePlan.care_plan_title}
                  </div>

                  <h4 style={{ margin: "0 0 8px 0" }}>Goals</h4>
                  {(carePlan.goals || []).map((goal, index) => (
                    <div
                      key={`${goal.goal}-${index}`}
                      style={{
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 8,
                        padding: 8,
                        marginBottom: 8,
                      }}
                    >
                      <strong>{goal.goal}</strong>
                      <div style={{ fontSize: 13, color: COLORS.textMuted }}>
                        Target: {goal.target} | Timeline: {goal.timeline}
                      </div>
                    </div>
                  ))}

                  <h4 style={{ margin: "14px 0 8px 0" }}>Daily Schedule</h4>
                  {(carePlan.daily_schedule || []).map((block, index) => (
                    <div key={`${block.day}-${index}`} style={{ marginBottom: 10 }}>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>{block.day}</div>
                      {(block.tasks || []).map((task, taskIndex) => (
                        <div
                          key={`${task.task}-${taskIndex}`}
                          style={{
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: 8,
                            padding: 8,
                            marginBottom: 6,
                            background: "#F8FAFC",
                          }}
                        >
                          <div>
                            <strong>{task.time}</strong> - {task.task}
                          </div>
                          <div style={{ fontSize: 13, color: COLORS.textMuted }}>
                            Owner: {task.owner} | {task.notes}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}

                  <h4 style={{ margin: "14px 0 8px 0" }}>Follow-Up</h4>
                  <div style={{ fontSize: 14 }}>
                    <strong>Next Visit:</strong> {carePlan.follow_up?.next_visit} |{" "}
                    <strong>Teleconsult:</strong> {carePlan.follow_up?.teleconsult} |{" "}
                    <strong>Lab Tests:</strong> {carePlan.follow_up?.lab_tests}
                  </div>
                </Card>
              ) : null}

              {handoff ? (
                <Card title="Shift Handoff (SBAR)">
                  <div style={{ marginBottom: 10 }}>
                    <strong>Situation:</strong> {handoff.sbar?.situation}
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <strong>Background:</strong> {handoff.sbar?.background}
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <strong>Assessment:</strong> {handoff.sbar?.assessment}
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <strong>Recommendation:</strong> {handoff.sbar?.recommendation}
                  </div>

                  <h4 style={{ margin: "12px 0 8px 0" }}>Critical Alerts</h4>
                  {(handoff.critical_alerts || []).length ? (
                    (handoff.critical_alerts || []).map((item, index) => (
                      <div key={`${item}-${index}`}>- {item}</div>
                    ))
                  ) : (
                    <div style={{ color: COLORS.textMuted }}>No critical alerts.</div>
                  )}

                  <h4 style={{ margin: "12px 0 8px 0" }}>Pending Tasks</h4>
                  {(handoff.pending_tasks || []).map((item, index) => (
                    <div key={`${item}-${index}`}>- {item}</div>
                  ))}

                  <h4 style={{ margin: "12px 0 8px 0" }}>Family Notes</h4>
                  <div>{handoff.family_notes}</div>
                </Card>
              ) : null}
            </>
          ) : (
            <Card title="CareIQ API Reference">
              <div style={{ lineHeight: 1.55 }}>
                <p>
                  <strong>Base endpoint:</strong> POST
                  https://api.anthropic.com/v1/messages
                </p>
                <p>
                  This prototype uses three schema-enforced calls:
                  <strong> Visit Analysis</strong>, <strong>Care Plan</strong>, and{" "}
                  <strong>Shift Handoff (SBAR)</strong>.
                </p>

                <h4 style={{ marginBottom: 8 }}>Data Flow</h4>
                <pre
                  style={{
                    background: COLORS.codeBg,
                    color: COLORS.codeText,
                    borderRadius: 10,
                    padding: 12,
                    overflow: "auto",
                    fontFamily: "'DM Mono', ui-monospace, monospace",
                    fontSize: 12,
                  }}
                >{`Nurse submits vitals + notes
    -> input validation (ranges, note length)
    -> patient context assembly
    -> LLM Visit Analysis (JSON schema)
         -> escalation decision
         -> risk flags + care actions
    -> optional LLM Care Plan
    -> optional LLM Shift Handoff`}</pre>

                <h4 style={{ marginBottom: 8, marginTop: 16 }}>Request Template</h4>
                <pre
                  style={{
                    background: COLORS.codeBg,
                    color: COLORS.codeText,
                    borderRadius: 10,
                    padding: 12,
                    overflow: "auto",
                    fontFamily: "'DM Mono', ui-monospace, monospace",
                    fontSize: 12,
                  }}
                >{`{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1000,
  "system": "...schema constrained prompt...",
  "messages": [
    { "role": "user", "content": "...patient context..." }
  ]
}`}</pre>

                <h4 style={{ marginBottom: 8, marginTop: 16 }}>Prototype Guarantees</h4>
                <ul>
                  <li>Strict JSON parsing from <code>content[0].text</code></li>
                  <li>Fallback demo data available without API connectivity</li>
                  <li>Real-time API Inspector with request/response + latency</li>
                  <li>Human-in-the-loop decision flow for all actions</li>
                </ul>

                <h4 style={{ marginBottom: 8, marginTop: 16 }}>Cost Model (from spec)</h4>
                <p>
                  Approximate cost: INR 4.3 per visit for all three LLM calls at
                  prototype token sizes.
                </p>
              </div>
            </Card>
          )}
        </main>

        {showInspector ? (
          <section
            style={{
              width: 380,
              borderLeft: `1px solid ${COLORS.border}`,
              background: COLORS.codeBg,
              color: COLORS.codeText,
              display: "flex",
              flexDirection: "column",
              minHeight: "calc(100vh - 72px)",
            }}
          >
            <div
              style={{
                padding: 12,
                borderBottom: "1px solid #1E293B",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: 700 }}>API Inspector</div>
              <button
                onClick={() => setInspectorLogs([])}
                style={{
                  border: "1px solid #334155",
                  borderRadius: 8,
                  padding: "6px 10px",
                  background: "#111827",
                  color: "#CFFAFE",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Clear
              </button>
            </div>

            <div style={{ overflow: "auto", padding: 12, flex: 1 }}>
              {inspectorLogs.length === 0 ? (
                <div style={{ color: "#7DD3FC", fontSize: 13 }}>
                  No API logs yet. Run analysis or load demo data.
                </div>
              ) : (
                inspectorLogs.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      border: "1px solid #1E293B",
                      borderRadius: 10,
                      marginBottom: 12,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        background: "#111827",
                        padding: "8px 10px",
                        fontSize: 12,
                        borderBottom: "1px solid #1E293B",
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>
                        {log.actionName}
                      </div>
                      <div>
                        Status:{" "}
                        <strong
                          style={{
                            color:
                              log.status === "success" ? "#86EFAC" : "#FCA5A5",
                          }}
                        >
                          {log.status}
                        </strong>{" "}
                        | {log.durationMs} ms
                      </div>
                      <div style={{ marginTop: 2, color: "#67E8F9" }}>
                        {log.timestamp}
                      </div>
                    </div>
                    <div style={{ padding: 10 }}>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>Request</div>
                      <pre
                        style={{
                          margin: 0,
                          marginBottom: 10,
                          whiteSpace: "pre-wrap",
                          fontFamily: "'DM Mono', ui-monospace, monospace",
                          fontSize: 11,
                          lineHeight: 1.45,
                        }}
                      >
                        {JSON.stringify(log.request, null, 2)}
                      </pre>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>Response</div>
                      <pre
                        style={{
                          margin: 0,
                          whiteSpace: "pre-wrap",
                          fontFamily: "'DM Mono', ui-monospace, monospace",
                          fontSize: 11,
                          lineHeight: 1.45,
                        }}
                      >
                        {JSON.stringify(log.response, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

export default App;
