"use client";

import { Patient } from "@/types/patient";

interface PatientSidebarProps {
  patients: Patient[];
  selectedId: string;
  onSelect: (patient: Patient) => void;
}

function RiskBadge({ risk }: { risk: number }) {
  const color =
    risk >= 70 ? "#DC2626" : risk >= 50 ? "#EA580C" : "#CA8A04";
  const label =
    risk >= 70 ? "Critical" : risk >= 50 ? "High" : "Medium";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        marginTop: 4,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: color,
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 11, color, fontWeight: 600 }}>
        {label} · {risk}
      </span>
    </div>
  );
}

export function PatientSidebar({ patients, selectedId, onSelect }: PatientSidebarProps) {
  return (
    <div
      style={{
        width: 240,
        flexShrink: 0,
        backgroundColor: "#1E293B",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 16px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#94A3B8",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          My Patients Today
        </p>
      </div>
      <div style={{ overflowY: "auto", flex: 1, padding: "8px 0" }}>
        {patients.map((patient) => {
          const isSelected = patient.id === selectedId;
          return (
            <button
              key={patient.id}
              onClick={() => onSelect(patient)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "12px 16px",
                border: "none",
                cursor: "pointer",
                backgroundColor: isSelected ? "rgba(13, 148, 136, 0.15)" : "transparent",
                borderLeft: isSelected ? "3px solid #0D9488" : "3px solid transparent",
                transition: "all 0.15s ease",
              }}
            >
              <p
                style={{
                  color: isSelected ? "#FFFFFF" : "#CBD5E1",
                  fontSize: 14,
                  fontWeight: isSelected ? 600 : 400,
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {patient.name}
              </p>
              <p
                style={{
                  color: "#64748B",
                  fontSize: 11,
                  margin: "2px 0 0",
                }}
              >
                {patient.age}{patient.gender} · {patient.program}
              </p>
              <RiskBadge risk={patient.risk} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
