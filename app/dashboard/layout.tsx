"use client";

import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f4f6fb",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: 260,
          background: "#0b1020",
          color: "#fff",
          padding: 24,
        }}
      >
        <h2 style={{ marginBottom: 4 }}>AnkismaikT</h2>
        <p style={{ fontSize: 12, opacity: 0.7, marginBottom: 30 }}>
          DecisionOS™
        </p>

        <nav style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Link href="/dashboard/strategy" style={{ color: "#fff" }}>
            Strategy & Expansion
          </Link>
          <Link href="/dashboard/capital" style={{ color: "#fff" }}>
            Capital & Investments
          </Link>
          <Link href="/dashboard/hiring" style={{ color: "#fff" }}>
            Hiring & Leadership
          </Link>
          <Link href="/dashboard/operations" style={{ color: "#fff" }}>
            Operations & Cost
          </Link>
          <Link href="/dashboard/history" style={{ color: "#fff" }}>
            Decision History
          </Link>
          <Link href="/dashboard/reports" style={{ color: "#fff" }}>
            Reports
          </Link>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            background: "#ffffff",
            padding: "16px 32px",
            borderBottom: "1px solid #e6e8ef",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1 style={{ fontSize: 20, margin: 0, fontWeight: 600 }}>
              AnkismaikT DecisionOS
            </h1>
            <p style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
              Decision intelligence that prevents costly strategic mistakes
            </p>
          </div>

          <Link href="/dashboard/new">
            <button
              style={{
                padding: "8px 14px",
                background: "#0b1020",
                color: "#fff",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              New Decision
            </button>
          </Link>
        </header>

        <main style={{ padding: 32, flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}

