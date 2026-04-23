"use client";

import { Patient } from "@/types/patient";

interface PatientHeaderProps {
  patient: Patient;
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  const riskColor =
    patient.risk >= 70 ? "#DC2626" : patient.risk >= 50 ? "#EA580C" : "#CA8A04";
  const riskLabel =
    patient.risk >= 70 ? "Critical" : patient.risk >= 50 ? "High" : "Medium";

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: "20px 24px",
        marginBottom: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        border: "1px solid #E2E8F0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", margin: 0 }}>
              {patient.name}
            </h2>
            <span style={{ fontSize: 13, color: "#64748B" }}>
              {patient.age}{patient.gender} · {patient.id}
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {patient.conditions.map((c) => (
              <span
                key={c}
                style={{
                  display: "inline-block",
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 500,
                  backgroundColor: "#EFF6FF",
                  color: "#1D4ED8",
                  border: "1px solid #BFDBFE",
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  backgroundColor: `${riskColor}15`,
                  border: `2px solid ${riskColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 800, color: riskColor, lineHeight: 1 }}>
                  {patient.risk}
                </span>
              </div>
              <div>
                <p style={{ fontSize: 11, color: "#64748B", margin: 0 }}>Risk Score</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: riskColor, margin: 0 }}>
                  {riskLabel}
                </p>
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 11, color: "#64748B", margin: 0 }}>Program</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", margin: "2px 0 0" }}>
              {patient.program}
            </p>
            <p style={{ fontSize: 11, color: "#94A3B8", margin: "2px 0 0" }}>
              Visit #{patient.visits + 1} · Nurse: {patient.nurse}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
