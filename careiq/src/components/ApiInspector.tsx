"use client";

import { useState } from "react";

export interface ApiCall {
  id: string;
  timestamp: string;
  type: "analysis" | "care_plan" | "handoff";
  request: {
    system: string;
    user: string;
  };
  response?: {
    raw: string;
    usage: { input_tokens: number; output_tokens: number };
  };
  error?: string;
  latency_ms?: number;
  status: "pending" | "success" | "error";
}

interface ApiInspectorProps {
  calls: ApiCall[];
  isOpen: boolean;
  onToggle: () => void;
}

const TYPE_LABELS = {
  analysis: "Visit Analysis",
  care_plan: "Care Plan",
  handoff: "Shift Handoff",
};

const TYPE_COLORS = {
  analysis: "#0D9488",
  care_plan: "#7C3AED",
  handoff: "#1D4ED8",
};

export function ApiInspector({ calls, isOpen, onToggle }: ApiInspectorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"request" | "response">("request");

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        style={{
          position: "fixed",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "#0F172A",
          color: "#A5F3FC",
          border: "none",
          borderRadius: "8px 0 0 8px",
          padding: "12px 6px",
          cursor: "pointer",
          writingMode: "vertical-rl",
          fontSize: 11,
          fontWeight: 600,
          fontFamily: "DM Mono, monospace",
          letterSpacing: "0.05em",
          zIndex: 100,
        }}
      >
        API Inspector {calls.length > 0 ? `(${calls.length})` : ""}
      </button>
    );
  }

  return (
    <div
      style={{
        width: 380,
        flexShrink: 0,
        backgroundColor: "#0F172A",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "DM Mono, monospace",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p style={{ color: "#A5F3FC", fontSize: 12, fontWeight: 600, margin: 0 }}>API Inspector</p>
          <p style={{ color: "#475569", fontSize: 10, margin: "2px 0 0" }}>
            {calls.length} call{calls.length !== 1 ? "s" : ""} · Anthropic Messages API
          </p>
        </div>
        <button
          onClick={onToggle}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#64748B",
            borderRadius: 6,
            width: 28,
            height: 28,
            cursor: "pointer",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>
      </div>

      {/* Calls List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {calls.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center" }}>
            <p style={{ color: "#334155", fontSize: 12, margin: 0 }}>
              No API calls yet.
              <br />
              Run an analysis to see requests.
            </p>
          </div>
        ) : (
          calls.map((call) => {
            const isExpanded = expandedId === call.id;
            const typeColor = TYPE_COLORS[call.type];

            return (
              <div
                key={call.id}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <button
                  onClick={() => {
                    setExpandedId(isExpanded ? null : call.id);
                    setActiveTab("request");
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 16px",
                    background: isExpanded ? "rgba(255,255,255,0.04)" : "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor:
                        call.status === "success"
                          ? "#22C55E"
                          : call.status === "error"
                          ? "#EF4444"
                          : "#EAB308",
                      marginTop: 5,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: typeColor,
                          textTransform: "uppercase",
                        }}
                      >
                        {TYPE_LABELS[call.type]}
                      </span>
                      <span style={{ fontSize: 10, color: "#475569" }}>
                        {call.latency_ms ? `${call.latency_ms}ms` : "—"}
                      </span>
                    </div>
                    <p style={{ fontSize: 10, color: "#475569", margin: "2px 0 0" }}>
                      {call.timestamp}
                    </p>
                    {call.response?.usage && (
                      <p style={{ fontSize: 10, color: "#334155", margin: "2px 0 0" }}>
                        ↑ {call.response.usage.input_tokens} · ↓ {call.response.usage.output_tokens} tokens
                      </p>
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div style={{ padding: "0 16px 14px" }}>
                    <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                      {(["request", "response"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: 4,
                            border: "1px solid",
                            cursor: "pointer",
                            backgroundColor:
                              activeTab === tab ? typeColor : "transparent",
                            color: activeTab === tab ? "white" : "#475569",
                            borderColor: activeTab === tab ? typeColor : "#1E293B",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {activeTab === "request" && (
                      <div>
                        <p style={{ fontSize: 10, color: "#0D9488", margin: "0 0 4px", textTransform: "uppercase" }}>
                          System Prompt
                        </p>
                        <pre
                          style={{
                            fontSize: 10,
                            color: "#94A3B8",
                            backgroundColor: "#0A0F1A",
                            padding: 10,
                            borderRadius: 6,
                            overflow: "auto",
                            maxHeight: 150,
                            margin: "0 0 10px",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {call.request.system}
                        </pre>
                        <p style={{ fontSize: 10, color: "#0D9488", margin: "0 0 4px", textTransform: "uppercase" }}>
                          User Message
                        </p>
                        <pre
                          style={{
                            fontSize: 10,
                            color: "#94A3B8",
                            backgroundColor: "#0A0F1A",
                            padding: 10,
                            borderRadius: 6,
                            overflow: "auto",
                            maxHeight: 200,
                            margin: 0,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {call.request.user}
                        </pre>
                      </div>
                    )}

                    {activeTab === "response" && (
                      <div>
                        {call.error ? (
                          <pre
                            style={{
                              fontSize: 10,
                              color: "#EF4444",
                              backgroundColor: "#0A0F1A",
                              padding: 10,
                              borderRadius: 6,
                              margin: 0,
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            ERROR: {call.error}
                          </pre>
                        ) : (
                          <pre
                            style={{
                              fontSize: 10,
                              color: "#A5F3FC",
                              backgroundColor: "#0A0F1A",
                              padding: 10,
                              borderRadius: 6,
                              overflow: "auto",
                              maxHeight: 350,
                              margin: 0,
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {call.response
                              ? JSON.stringify(JSON.parse(call.response.raw), null, 2)
                              : "Pending..."}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "10px 16px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p style={{ fontSize: 10, color: "#1E293B", margin: 0, textAlign: "center" }}>
          POST https://api.anthropic.com/v1/messages · claude-sonnet-4-20250514
        </p>
      </div>
    </div>
  );
}
