export default function DecisionHistory() {
  const history = [
    {
      title: "Middle East Expansion",
      date: "Jan 2026",
      risk: "High",
      status: "Deferred",
    },
    {
      title: "CTO Hiring Decision",
      date: "Dec 2025",
      risk: "Medium",
      status: "Approved",
    },
    {
      title: "Cost Optimization Program",
      date: "Nov 2025",
      risk: "Low",
      status: "Executed",
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        marginTop: 30,
      }}
    >
      <h3>Decision History & Audit Trail</h3>
      <p style={{ color: "#666", marginBottom: 20 }}>
        Institutional memory of major decisions and their outcomes.
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", color: "#888" }}>
            <th>Decision</th>
            <th>Date</th>
            <th>Risk</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((d, i) => (
            <tr key={i} style={{ borderTop: "1px solid #eee" }}>
              <td>{d.title}</td>
              <td>{d.date}</td>
              <td>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 12,
                    background:
                      d.risk === "High"
                        ? "#fff1f0"
                        : d.risk === "Medium"
                        ? "#fffbe6"
                        : "#f6ffed",
                    color:
                      d.risk === "High"
                        ? "#cf1322"
                        : d.risk === "Medium"
                        ? "#d48806"
                        : "#389e0d",
                    fontSize: 12,
                  }}
                >
                  {d.risk}
                </span>
              </td>
              <td>{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

