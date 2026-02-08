"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewDecisionPage() {
  const router = useRouter();
  const [decision, setDecision] = useState("");
  const [stakes, setStakes] = useState("");
  const [horizon, setHorizon] = useState("short");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/decision/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: "strategy",
          decision,
          stakes,
          horizon,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit decision");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "0 auto",
        background: "#fff",
        padding: 24,
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
        New Decision
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
      >
        <input
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          placeholder="Decision (e.g. Launch DecisionOS MVP)"
          required
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
        />

        <input
          value={stakes}
          onChange={(e) => setStakes(e.target.value)}
          placeholder="Stakes (e.g. Capital, reputation, time)"
          required
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
        />

        <select
          value={horizon}
          onChange={(e) => setHorizon(e.target.value)}
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
        >
          <option value="short">Short term</option>
          <option value="mid">Mid term</option>
          <option value="long">Long term</option>
        </select>

        {error && (
          <p style={{ color: "red", fontSize: 13 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 14px",
            background: "#0b1020",
            color: "#fff",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Analyze Decision"}
        </button>
      </form>
    </div>
  );
}

