import { Patient } from "@/types/patient";

export const PATIENTS: Patient[] = [
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
