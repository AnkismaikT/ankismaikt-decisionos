"use client";

import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  function exportBoardReport() {
    fetch("/api/decision/report", { method: "POST" })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "DecisionOS-Board-Report.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        alert("Failed to generate board report");
      });
  }

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
        <p
          style={{
            fontSize: 12,
            opacity: 0.7,
            marginBottom: 30,
          }}
        >
          DecisionOS™
        </p>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
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
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* TOP BAR */}
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
          {/* TITLE */}
          <div>
            <h1
              style={{
                fontSize: 20,
                margin: 0,
                fontWeight: 600,
              }}
            >
              AnkismaikT DecisionOS
            </h1>
            <p
              style={{
                fontSize: 12,
                color: "#666",
                marginTop: 4,
              }}
            >
              Decision intelligence that prevents costly strategic mistakes
            </p>
          </div>

          {/* ACTIONS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* BOARD EXPORT */}
            <button
              onClick={exportBoardReport}
              style={{
                padding: "8px 14px",
                background: "#ffffff",
                color: "#0b1020",
                borderRadius: 8,
                border: "1px solid #d9dce3",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Export Board Report
            </button>

            {/* STATUS */}
            <span
              style={{
                padding: "6px 12px",
                background: "#e8f7ef",
                color: "#0a7a3d",
                borderRadius: 20,
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              ● Live Analysis
            </span>

            {/* ✅ FIXED: NEW DECISION */}
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
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main
          style={{
            padding: 32,
            flex: 1,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

