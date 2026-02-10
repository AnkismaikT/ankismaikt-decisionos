import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth/fakeUser";

export default async function HistoryPage() {
  const userId = getCurrentUserId();

  const decisions = await prisma.decision.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const getRiskLevel = (riskScore: number) => {
    if (riskScore >= 70) return "High";
    if (riskScore >= 40) return "Medium";
    return "Low";
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 70) return "#DC2626"; // red
    if (riskScore >= 40) return "#F59E0B"; // amber
    return "#16A34A"; // green
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600 }}>
        Decision History
      </h2>

      {decisions.length === 0 && (
        <p style={{ marginTop: 12 }}>
          No decisions recorded yet.
        </p>
      )}

      {decisions.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 16,
          }}
        >
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th>Date</th>
              <th>Domain</th>
              <th>Decision</th>
              <th>Risk</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {decisions.map((d) => {
              const riskLevel = getRiskLevel(d.riskScore);
              const riskColor = getRiskColor(d.riskScore);

              return (
                <tr key={d.id}>
                  <td>
                    {new Date(d.createdAt).toLocaleDateString()}
                  </td>
                  <td>{d.domain}</td>
                  <td>{d.decision}</td>
                  <td style={{ fontWeight: 600 }}>
                    {riskLevel}
                  </td>

                  <td style={{ display: "flex", gap: 8 }}>
                    <a
                      href={`/dashboard/history/${d.id}`}
                      style={{
                        padding: "6px 12px",
                        background: riskColor,
                        color: "white",
                        borderRadius: 6,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Risk
                    </a>

                    <a
                      href={`/dashboard/history/${d.id}`}
                      style={{
                        padding: "6px 12px",
                        background: "#F59E0B",
                        color: "#000",
                        borderRadius: 6,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Potential
                    </a>

                    <a
                      href={`/dashboard/history/${d.id}`}
                      style={{
                        padding: "6px 12px",
                        background: "#2563EB",
                        color: "white",
                        borderRadius: 6,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Reminder
                    </a>

                    <a
                      href={`/dashboard/history/${d.id}`}
                      style={{
                        padding: "6px 14px",
                        background: "#111827",
                        color: "white",
                        borderRadius: 6,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

