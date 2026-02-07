"use client";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 240,
        background: "#0f172a",
        color: "#ffffff",
        padding: 16,
        minHeight: "100vh",
      }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 700 }}>AnkismaikT</h2>
      <p style={{ marginTop: 8, fontSize: 12, color: "#94a3b8" }}>
        DecisionOS
      </p>

      <nav style={{ marginTop: 24, fontSize: 14 }}>
        <div style={{ marginBottom: 12 }}>Strategy & Expansion</div>
        <div style={{ marginBottom: 12 }}>Capital & Investments</div>
        <div style={{ marginBottom: 12 }}>Hiring & Leadership</div>
        <div>Operations & Cost</div>
      </nav>
    </aside>
  );
}

