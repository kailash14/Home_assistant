"use client";

import { AnalysisResult } from "@/types/analysis";
import { SeverityBadge } from "@/components/ui/SeverityBadge";

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const PRIORITY_COLORS = {
  immediate: { bg: "#FEF2F2", border: "#FCA5A5", text: "#991B1B", label: "IMMEDIATE" },
  today: { bg: "#FFF7ED", border: "#FED7AA", text: "#9A3412", label: "TODAY" },
  this_week: { bg: "#F0FDF4", border: "#86EFAC", text: "#166534", label: "THIS WEEK" },
};

const OWNER_COLORS: Record<string, { bg: string; text: string }> = {
  nurse: { bg: "#EFF6FF", text: "#1D4ED8" },
  doctor: { bg: "#FDF4FF", text: "#7E22CE" },
  coordinator: { bg: "#ECFDF5", text: "#065F46" },
  family: { bg: "#FFF7ED", text: "#9A3412" },
};

const URGENCY_LABELS: Record<string, string> = {
  immediate: "Immediate",
  within_4hrs: "Within 4 Hours",
  within_24hrs: "Within 24 Hours",
  routine: "Routine",
};

export function AnalysisResults({ result }: AnalysisResultsProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Patient Summary */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          padding: "20px 24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          border: "1px solid #E2E8F0",
        }}
      >
        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>
          Clinical Summary
        </h3>
        <p style={{ fontSize: 14, color: "#1E293B", lineHeight: 1.6, margin: 0 }}>
          {result.patient_summary}
        </p>
      </div>

      {/* Escalation Alert */}
      {result.escalation.needed && (
        <div
          style={{
            backgroundColor: "#FEF2F2",
            borderRadius: 12,
            padding: "16px 20px",
            border: "2px solid #DC2626",
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: "#DC2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 18,
            }}
          >
            🚨
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#991B1B" }}>
                ESCALATION REQUIRED
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  backgroundColor: "#DC2626",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                {URGENCY_LABELS[result.escalation.urgency]}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#7F1D1D", margin: 0 }}>
              {result.escalation.reason}
            </p>
            <p style={{ fontSize: 12, color: "#B91C1C", margin: "4px 0 0", fontWeight: 500 }}>
              Escalate to: {result.escalation.escalate_to}
            </p>
          </div>
        </div>
      )}

      {/* Risk Flags */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          padding: "20px 24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          border: "1px solid #E2E8F0",
        }}
      >
        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 14px" }}>
          Risk Flags ({result.risk_flags.length})
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {result.risk_flags.map((flag, i) => (
            <div
              key={i}
              style={{
                padding: "14px 16px",
                borderRadius: 10,
                border: "1px solid #E2E8F0",
                backgroundColor: "#FAFAFA",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <SeverityBadge severity={flag.severity} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{flag.title}</span>
              </div>
              <p style={{ fontSize: 13, color: "#475569", margin: "0 0 8px", lineHeight: 1.5 }}>
                {flag.explanation}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  backgroundColor: "#F0FDFA",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #99F6E4",
                }}
              >
                <span style={{ fontSize: 12, color: "#065F46", fontWeight: 500 }}>→ Action:</span>
                <span style={{ fontSize: 12, color: "#0F766E" }}>{flag.action}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extracted Entities */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          padding: "20px 24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          border: "1px solid #E2E8F0",
        }}
      >
        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 14px" }}>
          Extracted Clinical Entities
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Symptoms */}
          {result.extracted_entities.symptoms.length > 0 && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#64748B", margin: "0 0 8px" }}>Symptoms</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {result.extracted_entities.symptoms.map((s, i) => (
                  <div key={i} style={{ fontSize: 13, color: "#334155", display: "flex", gap: 6, alignItems: "flex-start" }}>
                    <span style={{ color: "#94A3B8", flexShrink: 0, marginTop: 1 }}>•</span>
                    <span>{s.symptom} <span style={{ color: "#94A3B8", fontSize: 11 }}>({s.duration} · {s.severity})</span></span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Medications Stopped */}
          {result.extracted_entities.medications_stopped.length > 0 && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#DC2626", margin: "0 0 8px" }}>⚠ Medications Stopped</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {result.extracted_entities.medications_stopped.map((m, i) => (
                  <div key={i} style={{ fontSize: 13, color: "#334155", display: "flex", gap: 6, alignItems: "flex-start" }}>
                    <span style={{ color: "#DC2626", flexShrink: 0, marginTop: 1 }}>•</span>
                    <span>
                      <strong>{m.name}</strong>
                      <span style={{ color: "#64748B", fontSize: 11 }}> — {m.reason} ({m.days_ago}d ago)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Current Medications */}
          {result.extracted_entities.medications_current.length > 0 && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#64748B", margin: "0 0 8px" }}>Current Medications</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {result.extracted_entities.medications_current.map((m, i) => (
                  <div key={i} style={{ fontSize: 13, color: "#334155" }}>
                    <span style={{ color: "#94A3B8" }}>• </span>
                    {m.name} {m.dose} {m.frequency}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Social Determinants */}
          {result.extracted_entities.social_determinants.length > 0 && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#64748B", margin: "0 0 8px" }}>Social Determinants</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {result.extracted_entities.social_determinants.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 11,
                      padding: "3px 8px",
                      borderRadius: 4,
                      backgroundColor: "#F1F5F9",
                      color: "#475569",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vitals Assessment */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          padding: "20px 24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          border: "1px solid #E2E8F0",
        }}
      >
        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 14px" }}>
          AI Vitals Assessment
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {result.vitals_assessment.map((v, i) => {
            const statusColors = {
              normal: "#16A34A",
              elevated: "#CA8A04",
              low: "#1D4ED8",
              critical: "#DC2626",
            };
            const color = statusColors[v.status] || "#64748B";
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 8,
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div style={{ width: 80, flexShrink: 0 }}>
                  <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>{v.vital}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: "2px 0 0" }}>{v.value}</p>
                </div>
                <div
                  style={{
                    width: 2,
                    alignSelf: "stretch",
                    backgroundColor: color,
                    borderRadius: 1,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color,
                      textTransform: "uppercase",
                    }}
                  >
                    {v.status}
                  </span>
                  <p style={{ fontSize: 13, color: "#475569", margin: "2px 0 0" }}>{v.note}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Care Actions */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          padding: "20px 24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          border: "1px solid #E2E8F0",
        }}
      >
        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 14px" }}>
          Care Actions ({result.care_actions.length})
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {result.care_actions.map((action, i) => {
            const priority = PRIORITY_COLORS[action.priority] || PRIORITY_COLORS.today;
            const ownerColors = OWNER_COLORS[action.owner] || { bg: "#F1F5F9", text: "#475569" };
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 8,
                  backgroundColor: priority.bg,
                  border: `1px solid ${priority.border}`,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: priority.text,
                    backgroundColor: "rgba(255,255,255,0.6)",
                    padding: "2px 6px",
                    borderRadius: 3,
                    flexShrink: 0,
                    marginTop: 1,
                    letterSpacing: "0.04em",
                  }}
                >
                  {priority.label}
                </span>
                <p style={{ fontSize: 13, color: "#1E293B", margin: 0, flex: 1, lineHeight: 1.5 }}>
                  {action.action}
                </p>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: ownerColors.text,
                    backgroundColor: ownerColors.bg,
                    padding: "2px 8px",
                    borderRadius: 4,
                    flexShrink: 0,
                    textTransform: "capitalize",
                  }}
                >
                  {action.owner}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
