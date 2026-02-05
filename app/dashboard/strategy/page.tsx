import { saveDecision } from "./actions";

export default function StrategyPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Strategy & Expansion</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Executive intelligence for high-impact strategic decisions
      </p>

      {/* METRICS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <MetricCard title="Risk Level" value="High" color="#ff4d4f" />
        <MetricCard title="Capital Exposure" value="₹120Cr" color="#faad14" />
        <MetricCard title="Bias Signals" value="3 Detected" color="#722ed1" />
        <MetricCard title="Regret Potential" value="Severe" color="#cf1322" />
      </div>

      {/* INTELLIGENCE */}
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          marginBottom: 32,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        <h3>Decision Intelligence Engine</h3>
        <p style={{ color: "#666" }}>
          Analyze strategic risk, bias, and regret before execution.
        </p>
        <button style={{ marginTop: 12 }}>Run Decision Analysis</button>
      </div>

      {/* SAVE FORM */}
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 12,
          maxWidth: 720,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        <h3>Record This Decision</h3>

        <form action={saveDecision} style={{ display: "grid", gap: 14 }}>
          <select name="domain" required>
            <option value="">Select Domain</option>
            <option value="Strategy">Strategy</option>
            <option value="Investment">Investment</option>
            <option value="Hiring">Hiring</option>
            <option value="Operations">Operations</option>
          </select>

          <textarea
            name="decision"
            rows={4}
            placeholder="Describe the decision clearly"
            required
          />

          <select name="stakes">
            <option value="">Select Stakes</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <select name="horizon">
            <option value="">Select Horizon</option>
            <option value="Short">Short</option>
            <option value="Medium">Medium</option>
            <option value="Long">Long</option>
          </select>

          <select name="riskLevel">
            <option value="">Select Risk Level</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Severe">Severe</option>
          </select>

          <button type="submit">Save Decision</button>
        </form>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div style={{ background: color, padding: 16, borderRadius: 12 }}>
      <div style={{ fontSize: 12 }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

