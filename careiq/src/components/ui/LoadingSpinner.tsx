"use client";

export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `3px solid rgba(13, 148, 136, 0.2)`,
        borderTopColor: "#0D9488",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        display: "inline-block",
      }}
    />
  );
}

export function LoadingOverlay({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: "40px 20px",
      }}
    >
      <LoadingSpinner size={36} />
      <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>{label}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
