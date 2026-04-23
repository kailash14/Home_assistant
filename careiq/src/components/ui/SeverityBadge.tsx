"use client";

import { Severity } from "@/types/analysis";

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

const SEVERITY_CONFIG: Record<Severity, { label: string; bg: string; text: string; border: string }> = {
  critical: { label: "CRITICAL", bg: "#FEE2E2", text: "#DC2626", border: "#DC2626" },
  high: { label: "HIGH", bg: "#FFF7ED", text: "#EA580C", border: "#EA580C" },
  medium: { label: "MEDIUM", bg: "#FEFCE8", text: "#CA8A04", border: "#CA8A04" },
  low: { label: "LOW", bg: "#F0FDF4", text: "#16A34A", border: "#16A34A" },
};

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.low;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.05em",
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      {config.label}
    </span>
  );
}
