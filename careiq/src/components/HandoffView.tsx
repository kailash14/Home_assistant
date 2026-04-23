"use client";

import { Handoff } from "@/types/handoff";

interface HandoffViewProps {
  handoff: Handoff;
}

const SBAR_CONFIG = [
  { key: "situation" as const, label: "S — Situation", color: "#DC2626", bg: "#FEF2F2", border: "#FCA5A5" },
  { key: "background" as const, label: "B — Background", color: "#CA8A04", bg: "#FEFCE8", border: "#FDE047" },
  { key: "assessment" as const, label: "A — Assessment", color: "#7C3AED", bg: "#FDF4FF", border: "#D8B4FE" },
  { key: "recommendation" as const, label: "R — Recommendation", color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4" },
];

export function HandoffView({ handoff }: HandoffViewProps) {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        border: "1px solid #E2E8F0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: "#EFF6FF",
            border: "1px solid #BFDBFE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          🤝
        </div>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>
            Shift Handoff Summary
          </h3>
          <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>SBAR Format · For Incoming Nurse</p>
        </div>
      </div>

      {/* SBAR Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {SBAR_CONFIG.map((section) => (
          <div
            key={section.key}
            style={{
              padding: "14px 16px",
              borderRadius: 10,
              backgroundColor: section.bg,
              border: `1px solid ${section.border}`,
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: section.color,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                margin: "0 0 6px",
              }}
            >
              {section.label}
            </p>
            <p style={{ fontSize: 13, color: "#1E293B", margin: 0, lineHeight: 1.6 }}>
              {handoff.sbar[section.key]}
            </p>
          </div>
        ))}
      </div>

      {/* Critical Alerts */}
      {handoff.critical_alerts.length > 0 && (
        <section style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 12, fontWeight: 600, color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>
            ⚠ Critical Alerts
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {handoff.critical_alerts.map((alert, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  backgroundColor: "#FEF2F2",
                  border: "1px solid #FCA5A5",
                  fontSize: 13,
                  color: "#991B1B",
                }}
              >
                {alert}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pending Tasks */}
      {handoff.pending_tasks.length > 0 && (
        <section style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>
            Pending Tasks
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {handoff.pending_tasks.map((task, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  padding: "6px 0",
                  borderBottom: i < handoff.pending_tasks.length - 1 ? "1px solid #F1F5F9" : "none",
                }}
              >
                <span style={{ fontSize: 12, color: "#0D9488", flexShrink: 0, marginTop: 1 }}>○</span>
                <p style={{ fontSize: 13, color: "#334155", margin: 0, lineHeight: 1.5 }}>{task}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Family Notes */}
      {handoff.family_notes && (
        <section>
          <h4 style={{ fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>
            Family Communication Notes
          </h4>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              backgroundColor: "#FFF7ED",
              border: "1px solid #FED7AA",
            }}
          >
            <p style={{ fontSize: 13, color: "#7C2D12", margin: 0, lineHeight: 1.6 }}>
              {handoff.family_notes}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
