"use client";

import { useState, useCallback } from "react";
import { PATIENTS } from "@/data/patients";
import { DEMO_ANALYSIS } from "@/data/demo-analysis";
import { DEMO_CARE_PLAN } from "@/data/demo-care-plan";
import { DEMO_HANDOFF } from "@/data/demo-handoff";
import { Patient } from "@/types/patient";
import { AnalysisResult } from "@/types/analysis";
import { CarePlan } from "@/types/care-plan";
import { Handoff } from "@/types/handoff";
import { PatientSidebar } from "@/components/PatientSidebar";
import { PatientHeader } from "@/components/PatientHeader";
import { VitalsGrid } from "@/components/VitalsGrid";
import { NurseNotesEditor } from "@/components/NurseNotesEditor";
import { AnalysisResults } from "@/components/AnalysisResults";
import { CarePlanView } from "@/components/CarePlanView";
import { HandoffView } from "@/components/HandoffView";
import { ApiInspector, ApiCall } from "@/components/ApiInspector";
import { LoadingOverlay } from "@/components/ui/LoadingSpinner";

type Tab = "copilot" | "api-reference";

export default function Home() {
  const [selectedPatient, setSelectedPatient] = useState<Patient>(PATIENTS[0]);
  const [notes, setNotes] = useState<string>(PATIENTS[0].notes);
  const [activeTab, setActiveTab] = useState<Tab>("copilot");
  const [inspectorOpen, setInspectorOpen] = useState(true);

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);
  const [handoff, setHandoff] = useState<Handoff | null>(null);

  const [analyzingLoading, setAnalyzingLoading] = useState(false);
  const [carePlanLoading, setCarePlanLoading] = useState(false);
  const [handoffLoading, setHandoffLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [apiCalls, setApiCalls] = useState<ApiCall[]>([]);

  const addApiCall = useCallback((call: ApiCall) => {
    setApiCalls((prev) => [call, ...prev]);
  }, []);

  const updateApiCall = useCallback((id: string, updates: Partial<ApiCall>) => {
    setApiCalls((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setNotes(patient.notes);
    setAnalysis(null);
    setCarePlan(null);
    setHandoff(null);
    setErrorMessage(null);
  };

  const handleAnalyze = async () => {
    setErrorMessage(null);
    setAnalysis(null);
    setCarePlan(null);
    setHandoff(null);
    setAnalyzingLoading(true);

    const callId = `call-${Date.now()}`;
    addApiCall({
      id: callId,
      timestamp: new Date().toLocaleTimeString(),
      type: "analysis",
      request: { system: "Loading...", user: "Loading..." },
      status: "pending",
    });

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient: selectedPatient, notes }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysis(data.result);
      updateApiCall(callId, {
        status: "success",
        latency_ms: data.meta?.latency_ms,
        request: data.meta?.request,
        response: {
          raw: data.meta?.raw_response || JSON.stringify(data.result),
          usage: data.meta?.usage || { input_tokens: 0, output_tokens: 0 },
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setErrorMessage(msg);
      updateApiCall(callId, { status: "error", error: msg });
    } finally {
      setAnalyzingLoading(false);
    }
  };

  const handleGenerateCarePlan = async () => {
    if (!analysis) return;
    setErrorMessage(null);
    setCarePlanLoading(true);

    const callId = `call-${Date.now()}`;
    addApiCall({
      id: callId,
      timestamp: new Date().toLocaleTimeString(),
      type: "care_plan",
      request: { system: "Loading...", user: "Loading..." },
      status: "pending",
    });

    try {
      const res = await fetch("/api/care-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Care plan generation failed");
      }

      setCarePlan(data.result);
      updateApiCall(callId, {
        status: "success",
        latency_ms: data.meta?.latency_ms,
        request: data.meta?.request,
        response: {
          raw: data.meta?.raw_response || JSON.stringify(data.result),
          usage: data.meta?.usage || { input_tokens: 0, output_tokens: 0 },
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setErrorMessage(msg);
      updateApiCall(callId, { status: "error", error: msg });
    } finally {
      setCarePlanLoading(false);
    }
  };

  const handleGenerateHandoff = async () => {
    if (!analysis) return;
    setErrorMessage(null);
    setHandoffLoading(true);

    const callId = `call-${Date.now()}`;
    addApiCall({
      id: callId,
      timestamp: new Date().toLocaleTimeString(),
      type: "handoff",
      request: { system: "Loading...", user: "Loading..." },
      status: "pending",
    });

    try {
      const res = await fetch("/api/handoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient: selectedPatient,
          notes,
          riskFlags: analysis.risk_flags,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Handoff generation failed");
      }

      setHandoff(data.result);
      updateApiCall(callId, {
        status: "success",
        latency_ms: data.meta?.latency_ms,
        request: data.meta?.request,
        response: {
          raw: data.meta?.raw_response || JSON.stringify(data.result),
          usage: data.meta?.usage || { input_tokens: 0, output_tokens: 0 },
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setErrorMessage(msg);
      updateApiCall(callId, { status: "error", error: msg });
    } finally {
      setHandoffLoading(false);
    }
  };

  const handleLoadDemoData = () => {
    setAnalysis(DEMO_ANALYSIS);
    setCarePlan(DEMO_CARE_PLAN);
    setHandoff(DEMO_HANDOFF);
    setErrorMessage(null);

    const now = new Date().toLocaleTimeString();
    const demoId1 = `demo-${Date.now()}-1`;
    const demoId2 = `demo-${Date.now()}-2`;
    const demoId3 = `demo-${Date.now()}-3`;

    setApiCalls([
      {
        id: demoId1,
        timestamp: now,
        type: "analysis",
        request: { system: "DEMO MODE — pre-loaded", user: "DEMO MODE — pre-loaded" },
        response: {
          raw: JSON.stringify(DEMO_ANALYSIS),
          usage: { input_tokens: 847, output_tokens: 1892 },
        },
        latency_ms: 3420,
        status: "success",
      },
      {
        id: demoId2,
        timestamp: now,
        type: "care_plan",
        request: { system: "DEMO MODE — pre-loaded", user: "DEMO MODE — pre-loaded" },
        response: {
          raw: JSON.stringify(DEMO_CARE_PLAN),
          usage: { input_tokens: 912, output_tokens: 1645 },
        },
        latency_ms: 4210,
        status: "success",
      },
      {
        id: demoId3,
        timestamp: now,
        type: "handoff",
        request: { system: "DEMO MODE — pre-loaded", user: "DEMO MODE — pre-loaded" },
        response: {
          raw: JSON.stringify(DEMO_HANDOFF),
          usage: { input_tokens: 634, output_tokens: 892 },
        },
        latency_ms: 2890,
        status: "success",
      },
    ]);
  };

  const isLoading = analyzingLoading || carePlanLoading || handoffLoading;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: "#1E293B",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "0 20px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: "#0D9488",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 700,
              color: "white",
            }}
          >
            C
          </div>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>CareIQ</span>
            <span style={{ fontSize: 12, color: "#64748B", marginLeft: 8 }}>AI Nurse Copilot</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 4 }}>
          {(["copilot", "api-reference"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                backgroundColor: activeTab === tab ? "#0D9488" : "transparent",
                color: activeTab === tab ? "white" : "#94A3B8",
                transition: "all 0.15s",
              }}
            >
              {tab === "copilot" ? "Copilot" : "API Reference"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={handleLoadDemoData}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #334155",
              backgroundColor: "transparent",
              color: "#94A3B8",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            Load Demo Data
          </button>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#22C55E",
            }}
          />
          <span style={{ fontSize: 11, color: "#64748B" }}>Priya Krishnan</span>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {activeTab === "copilot" ? (
          <>
            <PatientSidebar
              patients={PATIENTS}
              selectedId={selectedPatient.id}
              onSelect={handlePatientSelect}
            />

            {/* Main Workspace */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
                minWidth: 0,
              }}
            >
              <PatientHeader patient={selectedPatient} />
              <VitalsGrid vitals={selectedPatient.vitals} />
              <NurseNotesEditor
                notes={notes}
                onChange={setNotes}
                visitHistory={selectedPatient.history}
              />

              {/* Action Buttons */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 12,
                  padding: "16px 24px",
                  marginBottom: 16,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 8,
                    border: "none",
                    backgroundColor: isLoading ? "#94A3B8" : "#0D9488",
                    color: "white",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.15s",
                  }}
                >
                  {analyzingLoading ? "Analyzing..." : "🔍 Run AI Analysis"}
                </button>

                {analysis && (
                  <>
                    <button
                      onClick={handleGenerateCarePlan}
                      disabled={isLoading}
                      style={{
                        padding: "10px 20px",
                        borderRadius: 8,
                        border: "none",
                        backgroundColor: isLoading ? "#94A3B8" : "#7C3AED",
                        color: "white",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        fontSize: 14,
                        fontWeight: 600,
                        transition: "all 0.15s",
                      }}
                    >
                      {carePlanLoading ? "Generating..." : "📋 Generate Care Plan"}
                    </button>
                    <button
                      onClick={handleGenerateHandoff}
                      disabled={isLoading}
                      style={{
                        padding: "10px 20px",
                        borderRadius: 8,
                        border: "none",
                        backgroundColor: isLoading ? "#94A3B8" : "#1D4ED8",
                        color: "white",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        fontSize: 14,
                        fontWeight: 600,
                        transition: "all 0.15s",
                      }}
                    >
                      {handoffLoading ? "Generating..." : "🤝 Generate Handoff"}
                    </button>
                  </>
                )}

                {errorMessage && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 14px",
                      borderRadius: 6,
                      backgroundColor: "#FEF2F2",
                      border: "1px solid #FCA5A5",
                      flex: 1,
                    }}
                  >
                    <span style={{ fontSize: 14 }}>⚠</span>
                    <span style={{ fontSize: 13, color: "#991B1B" }}>{errorMessage}</span>
                    <button
                      onClick={() => setErrorMessage(null)}
                      style={{
                        marginLeft: "auto",
                        background: "none",
                        border: "none",
                        color: "#991B1B",
                        cursor: "pointer",
                        fontSize: 16,
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Loading States */}
              {analyzingLoading && (
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                    marginBottom: 16,
                  }}
                >
                  <LoadingOverlay label="Running clinical analysis with Claude Sonnet 4..." />
                </div>
              )}

              {/* Analysis Results */}
              {analysis && !analyzingLoading && (
                <div className="fade-in">
                  <AnalysisResults result={analysis} />
                </div>
              )}

              {carePlanLoading && (
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                    marginBottom: 16,
                    marginTop: 16,
                  }}
                >
                  <LoadingOverlay label="Generating personalized 7-day care plan..." />
                </div>
              )}

              {carePlan && !carePlanLoading && (
                <div className="fade-in" style={{ marginTop: 16 }}>
                  <CarePlanView plan={carePlan} />
                </div>
              )}

              {handoffLoading && (
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                    marginBottom: 16,
                    marginTop: 16,
                  }}
                >
                  <LoadingOverlay label="Generating SBAR shift handoff summary..." />
                </div>
              )}

              {handoff && !handoffLoading && (
                <div className="fade-in" style={{ marginTop: 16 }}>
                  <HandoffView handoff={handoff} />
                </div>
              )}

              <div style={{ height: 40 }} />
            </div>

            {/* API Inspector */}
            <ApiInspector
              calls={apiCalls}
              isOpen={inspectorOpen}
              onToggle={() => setInspectorOpen(!inspectorOpen)}
            />
          </>
        ) : (
          <ApiReferenceTab />
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ApiReferenceTab() {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px", backgroundColor: "#F1F5F9" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>
          CareIQ API Reference
        </h1>
        <p style={{ fontSize: 15, color: "#64748B", marginBottom: 32, lineHeight: 1.6 }}>
          All API calls use the Anthropic Messages API with Claude Sonnet 4. The system enforces
          strict JSON-only responses via system prompt schema definitions.
        </p>

        {[
          {
            title: "POST /api/analyze",
            method: "POST",
            color: "#0D9488",
            description: "Visit Intelligence Analysis — processes structured vitals and unstructured nurse notes into a structured clinical assessment.",
            request: `{
  "patient": { /* Patient object */ },
  "notes": "Free-text visit notes..."
}`,
            response: `{
  "result": {
    "patient_summary": "string",
    "extracted_entities": { ... },
    "risk_flags": [ { "title", "severity", "explanation", "action" } ],
    "vitals_assessment": [ { "vital", "value", "status", "note" } ],
    "care_actions": [ { "priority", "action", "owner" } ],
    "escalation": { "needed", "urgency", "reason", "escalate_to" }
  },
  "meta": { "model", "latency_ms", "usage", "raw_response" }
}`,
          },
          {
            title: "POST /api/care-plan",
            method: "POST",
            color: "#7C3AED",
            description: "Care Plan Generation — takes the analysis output and generates a structured 7-day care plan personalized to risks and social context.",
            request: `{
  "analysis": { /* AnalysisResult object from /api/analyze */ }
}`,
            response: `{
  "result": {
    "care_plan_title": "string",
    "goals": [ { "goal", "target", "timeline" } ],
    "daily_schedule": [ { "day", "tasks": [ { "time", "task", "owner", "notes" } ] } ],
    "medication_changes": [ { "medication", "change", "reason" } ],
    "monitoring_parameters": [ { "parameter", "frequency", "alert_threshold" } ],
    "patient_education": [ "string" ],
    "follow_up": { "next_visit", "teleconsult", "lab_tests" }
  }
}`,
          },
          {
            title: "POST /api/handoff",
            method: "POST",
            color: "#1D4ED8",
            description: "Shift Handoff (SBAR) — generates a clinical shift handoff summary in SBAR format for the incoming nurse.",
            request: `{
  "patient": { /* Patient object */ },
  "notes": "Current visit notes...",
  "riskFlags": [ /* RiskFlag array from analysis */ ]
}`,
            response: `{
  "result": {
    "sbar": {
      "situation": "string",
      "background": "string",
      "assessment": "string",
      "recommendation": "string"
    },
    "critical_alerts": [ "string" ],
    "pending_tasks": [ "string" ],
    "family_notes": "string"
  }
}`,
          },
        ].map((api, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              padding: "24px",
              marginBottom: 20,
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  backgroundColor: api.color,
                  color: "white",
                  padding: "3px 8px",
                  borderRadius: 4,
                  fontFamily: "DM Mono, monospace",
                }}
              >
                {api.method}
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0F172A",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                {api.title}
              </span>
            </div>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 16, lineHeight: 1.6 }}>
              {api.description}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "Request Body", code: api.request },
                { label: "Response", code: api.response },
              ].map((block, j) => (
                <div key={j}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                    {block.label}
                  </p>
                  <pre
                    style={{
                      backgroundColor: "#0F172A",
                      color: "#A5F3FC",
                      padding: 14,
                      borderRadius: 8,
                      fontSize: 11,
                      lineHeight: 1.6,
                      overflow: "auto",
                      fontFamily: "DM Mono, monospace",
                      margin: 0,
                    }}
                  >
                    {block.code}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Architecture Diagram */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            padding: "24px",
            marginBottom: 20,
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>
            System Architecture
          </h2>
          <pre
            style={{
              backgroundColor: "#0F172A",
              color: "#A5F3FC",
              padding: 20,
              borderRadius: 8,
              fontSize: 11,
              lineHeight: 1.8,
              overflow: "auto",
              fontFamily: "DM Mono, monospace",
              margin: 0,
            }}
          >
{`[Nurse submits visit data]
         |
         v
[Input Validation] — vitals range check, notes length check
         |
         v
[Patient Context Assembly] — demographics + conditions + meds + history
         |
         v
[LLM Call 1: Visit Analysis]  →  POST /api/analyze
         |                        model: claude-sonnet-4-20250514
         |                        output: risk_flags + entities + care_actions + escalation
         |
         +──→ [Escalation Engine] — if escalation.needed, alert physician
         |
         +──→ [Risk Flag Display] — severity-badged cards
         |
         +──→ [Care Actions] — prioritized by immediate/today/this_week
         |
         v
[Nurse reviews and triggers optional calls]
         |
         +──→ [LLM Call 2: Care Plan]   →  POST /api/care-plan
         |        input: analysis JSON        7-day schedule + goals + education
         |
         +──→ [LLM Call 3: Handoff]     →  POST /api/handoff
                  input: patient + notes + risk_flags
                  output: SBAR + critical_alerts + pending_tasks`}
          </pre>
        </div>

        {/* Cost Economics */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            padding: "24px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>
            Cost Economics
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              { label: "Avg input tokens / visit", value: "~847", sub: "vitals + notes + history" },
              { label: "Avg output tokens", value: "~1,892", sub: "full analysis JSON" },
              { label: "Cost per visit", value: "~$0.018", sub: "3 API calls combined" },
              { label: "Cost in INR", value: "~₹4.3", sub: "at 10,000 visits/month = ₹43K" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "14px 16px",
                  borderRadius: 8,
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 22, fontWeight: 700, color: "#0D9488", margin: "0 0 4px" }}>
                  {item.value}
                </p>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#1E293B", margin: "0 0 4px" }}>
                  {item.label}
                </p>
                <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
