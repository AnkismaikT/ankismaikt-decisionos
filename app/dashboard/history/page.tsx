import { prisma } from "@/lib/db/prisma";

export default async function HistoryPage() {
  const decisions = await prisma.decision.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <h2>Decision History</h2>
      <p style={{ color: "#666", marginBottom: 20 }}>
        Institutional record of high-impact decisions.
      </p>

      {decisions.length === 0 && (
        <p>No decisions recorded yet.</p>
      )}

      {decisions.length > 0 && (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ background: "#f5f6fa", textAlign: "left" }}>
                <th style={{ padding: 12 }}>Date</th>
                <th style={{ padding: 12 }}>Domain</th>
                <th style={{ padding: 12 }}>Decision</th>
                <th style={{ padding: 12 }}>Risk</th>
              </tr>
            </thead>
            <tbody>
              {decisions.map((d) => (
                <tr key={d.id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: 12 }}>
                    {d.createdAt.toDateString()}
                  </td>
                  <td style={{ padding: 12 }}>{d.domain}</td>
                  <td style={{ padding: 12 }}>{d.decision}</td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 12,
                        fontSize: 12,
                        background:
                          d.riskLevel === "Severe"
                            ? "#fff1f0"
                            : d.riskLevel === "High"
                            ? "#fff7e6"
                            : "#f6ffed",
                        color:
                          d.riskLevel === "Severe"
                            ? "#cf1322"
                            : d.riskLevel === "High"
                            ? "#d48806"
                            : "#389e0d",
                      }}
                    >
                      {d.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

