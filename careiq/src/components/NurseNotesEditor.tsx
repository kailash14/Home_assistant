"use client";

interface NurseNotesEditorProps {
  notes: string;
  onChange: (notes: string) => void;
  visitHistory: Array<{ date: string; type: string; note: string }>;
}

export function NurseNotesEditor({ notes, onChange, visitHistory }: NurseNotesEditorProps) {
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
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: 20,
        }}
      >
        <div>
          <h3
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#64748B",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 12px",
            }}
          >
            Nurse Visit Notes
          </h3>
          <textarea
            value={notes}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter visit notes here..."
            style={{
              width: "100%",
              height: 160,
              padding: "12px 14px",
              borderRadius: 8,
              border: "1.5px solid #CBD5E1",
              fontSize: 14,
              lineHeight: 1.6,
              color: "#0F172A",
              fontFamily: "DM Sans, sans-serif",
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
              backgroundColor: "#F8FAFC",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#0D9488")}
            onBlur={(e) => (e.target.style.borderColor = "#CBD5E1")}
          />
          <p style={{ fontSize: 11, color: "#94A3B8", margin: "6px 0 0" }}>
            {notes.length} characters · Edit notes before running AI analysis
          </p>
        </div>
        <div>
          <h3
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#64748B",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 12px",
            }}
          >
            Visit History
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {visitHistory.map((v, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#0D9488",
                      backgroundColor: "#F0FDFA",
                      padding: "1px 6px",
                      borderRadius: 3,
                      border: "1px solid #99F6E4",
                    }}
                  >
                    {v.type}
                  </span>
                  <span style={{ fontSize: 10, color: "#94A3B8" }}>{v.date}</span>
                </div>
                <p style={{ fontSize: 12, color: "#475569", margin: 0, lineHeight: 1.4 }}>
                  {v.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
