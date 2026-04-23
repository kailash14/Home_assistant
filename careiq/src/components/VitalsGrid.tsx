"use client";

import { Vitals } from "@/types/patient";

interface VitalsGridProps {
  vitals: Vitals;
}

interface VitalCardDef {
  key: keyof Vitals;
  label: string;
  unit: string;
  format: (v: number) => string;
  getStatus: (v: number) => "normal" | "elevated" | "low" | "critical";
}

const VITAL_CARDS: VitalCardDef[] = [
  {
    key: "bp_sys",
    label: "Blood Pressure",
    unit: "mmHg",
    format: () => "",
    getStatus: (v) => (v >= 180 ? "critical" : v >= 140 ? "elevated" : v < 90 ? "low" : "normal"),
  },
  {
    key: "pulse",
    label: "Pulse Rate",
    unit: "bpm",
    format: (v) => String(v),
    getStatus: (v) => (v > 120 || v < 50 ? "critical" : v > 100 || v < 60 ? "elevated" : "normal"),
  },
  {
    key: "spo2",
    label: "SpO2",
    unit: "%",
    format: (v) => String(v),
    getStatus: (v) => (v < 88 ? "critical" : v < 92 ? "elevated" : "normal"),
  },
  {
    key: "temp",
    label: "Temperature",
    unit: "°F",
    format: (v) => v.toFixed(1),
    getStatus: (v) => (v >= 103 ? "critical" : v >= 100.4 ? "elevated" : v < 96 ? "low" : "normal"),
  },
  {
    key: "glucose_fasting",
    label: "Fasting Glucose",
    unit: "mg/dL",
    format: (v) => String(v),
    getStatus: (v) => (v > 300 ? "critical" : v > 130 ? "elevated" : v < 70 ? "low" : "normal"),
  },
  {
    key: "weight",
    label: "Weight",
    unit: "kg",
    format: (v) => v.toFixed(1),
    getStatus: () => "normal",
  },
];

const STATUS_COLORS = {
  normal: { bg: "#F0FDF4", border: "#86EFAC", text: "#166534", label: "Normal" },
  elevated: { bg: "#FEFCE8", border: "#FDE047", text: "#854D0E", label: "Elevated" },
  low: { bg: "#EFF6FF", border: "#93C5FD", text: "#1E40AF", label: "Low" },
  critical: { bg: "#FEF2F2", border: "#FCA5A5", text: "#991B1B", label: "Critical" },
};

export function VitalsGrid({ vitals }: VitalsGridProps) {
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
      <h3
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#64748B",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          margin: "0 0 16px",
        }}
      >
        Current Visit Vitals
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
        }}
      >
        {VITAL_CARDS.map((card) => {
          const rawValue = vitals[card.key];
          const status =
            card.key === "bp_sys"
              ? card.getStatus(vitals.bp_sys)
              : card.getStatus(rawValue);

          const colors = STATUS_COLORS[status];
          const displayValue =
            card.key === "bp_sys"
              ? `${vitals.bp_sys}/${vitals.bp_dia}`
              : card.format(rawValue);

          return (
            <div
              key={card.key}
              style={{
                backgroundColor: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 10,
                padding: "14px 16px",
              }}
            >
              <p style={{ fontSize: 11, color: "#64748B", margin: 0, fontWeight: 500 }}>
                {card.label}
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: colors.text,
                    lineHeight: 1,
                  }}
                >
                  {displayValue}
                </span>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>{card.unit}</span>
              </div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: colors.text,
                  margin: "4px 0 0",
                  opacity: 0.85,
                }}
              >
                {colors.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
