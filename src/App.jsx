import React, { useState } from "react";

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

const INCOMING_NURSES = [
  { id: "N-001", name: "Kavitha Rajan", phone: "919876543210", specialty: "Chronic Care", shift: "Night Shift" },
  { id: "N-002", name: "Suma Krishnan", phone: "919876543211", specialty: "Post-Surgical", shift: "Evening Shift" },
  { id: "N-003", name: "Divya Nair", phone: "919876543212", specialty: "Respiratory Care", shift: "Night Shift" },
  { id: "N-004", name: "Lakshmi Iyer", phone: "919876543213", specialty: "General Care", shift: "Evening Shift" },
];

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
    lastVisit: "2026-05-10",
    vitals: { bp_sys: 158, bp_dia: 94, pulse: 82, spo2: 96, temp: 98.4, glucose_fasting: 187, weight: 72.5 },
    notes: "Patient Mrs. Lakshmi Devi, 67F, visited for chronic care follow-up. BP slightly elevated at 158/94. Sugar fasting 187 mg/dL, PP not taken today. Patient complains of persistent swelling in both ankles for past 3 days. Says she stopped taking Telmisartan 2 days back because she felt dizzy. Currently on Metformin 500mg BD, Amlodipine 5mg OD. Wound on left foot from last visit is healing but still has mild discharge. Patient lives alone, daughter visits on weekends. Diet compliance poor - patient admits to eating rice-heavy meals.",
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
    lastVisit: "2026-05-12",
    vitals: { bp_sys: 128, bp_dia: 82, pulse: 74, spo2: 98, temp: 98.6, glucose_fasting: 112, weight: 78 },
    notes: "Mr. Rajesh Sharma, 55M, post-CABG day 18. Surgical wound healing well, no signs of infection. Mild chest discomfort on exertion which subsides with rest. Walking 15 mins daily as advised. Compliance with medications good. Sleep disturbed due to anxiety about returning to work.",
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
    lastVisit: "2026-05-13",
    vitals: { bp_sys: 134, bp_dia: 78, pulse: 92, spo2: 89, temp: 99.2, glucose_fasting: 104, weight: 58 },
    notes: "Mrs. Fatima Begum, 78F, COPD Stage III on home O2 at 2L/min. SpO2 on O2 is 89%. Increased breathlessness since yesterday. Sputum yellowish-green since morning. Son reports she refuses O2 cannula at night.",
  },
];

const EMPTY_VITALS = { bp_sys: "", bp_dia: "", pulse: "", spo2: "", temp: "", glucose_fasting: "", weight: "" };

// ── UTILS ──
function severityFromRiskScore(s) {
  if (s >= 80) return "critical";
  if (s >= 65) return "high";
  if (s >= 40) return "medium";
  return "low";
}

function severityColor(s) {
  if (s === "critical" || s === "obese") return COLORS.critical;
  if (s === "high" || s === "elevated" || s === "severe") return COLORS.high;
  if (s === "medium") return COLORS.medium;
  return COLORS.low;
}

function normalizeStatus(s) {
  if (!s) return "normal";
  const l = String(s).toLowerCase();
  if (["critical", "obese", "severe"].includes(l)) return "critical";
  if (["elevated", "high", "medium"].includes(l)) return "elevated";
  if (l === "low") return "low";
  return "normal";
}

function vitalStatus(key, v) {
  const val = parseFloat(v);
  if (isNaN(val)) return "normal";
  if (key === "bp_sys") return val >= 180 ? "critical" : val >= 140 ? "elevated" : val < 90 ? "low" : "normal";
  if (key === "bp_dia") return val >= 110 ? "critical" : val >= 90 ? "elevated" : val < 60 ? "low" : "normal";
  if (key === "spo2") return val < 88 ? "critical" : val < 92 ? "elevated" : "normal";
  if (key === "pulse") return val > 120 || val < 40 ? "critical" : val > 100 || val < 60 ? "elevated" : "normal";
  if (key === "temp") return val >= 102 || val <= 95 ? "critical" : val >= 99.5 ? "elevated" : "normal";
  if (key === "glucose_fasting") return val >= 250 ? "critical" : val >= 130 ? "elevated" : val < 70 ? "low" : "normal";
  if (key === "weight") {
    if (val >= 100) return "obese";
    if (val >= 80) return "high";
    return "normal";
  }
  return "normal";
}

// ── DYNAMIC DEMO DATA GENERATORS ──
const generateMockAnalysis = (patient, vitals, notes) => {
  const isCritical = 
    normalizeStatus(vitalStatus("bp_sys", vitals.bp_sys)) === "critical" ||
    normalizeStatus(vitalStatus("bp_dia", vitals.bp_dia)) === "critical" ||
    normalizeStatus(vitalStatus("spo2", vitals.spo2)) === "critical" ||
    normalizeStatus(vitalStatus("weight", vitals.weight)) === "critical";

  const noteSnippet = notes ? `Nurse notes indicate: "${notes.substring(0, 80)}..."` : "No specific complaints noted.";
  const summarySentence = isCritical 
    ? "Acute deterioration detected requiring urgent review." 
    : "Patient remains relatively stable; standard observation advised.";

  return {
    patient_summary: `${patient.age}${patient.gender} patient presenting with BP ${vitals.bp_sys || "--"}/${vitals.bp_dia || "--"} mmHg, Fasting Glucose ${vitals.glucose_fasting || "--"} mg/dL, and Weight ${vitals.weight || "--"} kg. ${noteSnippet} ${summarySentence}`,
    extracted_entities: {
      symptoms: [{ symptom: "Reported in notes", duration: "Recent", severity: isCritical ? "severe" : "mild" }],
      medications_current: [],
      medications_stopped: []
    },
    risk_flags: [
      { 
        title: "Vital Sign Review", 
        severity: isCritical ? "critical" : "high", 
        explanation: `Vital signs currently tracking at ${vitals.bp_sys || "--"}/${vitals.bp_dia || "--"} mmHg.`, 
        action: isCritical ? "Report to doctor immediately." : "Follow care plan provided by nurse." 
      }
    ],
    vitals_assessment: [
      { vital: "Blood Pressure", value: `${vitals.bp_sys || "--"}/${vitals.bp_dia || "--"} mmHg`, status: vitalStatus("bp_sys", vitals.bp_sys), note: "Updated from input" },
      { vital: "Fasting Glucose", value: `${vitals.glucose_fasting || "--"} mg/dL`, status: vitalStatus("glucose_fasting", vitals.glucose_fasting), note: "Updated from input" },
      { vital: "Weight", value: `${vitals.weight || "--"} kg`, status: vitalStatus("weight", vitals.weight), note: "Updated from input" }
    ],
    care_actions: [
      { 
        priority: isCritical ? "immediate" : "today", 
        action: isCritical ? "Report to doctor immediately." : "Follow care plan provided by nurse.", 
        owner: isCritical ? "doctor" : "nurse" 
      }
    ],
    escalation: { needed: isCritical, urgency: isCritical ? "immediate" : "routine", reason: "Based on vital thresholds.", escalate_to: isCritical ? "physician" : "nurse" }
  };
};

const generateMockCarePlan = (vitals) => ({
  care_plan_title: "Expert 7-Day Stabilization & Care Plan",
  goals: [
    { goal: "Hemodynamic Stability", target: `BP < 140/90`, timeline: "Days 1-3" },
    { goal: "Symptom Control", target: "No acute distress reported", timeline: "Days 4-7" }
  ],
  daily_schedule: [
    { 
      day: "Days 1-2: Acute Monitoring", 
      tasks: [
        { time: "Morning", task: "Step 1: Check resting vitals. Step 2: Administer morning medications. Step 3: Assess for edema or discomfort.", owner: "nurse", notes: "Log all findings immediately." },
        { time: "Evening", task: "Step 1: Review dietary intake. Step 2: Ensure sleep hygiene protocol is followed.", owner: "family", notes: "Keep patient upright if experiencing breathlessness." }
      ] 
    },
    { 
      day: "Days 3-5: Transition & Education", 
      tasks: [
        { time: "Morning", task: "Step 1: Re-assess vitals. Step 2: Educate patient on medication adherence.", owner: "nurse", notes: "Ensure patient understands the routine." },
        { time: "Afternoon", task: "Step 1: Conduct 15-min guided mobility exercise. Step 2: Check skin and wound integrity.", owner: "coordinator", notes: "Stop if patient reports fatigue." }
      ] 
    },
    { 
      day: "Days 6-7: Maintenance & Review", 
      tasks: [
        { time: "Morning", task: "Step 1: Final weekly vital check. Step 2: Prepare report for physician review.", owner: "nurse", notes: "Compile all logs." },
        { time: "Evening", task: "Step 1: Confirm follow-up appointment. Step 2: Restock medications.", owner: "family", notes: "Verify teleconsult link." }
      ] 
    }
  ],
  monitoring_parameters: [
    { parameter: "Blood Pressure", frequency: "Twice Daily", alert_threshold: ">160/100 mmHg" },
    { parameter: "Weight", frequency: "Daily morning", alert_threshold: "+2kg in 48hrs" }
  ],
  patient_education: ["Strictly adhere to the medication timeline.", "Immediately report sudden dizziness, chest pain, or severe breathlessness."],
  follow_up: { next_visit: "Within 48 hours", teleconsult: "Scheduled for Day 3", lab_tests: "Basic Metabolic Panel" }
});

const generateMockHandoff = (patient, vitals) => ({
  sbar: {
    situation: `Patient ${patient.name} has updated vitals. BP: ${vitals.bp_sys || "--"}/${vitals.bp_dia || "--"}.`,
    background: `Known conditions: ${patient.conditions.join(', ')}`,
    assessment: "Review required based on latest inputs.",
    recommendation: "Please monitor closely."
  },
  critical_alerts: vitalStatus("bp_sys", vitals.bp_sys) === "critical" ? [`Critical BP: ${vitals.bp_sys}/${vitals.bp_dia}`] : [],
  pending_tasks: ["Review latest chart"],
  family_notes: "No new updates."
});

// ── SHARE FORMATTERS ──
function buildCarePlanText(patient, plan) {
  const goals = (plan.goals || []).map((g) => `• ${g.goal}: ${g.target} (${g.timeline})`).join("\n");
  const schedule = (plan.daily_schedule || []).map((b) => `*${b.day}*\n${(b.tasks || []).map((t) => `  ${t.time}: ${t.task} [${t.owner}]`).join("\n")}`).join("\n\n");
  const edu = (plan.patient_education || []).map((e) => `• ${e}`).join("\n");
  return `*CareIQ — 7-Day Care Plan*\nPatient: ${patient.name} (${patient.id})\nPlan: ${plan.care_plan_title}\n\n*Goals:*\n${goals}\n\n*Schedule:*\n${schedule}\n\n*Patient Education:*\n${edu}\n\n*Follow-Up:*\nNext Visit: ${plan.follow_up?.next_visit}\nTeleconsult: ${plan.follow_up?.teleconsult}\n\n_Sent via CareIQ AI Copilot_`;
}

// ── CLAUDE API INTEGRATION ──
const callClaudeAPI = async (apiKey, useProxy, systemPrompt, userPrompt) => {
  const url = useProxy ? "/api/anthropic/v1/messages" : "https://api.anthropic.com/v1/messages";
  
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true" 
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001", 
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      temperature: 0.1
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    if (errText.includes("<html>")) {
      throw new Error(`API Error ${res.status}: Proxy Error or CORS blocked. See settings.`);
    }
    throw new Error(`API Error: ${res.status} - ${errText}`);
  }

  const data = await res.json();
  const text = data.content[0].text;
  
 const fence = String.fromCharCode(96, 96, 96);
 const jsonMatchRegex = new RegExp(fence + "(?:json)?\\n([\\s\\S]*?)\\n" + fence);
 const fallbackRegex = /\{[\s\S]*\}/;
 const match = text.match(jsonMatchRegex) || text.match(fallbackRegex);
 let raw = match ? (match[1] || match[0]) : text;

// Clean common JSON issues from model output
raw = raw
  .replace(/,\s*}/g, '}')
  .replace(/,\s*]/g, ']')
  .trim();

return JSON.parse(raw);
};

// ── COMPONENTS ──
function Card({ title, titleRight, children, style }) {
  return (
    <section style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 16, ...style }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 0.4, color: COLORS.textMuted, fontWeight: 700 }}>
          {title}
        </div>
        {titleRight}
      </div>
      {children}
    </section>
  );
}

function SeverityBadge({ severity }) {
  const tone = normalizeStatus(severity);
  const bg = tone === "critical" ? "#FEE2E2" : tone === "elevated" ? "#FEF3C7" : tone === "low" ? "#E0F2FE" : "#DCFCE7";
  const color = tone === "critical" ? COLORS.critical : tone === "elevated" ? COLORS.high : tone === "low" ? "#0369A1" : COLORS.low;
  return (
    <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, borderRadius: 999, padding: "3px 9px", background: bg, color }}>
      {severity}
    </span>
  );
}

function VitalInput({ label, value, onChange, unit, statusKey }) {
  const st = vitalStatus(statusKey, value);
  const borderColor = normalizeStatus(st) === "critical" ? COLORS.critical : normalizeStatus(st) === "elevated" ? COLORS.high : normalizeStatus(st) === "low" ? "#0369A1" : COLORS.border;
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderLeft: `5px solid ${borderColor}`, borderRadius: 10, padding: "10px 12px", background: "#F8FAFC", flex: "1 1 140px" }}>
      <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder="—" style={{ width: "100%", border: "none", background: "transparent", fontSize: 18, fontWeight: 800, color: COLORS.textMain, outline: "none", fontFamily: "inherit" }} />
        <span style={{ fontSize: 11, color: COLORS.textMuted, whiteSpace: "nowrap" }}>{unit}</span>
      </div>
      {value !== "" && <div style={{ marginTop: 5 }}><SeverityBadge severity={st} /></div>}
    </div>
  );
}

const SharePill = ({ label, icon, onClick, bg }) => (
  <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer", background: bg, color: "white", fontWeight: 700, fontSize: 12 }}>
    <span style={{ fontSize: 14 }}>{icon}</span> {label}
  </button>
);

function HandoffModal({ patient, onClose, onConfirm }) {
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    if (!selectedNurse) return;
    setSending(true);
    setTimeout(() => onConfirm(selectedNurse), 1500);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 500 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Assign Shift Handoff</div>
          <button onClick={onClose} style={{ border: "none", background: "#F1F5F9", borderRadius: 6, cursor: "pointer", width: 32, height: 32 }}>✕</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {INCOMING_NURSES.map((nurse) => {
            const sel = selectedNurse?.id === nurse.id;
            return (
              <div key={nurse.id} onClick={() => setSelectedNurse(nurse)} style={{ padding: "14px 16px", borderRadius: 10, border: `2px solid ${sel ? COLORS.primary : COLORS.border}`, background: sel ? "#F0FDF9" : "#F8FAFC", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{nurse.name}</div>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: sel ? "#CCFBF1" : "#E2E8F0", color: sel ? COLORS.primary : COLORS.textMuted, fontWeight: 600 }}>{nurse.shift}</span>
                </div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{nurse.specialty}</div>
              </div>
            );
          })}
        </div>
        
        {selectedNurse && !sending && (
          <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: "#065F46" }}>
            The SBAR notes will be automatically shared with <strong>{selectedNurse.name}</strong> via WhatsApp (+{selectedNurse.phone}) and Telegram.
          </div>
        )}
        
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleSend} disabled={!selectedNurse || sending} style={{ flex: 1, padding: 13, borderRadius: 10, border: "none", cursor: selectedNurse && !sending ? "pointer" : "not-allowed", background: selectedNurse && !sending ? COLORS.primary : "#CBD5E1", color: "white", fontWeight: 700 }}>
            {sending ? "Sending via WhatsApp & Telegram..." : "Confirm & Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──
function App() {
  const [activeTab, setActiveTab] = useState("copilot");
  const [selectedPatientId, setSelectedPatientId] = useState(PATIENTS[0].id);
  
  // Data States
  const [notesByPatient, setNotesByPatient] = useState({});
  const [vitalsByPatient, setVitalsByPatient] = useState({});
  const [assignedNurses, setAssignedNurses] = useState({}); 
  
  // AI States
  const [apiKey, setApiKey] = useState("");
  const [useProxy, setUseProxy] = useState(true); // Default to true since user is on Netlify!
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisByPatient, setAnalysisByPatient] = useState({});
  const [carePlanByPatient, setCarePlanByPatient] = useState({});
  const [handoffByPatient, setHandoffByPatient] = useState({});
  
  // UI States
  const [showInspector, setShowInspector] = useState(true);
  const [inspectorLogs, setInspectorLogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showHandoffModal, setShowHandoffModal] = useState(false);
  const [handoffConfirmation, setHandoffConfirmation] = useState(null);

  const selectedPatient = PATIENTS.find((p) => p.id === selectedPatientId) || PATIENTS[0];
  const notes = notesByPatient[selectedPatientId] || "";
  const vitals = vitalsByPatient[selectedPatientId] || EMPTY_VITALS;
  const analysis = analysisByPatient[selectedPatientId];
  const carePlan = carePlanByPatient[selectedPatientId];
  const handoff = handoffByPatient[selectedPatientId];

  const addLog = (entry) => setInspectorLogs((p) => [{ id: `${Date.now()}`, timestamp: new Date().toISOString(), ...entry }, ...p]);
  
  const updateVital = (key, val) => {
    setVitalsByPatient((p) => ({ ...p, [selectedPatientId]: { ...(p[selectedPatientId] || EMPTY_VITALS), [key]: val } }));
  };
  
  const updateNotes = (val) => {
    setNotesByPatient((p) => ({ ...p, [selectedPatientId]: val }));
  };

  const selectPatient = (id) => {
    setSelectedPatientId(id);
    setErrorMessage("");
    setHandoffConfirmation(null);
  };

  const loadDemoData = () => {
    const patient = PATIENTS.find((p) => p.id === selectedPatientId);
    setVitalsByPatient((p) => ({ ...p, [selectedPatientId]: { ...patient.vitals } }));
    setNotesByPatient((p) => ({ ...p, [selectedPatientId]: patient.notes }));
    setAnalysisByPatient((p) => ({ ...p, [selectedPatientId]: null }));
    setCarePlanByPatient((p) => ({ ...p, [selectedPatientId]: null }));
    setHandoffByPatient((p) => ({ ...p, [selectedPatientId]: null }));
    setHandoffConfirmation(null);
    setErrorMessage("");
  };

  const getPatientContextStr = () => `
    Patient: ${selectedPatient.name}, ${selectedPatient.age}${selectedPatient.gender}
    Conditions: ${selectedPatient.conditions.join(', ')}
    Current Vitals Recorded (Analyze these specifically):
    - BP: ${vitals.bp_sys}/${vitals.bp_dia} mmHg
    - Pulse: ${vitals.pulse} bpm
    - SpO2: ${vitals.spo2} %
    - Temp: ${vitals.temp} F
    - Fasting Glucose: ${vitals.glucose_fasting} mg/dL
    - Weight: ${vitals.weight} kg
    Nurse Visit Notes: ${notes}
  `;

  const runAnalysis = async () => {
    if (analysis) return setAnalysisByPatient((p) => ({ ...p, [selectedPatientId]: null }));
    setErrorMessage("");
    
    if (!apiKey) {
      const mockResult = generateMockAnalysis(selectedPatient, vitals, notes);
      setAnalysisByPatient((p) => ({ ...p, [selectedPatientId]: mockResult }));
      addLog({ actionName: "Analyze Visit (Dynamic Mock)", status: "success", durationMs: 15, request: { source: "local" }, response: "Loaded Mock Analysis" });
      return;
    }
    
    setIsGenerating(true);
    try {
      const system = "You are a clinical AI. Output ONLY raw JSON matching the requested schema. No markdown formatting.";
      const prompt = `Analyze this patient visit and extract highly detailed clinical insights based EXACTLY on these inputs:\n${getPatientContextStr()}\n
      INSTRUCTIONS:
      1. For "patient_summary": Write a 2 to 4 sentence comprehensive clinical analysis that explicitly synthesizes the provided vitals AND the nurse notes. Do not just list the numbers.
      2. For "care_actions": If ANY vital sign, symptom, or risk flag is determined to be "critical" or "obese", the very first action MUST be exactly "Report to doctor immediately.". If there are NO critical flags, the action MUST be exactly "Follow care plan provided by nurse.".
      
      Return JSON exactly like this:
      {
        "patient_summary": "Highly detailed clinical summary...",
        "extracted_entities": {
          "symptoms": [{"symptom": "...", "duration": "...", "severity": "mild|moderate|severe"}],
          "medications_current": [{"name":"...", "dose":"...", "frequency":"..."}],
          "medications_stopped": [{"name":"...", "reason":"...", "days_ago": number}]
        },
        "risk_flags": [{"title": "...", "severity": "low|medium|high|critical", "explanation": "Detailed explanation...", "action": "..." }],
        "vitals_assessment": [{"vital": "...", "value": "...", "status": "normal|elevated|low|critical|high|obese", "note": "Detailed note..."}],
        "care_actions": [{"priority": "today|this_week|immediate", "action": "...", "owner": "nurse|doctor|coordinator"}],
        "escalation": {"needed": boolean, "urgency": "...", "reason": "...", "escalate_to": "physician|ER"}
      }`;

      const startTime = Date.now();
      const result = await callClaudeAPI(apiKey, useProxy, system, prompt);
      setAnalysisByPatient((p) => ({ ...p, [selectedPatientId]: result }));
      addLog({ actionName: "Analyze Visit (Claude API)", status: "success", durationMs: Date.now() - startTime, request: { data: vitals }, response: result });
    } catch (err) {
      setErrorMessage(err.message);
      addLog({ actionName: "Analyze Visit (Failed)", status: "error", durationMs: 0, request: {}, response: err.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCarePlan = async () => {
    if (carePlan) return setCarePlanByPatient((p) => ({ ...p, [selectedPatientId]: null }));
    setErrorMessage("");

    if (!apiKey) {
      const mockResult = generateMockCarePlan(vitals);
      setCarePlanByPatient((p) => ({ ...p, [selectedPatientId]: mockResult }));
      return;
    }
    
    setIsGenerating(true);
    try {
      const system = "You are a clinical AI. Output ONLY raw JSON matching the requested schema.";
      const prompt = `Act as an expert caregiver. Generate a highly detailed, step-by-step 7-day care plan based on these inputs:\n${getPatientContextStr()}\n
      Make the tasks highly actionable, specific, and broken down step-by-step.
      CRITICAL: You MUST explicitly cover all 7 days in the daily_schedule array (e.g., "Days 1-2", "Days 3-5", "Days 6-7"). Do not leave out any days.
      
      Return JSON exactly like this:
      {
        "care_plan_title": "...",
        "goals": [{"goal": "...", "target": "...", "timeline": "..."}],
        "daily_schedule": [
          {"day": "Days 1-2", "tasks": [{"time": "Morning", "task": "Step 1: ... Step 2: ... Step 3: ...", "owner": "nurse|doctor|patient", "notes": "..."}]},
          {"day": "Days 3-5", "tasks": [{"time": "Afternoon", "task": "Step 1: ...", "owner": "...", "notes": "..."}]},
          {"day": "Days 6-7", "tasks": [{"time": "Evening", "task": "Step 1: ...", "owner": "...", "notes": "..."}]}
        ],
        "monitoring_parameters": [{"parameter": "...", "frequency": "...", "alert_threshold": "..."}],
        "patient_education": ["..."],
        "follow_up": {"next_visit": "...", "teleconsult": "...", "lab_tests": "..."}
      }`;

      const result = await callClaudeAPI(apiKey, useProxy, system, prompt);
      setCarePlanByPatient((p) => ({ ...p, [selectedPatientId]: result }));
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateHandoff = async () => {
    if (handoff) return setHandoffByPatient((p) => ({ ...p, [selectedPatientId]: null }));
    setErrorMessage("");

    if (!apiKey) {
      const mockResult = generateMockHandoff(selectedPatient, vitals);
      setHandoffByPatient((p) => ({ ...p, [selectedPatientId]: mockResult }));
      return;
    }
    
    setIsGenerating(true);
    try {
      const system = "You are a clinical AI. Output ONLY raw JSON matching the requested schema.";
      const prompt = `Act as an expert clinical coordinator. Generate a highly detailed SBAR shift handoff based on these inputs:\n${getPatientContextStr()}\n
      Make sure the Assessment and Recommendation sections are thorough and reference specific updated vitals.
      
      Return JSON exactly like this:
      {
        "sbar": {"situation": "...", "background": "...", "assessment": "...", "recommendation": "..."},
        "critical_alerts": ["..."],
        "pending_tasks": ["..."],
        "family_notes": "..."
      }`;

      const result = await callClaudeAPI(apiKey, useProxy, system, prompt);
      setHandoffByPatient((p) => ({ ...p, [selectedPatientId]: result }));
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHandoffConfirm = (nurse) => {
    const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setAssignedNurses(prev => ({ ...prev, [selectedPatientId]: nurse.name }));
    setHandoffConfirmation({ nurseName: nurse.name, patientId: selectedPatientId, phone: nurse.phone, time });
    setShowHandoffModal(false);
    addLog({ actionName: "Shift Handoff Assigned", status: "success", durationMs: 0, request: { nurse: nurse.name }, response: { status: "assigned", time } });
  };
  
  const shareCarePlanWhatsApp = () => {
    if (!carePlan) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(buildCarePlanText(selectedPatient, carePlan))}`, "_blank");
  };
  
  const shareCarePlanTelegram = () => {
    if (!carePlan) return;
    window.open(`https://t.me/share/url?url=${encodeURIComponent('https://careiq.app')}&text=${encodeURIComponent(buildCarePlanText(selectedPatient, carePlan))}`, "_blank");
  };

  return (
    <div style={{ background: COLORS.background, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: COLORS.textMain }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap'); input[type=number]::-webkit-inner-spin-button { opacity: 0.4; }`}</style>

      {showHandoffModal && <HandoffModal patient={selectedPatient} onClose={() => setShowHandoffModal(false)} onConfirm={handleHandoffConfirm} />}

      {/* HEADER */}
      <header style={{ height: 64, borderBottom: `1px solid ${COLORS.border}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: COLORS.primary, display: "grid", placeItems: "center", color: "white", fontWeight: 700, fontSize: 15 }}>C</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>CareIQ</div>
            <div style={{ color: COLORS.textMuted, fontSize: 11 }}>AI Nurse Copilot</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["copilot", "api"].map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ border: "none", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 700, background: activeTab === t ? COLORS.primary : "#E2E8F0", color: activeTab === t ? "white" : "#1E293B", fontSize: 13 }}>
              {t === "copilot" ? "Copilot" : "API Reference"}
            </button>
          ))}
          <button onClick={() => setShowInspector(!showInspector)} style={{ border: `1px solid ${COLORS.border}`, padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 700, background: "white", color: "#1E293B", fontSize: 13 }}>
            {showInspector ? "Hide Inspector" : "API Inspector"}
          </button>
        </div>
      </header>

      <div style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
        {/* SIDEBAR */}
        <aside style={{ width: 280, background: COLORS.sidebar, color: "#E2E8F0", padding: 12, flexShrink: 0, overflowY: "auto" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10, color: "#94A3B8", fontWeight: 700 }}>Patients ({PATIENTS.length})</div>
          {PATIENTS.map((patient) => {
            const sel = patient.id === selectedPatientId;
            const sev = severityFromRiskScore(patient.risk); // Calculate risk severity
            return (
              <button key={patient.id} onClick={() => selectPatient(patient.id)} style={{ width: "100%", textAlign: "left", border: sel ? `2px solid ${COLORS.primary}` : "1px solid #334155", background: sel ? "#0F172A" : "#1E293B", borderRadius: 10, padding: 12, marginBottom: 8, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ color: "white", fontWeight: 700, fontSize: 13 }}>{patient.name}</div>
                  <span style={{ fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "3px 7px", color: "white", background: severityColor(sev) }}>
                    {sev.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>{patient.id} · {patient.program}</div>
              </button>
            );
          })}
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, padding: 18, overflow: "auto" }}>
          {activeTab === "copilot" ? (
            <>
              {/* PATIENT OVERVIEW */}
              <Card title="Patient Overview" style={{ marginBottom: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{selectedPatient.name}</div>
                    <div style={{ color: COLORS.textMuted, marginTop: 4, fontSize: 13 }}>{selectedPatient.age}{selectedPatient.gender} · {selectedPatient.id} · {selectedPatient.program}</div>
                    <div style={{ marginTop: 8 }}>
                      {selectedPatient.conditions.map((c) => (
                        <span key={c} style={{ display: "inline-block", marginRight: 6, marginBottom: 6, background: "#E2E8F0", borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 600 }}>{c}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: 13 }}>
                    <div style={{ marginBottom: 6 }}><strong>Nurse:</strong> {assignedNurses[selectedPatient.id] || selectedPatient.nurse}</div>
                    <div style={{ marginBottom: 6 }}><strong>Last Visit:</strong> {selectedPatient.lastVisit}</div>
                  </div>
                </div>
              </Card>

              {/* VITALS INPUT */}
              <Card title="Vitals — Current Visit" style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <VitalInput label="BP Systolic" value={vitals.bp_sys} onChange={(v) => updateVital("bp_sys", v)} unit="mmHg" statusKey="bp_sys" />
                  <VitalInput label="BP Diastolic" value={vitals.bp_dia} onChange={(v) => updateVital("bp_dia", v)} unit="mmHg" statusKey="bp_dia" />
                  <VitalInput label="Pulse" value={vitals.pulse} onChange={(v) => updateVital("pulse", v)} unit="bpm" statusKey="pulse" />
                  <VitalInput label="SpO2" value={vitals.spo2} onChange={(v) => updateVital("spo2", v)} unit="%" statusKey="spo2" />
                  <VitalInput label="Temperature" value={vitals.temp} onChange={(v) => updateVital("temp", v)} unit="°F" statusKey="temp" />
                  <VitalInput label="Fasting Glucose" value={vitals.glucose_fasting} onChange={(v) => updateVital("glucose_fasting", v)} unit="mg/dL" statusKey="glucose_fasting" />
                  <VitalInput label="Weight" value={vitals.weight} onChange={(v) => updateVital("weight", v)} unit="kg" statusKey="weight" />
                </div>
              </Card>

              {/* NURSE NOTES */}
              <Card title="Nurse Notes — Current Visit" style={{ marginBottom: 14 }}>
                <textarea value={notes} onChange={(e) => updateNotes(e.target.value)} rows={4} placeholder="Enter observations, symptoms, complaints..." style={{ width: "100%", border: `1px solid ${COLORS.border}`, borderRadius: 10, resize: "vertical", padding: 12, fontFamily: "inherit", fontSize: 14, boxSizing: "border-box" }} />
              </Card>

              {/* ACTION BUTTONS */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                <button onClick={runAnalysis} disabled={isGenerating} style={{ padding: "10px 18px", borderRadius: 10, border: "none", cursor: "pointer", color: "white", fontWeight: 700, background: COLORS.primary }}>
                  {isGenerating ? "Processing..." : analysis ? "Re-Analyse Visit" : "Analyse Visit"}
                </button>
                <button onClick={generateCarePlan} disabled={isGenerating} style={{ padding: "10px 18px", borderRadius: 10, border: "none", cursor: "pointer", color: "white", fontWeight: 700, background: "#1D4ED8" }}>
                  {carePlan ? "Re-Generate Care Plan" : "Generate 7-Day Care Plan"}
                </button>
                <button onClick={generateHandoff} disabled={isGenerating} style={{ padding: "10px 18px", borderRadius: 10, border: "none", cursor: "pointer", color: "white", fontWeight: 700, background: "#7C3AED" }}>
                  {handoff ? "Re-Generate Handoff" : "Generate Shift Handoff"}
                </button>
                <button onClick={loadDemoData} style={{ padding: "10px 18px", borderRadius: 10, border: `2px solid ${COLORS.primary}`, cursor: "pointer", color: COLORS.primary, fontWeight: 700, background: "white" }}>
                  Load Demo Data
                </button>
              </div>

              {errorMessage && <div style={{ marginBottom: 14, border: "1px solid #FCA5A5", background: "#FEF2F2", borderRadius: 10, padding: 12, color: "#991B1B", fontWeight: 600 }}>{errorMessage}</div>}

              {/* ANALYSIS RENDER */}
              {analysis && (
                <Card title="Visit Intelligence Analysis" style={{ marginBottom: 14 }}>
                  <div style={{ background: "#F0FDF9", border: "1px solid #99F6E4", borderRadius: 8, padding: 12, marginBottom: 14, fontSize: 14, color: "#065F46" }}>{analysis.patient_summary}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 8 }}>Symptoms</div>
                      {(analysis.extracted_entities?.symptoms || []).map((item, i) => (
                        <div key={i} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 8, marginBottom: 8, background: "#F8FAFC", fontSize: 13 }}>
                          <strong>{item.symptom}</strong> · {item.duration} · <SeverityBadge severity={item.severity} />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 8 }}>Risk Flags</div>
                      {(analysis.risk_flags || []).map((flag, i) => (
                        <div key={i} style={{ border: `1px solid ${COLORS.border}`, borderLeft: `5px solid ${severityColor(flag.severity)}`, borderRadius: 8, padding: 10, marginBottom: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 6 }}><strong style={{ fontSize: 13 }}>{flag.title}</strong><SeverityBadge severity={flag.severity} /></div>
                          <div style={{ fontSize: 12, marginBottom: 6, color: COLORS.textMuted }}>{flag.explanation}</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: severityColor(flag.severity) }}>→ {flag.action}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 8 }}>Vitals Assessment</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {(analysis.vitals_assessment || []).map((item, i) => (
                        <div key={i} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 12px", background: "#F8FAFC", minWidth: 160 }}>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{item.vital}</div>
                          <div style={{ fontSize: 13 }}>{item.value}</div>
                          <div style={{ marginTop: 4 }}><SeverityBadge severity={item.status} /></div>
                          <div style={{ marginTop: 5, color: COLORS.textMuted, fontSize: 11 }}>{item.note}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 8 }}>Care Actions</div>
                    {(analysis.care_actions || []).map((item, i) => (
                      <div key={i} style={{ border: `1px solid ${COLORS.border}`, borderLeft: `4px solid ${item.priority === "immediate" ? COLORS.critical : item.priority === "today" ? COLORS.high : "#2563EB"}`, borderRadius: 8, padding: 10, marginBottom: 8 }}>
                        <div style={{ fontSize: 13 }}><strong>{item.action}</strong></div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* CARE PLAN RENDER */}
              {carePlan && (
                <Card 
                  title="Generated 7-Day Care Plan" 
                  titleRight={
                    <div style={{ display: "flex", gap: 8 }}>
                      <SharePill label="WhatsApp" icon="💬" onClick={shareCarePlanWhatsApp} bg="#25D366" />
                      <SharePill label="Telegram" icon="✈️" onClick={shareCarePlanTelegram} bg="#0088cc" />
                    </div>
                  }
                  style={{ marginBottom: 14 }}
                >
                  <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 12 }}>{carePlan.care_plan_title}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 8 }}>Goals</div>
                  {(carePlan.goals || []).map((goal, i) => (
                    <div key={i} style={{ border: `1px solid ${COLORS.border}`, borderLeft: `4px solid ${COLORS.primary}`, borderRadius: 8, padding: 10, marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{goal.goal}</div>
                      <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3 }}>Target: {goal.target} · {goal.timeline}</div>
                    </div>
                  ))}
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", margin: "14px 0 8px" }}>Daily Schedule</div>
                  {(carePlan.daily_schedule || []).map((block, i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.primary, marginBottom: 6 }}>{block.day}</div>
                      {(block.tasks || []).map((task, j) => (
                        <div key={j} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 8, marginBottom: 6, background: "#F8FAFC" }}>
                          <div style={{ fontSize: 13 }}><strong>{task.time}</strong> — {task.task}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </Card>
              )}

              {/* HANDOFF RENDER */}
              {handoff && (
                <Card title="Shift Handoff (SBAR)" style={{ marginBottom: 14 }}>
                  {["situation", "background", "assessment", "recommendation"].map((key) => (
                    <div key={key} style={{ marginBottom: 10 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, textTransform: "capitalize" }}>{key}:</span>
                      <span style={{ fontSize: 13, marginLeft: 6 }}>{handoff.sbar?.[key]}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", margin: "12px 0 6px" }}>Critical Alerts</div>
                  {(handoff.critical_alerts || []).map((a, i) => <div key={i} style={{ fontSize: 13, color: COLORS.critical, marginBottom: 4 }}>⚠️ {a}</div>)}
                  
                  {handoffConfirmation && handoffConfirmation.patientId === selectedPatientId && (
                    <div style={{ background: "#F0FDF4", border: "2px solid #86EFAC", borderRadius: 10, padding: 14, margin: "16px 0", display: "flex", gap: 12 }}>
                      <div style={{ fontSize: 28 }}>✅</div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15, color: "#065F46" }}>Shift Handoff Successful</div>
                        <div style={{ fontSize: 13, color: "#047857", marginTop: 4 }}>
                          Assigned to <strong>{handoffConfirmation.nurseName}</strong>. <br/>
                          Message automatically shared via WhatsApp (+{handoffConfirmation.phone}) and Telegram at {handoffConfirmation.time}.
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ background: "#F5F3FF", border: "2px solid #C4B5FD", borderRadius: 12, padding: 16, marginTop: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#5B21B6", marginBottom: 4 }}>Assign to Incoming Nurse</div>
                    <button onClick={() => setShowHandoffModal(true)} style={{ padding: "12px 22px", borderRadius: 10, border: "none", cursor: "pointer", background: "#7C3AED", color: "white", fontWeight: 700, fontSize: 14 }}>
                      Enter Caregiver Details & Assign Handoff
                    </button>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card title="CareIQ API Reference & Settings">
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Anthropic API Key</label>
                <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-ant-api03-..." style={{ width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 14 }} />
                <p style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 6 }}>Leave empty to use dynamic demo mode. Add a key to generate responses using real Claude API.</p>
              </div>
              
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 700 }}>
                  <input type="checkbox" checked={useProxy} onChange={(e) => setUseProxy(e.target.checked)} style={{ width: 18, height: 18 }} />
                  Use Netlify Proxy (/api/anthropic...)
                </label>
                <p style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 6 }}>
                  <strong>Check this ON if deployed to Netlify</strong> (with the <code>_redirects</code> file configured). <br/>
                  <strong>Keep this OFF if testing locally or in sandbox</strong> (hits <code>https://api.anthropic.com...</code> directly, but requires a CORS browser extension).
                </p>
              </div>

              <div style={{ lineHeight: 1.6, fontSize: 14, borderTop: `1px solid ${COLORS.border}`, paddingTop: 20 }}>
                <h4 style={{ marginBottom: 8 }}>Deploying to Netlify</h4>
                <p>Because the Anthropic API blocks direct browser requests (CORS), you must use a proxy when deploying this app.</p>
                <pre style={{ background: COLORS.codeBg, color: COLORS.codeText, borderRadius: 8, padding: 12, fontSize: 12 }}>
{`// 1. In your 'public' folder, create a file named '_redirects' (no extension)
// 2. Paste this exact line into the file:

/api/anthropic/* https://api.anthropic.com/:splat  200

// 3. Run 'npm run build' and upload the 'dist' folder to Netlify.`}
                </pre>
              </div>
            </Card>
          )}
        </main>

        {/* INSPECTOR */}
        {showInspector && (
          <section style={{ width: 360, borderLeft: `1px solid ${COLORS.border}`, background: COLORS.codeBg, color: COLORS.codeText, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #1E293B", display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>API Inspector</div>
              <button onClick={() => setInspectorLogs([])} style={{ background: "#111827", color: "#CFFAFE", border: "none", cursor: "pointer", fontSize: 11 }}>Clear</button>
            </div>
            <div style={{ overflow: "auto", padding: 12, flex: 1 }}>
              {inspectorLogs.map((log) => (
                <div key={log.id} style={{ border: "1px solid #1E293B", borderRadius: 8, marginBottom: 10 }}>
                  <div style={{ background: "#111827", padding: "8px 10px", fontSize: 11 }}>
                    <div style={{ fontWeight: 700, color: "#E2E8F0" }}>{log.actionName}</div>
                    <div>Status: <strong style={{ color: "#86EFAC" }}>{log.status}</strong> · {log.durationMs}ms</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
