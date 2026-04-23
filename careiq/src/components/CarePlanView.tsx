"use client";

import { CarePlan } from "@/types/care-plan";

interface CarePlanViewProps {
  plan: CarePlan;
}

const OWNER_COLORS: Record<string, { bg: string; text: string }> = {
  nurse: { bg: "#EFF6FF", text: "#1D4ED8" },
  doctor: { bg: "#FDF4FF", text: "#7E22CE" },
  patient: { bg: "#ECFDF5", text: "#065F46" },
  family: { bg: "#FFF7ED", text: "#9A3412" },
};

export function CarePlanView({ plan }: CarePlanViewProps) {
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
            backgroundColor: "#F0FDFA",
            border: "1px solid #99F6E4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          📋
        </div>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>
            {plan.care_plan_title}
          </h3>
          <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>AI-Generated 7-Day Care Plan</p>
        </div>
      </div>

      {/* Goals */}
      <section style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>
          Treatment Goals
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {plan.goals.map((goal, i) => (
            <div
              key={i}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", margin: "0 0 4px" }}>{goal.goal}</p>
              <p style={{ fontSize: 12, color: "#0D9488", margin: "0 0 2px", fontWeight: 500 }}>Target: {goal.target}</p>
              <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>Timeline: {goal.timeline}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Schedule */}
      <section style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>
          Daily Schedule
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {plan.daily_schedule.map((day, i) => (
            <div key={i}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#0D9488",
                  margin: "0 0 6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {day.day}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {day.tasks.map((task, j) => {
                  const ownerColors = OWNER_COLORS[task.owner] || { bg: "#F1F5F9", text: "#475569" };
                  return (
                    <div
                      key={j}
                      style={{
                        display: "flex",
                        gap: 10,
                        padding: "8px 12px",
                        borderRadius: 6,
                        backgroundColor: "#FAFAFA",
                        border: "1px solid #F1F5F9",
                        alignItems: "flex-start",
                      }}
                    >
                      <span style={{ fontSize: 11, color: "#94A3B8", minWidth: 60, flexShrink: 0, paddingTop: 1 }}>
                        {task.time}
                      </span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, color: "#1E293B", margin: "0 0 2px", fontWeight: 500 }}>{task.task}</p>
                        {task.notes && (
                          <p style={{ fontSize: 11, color: "#64748B", margin: 0, lineHeight: 1.4 }}>{task.notes}</p>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: ownerColors.text,
                          backgroundColor: ownerColors.bg,
                          padding: "2px 7px",
                          borderRadius: 4,
                          flexShrink: 0,
                          textTransform: "capitalize",
                        }}
                      >
                        {task.owner}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Monitoring Parameters */}
      <section style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>
          Monitoring Parameters
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {plan.monitoring_parameters.map((param, i) => (
            <div
              key={i}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                backgroundColor: "#FAFAFA",
                border: "1px solid #E2E8F0",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
              }}
            >
              <div>
                <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>Parameter</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", margin: "2px 0 0" }}>{param.parameter}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>Frequency</p>
                <p style={{ fontSize: 12, color: "#475569", margin: "2px 0 0" }}>{param.frequency}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>Alert Threshold</p>
                <p style={{ fontSize: 12, color: "#DC2626", margin: "2px 0 0", fontWeight: 500 }}>{param.alert_threshold}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Patient Education */}
      <section style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>
          Patient Education Points
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {plan.patient_education.map((point, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 6,
                backgroundColor: "#F0FDFA",
                border: "1px solid #99F6E4",
              }}
            >
              <span style={{ fontSize: 14, flexShrink: 0 }}>✓</span>
              <p style={{ fontSize: 13, color: "#134E4A", margin: 0, lineHeight: 1.5 }}>{point}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Follow Up */}
      <section>
        <h4 style={{ fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>
          Follow-Up Plan
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { label: "Next Visit", value: plan.follow_up.next_visit, color: "#0D9488" },
            { label: "Teleconsult", value: plan.follow_up.teleconsult, color: "#7C3AED" },
            { label: "Lab Tests", value: plan.follow_up.lab_tests, color: "#DC2626" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
              }}
            >
              <p style={{ fontSize: 11, color: "#94A3B8", margin: "0 0 4px" }}>{item.label}</p>
              <p style={{ fontSize: 12, color: item.color, fontWeight: 600, margin: 0, lineHeight: 1.4 }}>{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
