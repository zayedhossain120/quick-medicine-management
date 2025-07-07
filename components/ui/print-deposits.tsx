interface PrintDepositsProps {
  deposits: any[];
}

export function PrintDeposits({ deposits }: PrintDepositsProps) {
  const getDepositSign = () => {
    return "+";
  };

  const getDepositColor = () => {
    return "#059669";
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return { backgroundColor: "#dcfce7", color: "#166534" };
      case "pending":
        return { backgroundColor: "#fef3c7", color: "#92400e" };
      default:
        return { backgroundColor: "#fee2e2", color: "#991b1b" };
    }
  };

  // Only include completed deposits
  const completedDeposits = deposits.filter((d) => d.status === "completed");
  const totalDeposits = completedDeposits.reduce(
    (sum, deposit) => sum + (parseFloat(deposit.amount) || 0),
    0
  );

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        fontSize: "12px",
        color: "#1f2937",
        backgroundColor: "white",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#1f2937",
            margin: "0 0 10px 0",
          }}
        >
          Quick Medicine
        </h1>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#374151",
            margin: "0 0 8px 0",
          }}
        >
          Deposit Management Report
        </h2>
      </div>

      {/* Summary */}
      <div
        style={{
          marginBottom: "25px",
          padding: "15px",
          backgroundColor: "#f0fdf4",
          borderRadius: "8px",
          border: "1px solid #bbf7d0",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p
              style={{
                fontSize: "11px",
                color: "#6b7280",
                margin: "0 0 5px 0",
              }}
            >
              Total Deposits
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#059669",
                margin: "0",
              }}
            >
              {completedDeposits?.length}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "11px",
                color: "#6b7280",
                margin: "0 0 5px 0",
              }}
            >
              Total Amount
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#059669",
                margin: "0",
              }}
            >
              +৳{totalDeposits}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "11px",
                color: "#6b7280",
                margin: "0 0 5px 0",
              }}
            >
              Report Date
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#1f2937",
                margin: "0",
              }}
            >
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* All Deposits Section */}
      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#1f2937",
            margin: "0 0 15px 0",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "8px",
          }}
        >
          All Deposits ({completedDeposits?.length})
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "11px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f0fdf4" }}>
                <th
                  style={{
                    padding: "12px 8px",
                    textAlign: "left",
                    borderBottom: "1px solid #bbf7d0",
                    fontWeight: "600",
                    color: "#374151",
                    fontSize: "10px",
                  }}
                >
                  Member Name
                </th>
                <th
                  style={{
                    padding: "12px 8px",
                    textAlign: "left",
                    borderBottom: "1px solid #bbf7d0",
                    fontWeight: "600",
                    color: "#374151",
                    fontSize: "10px",
                  }}
                >
                  Amount
                </th>
                <th
                  style={{
                    padding: "12px 8px",
                    textAlign: "left",
                    borderBottom: "1px solid #bbf7d0",
                    fontWeight: "600",
                    color: "#374151",
                    fontSize: "10px",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    padding: "12px 8px",
                    textAlign: "left",
                    borderBottom: "1px solid #bbf7d0",
                    fontWeight: "600",
                    color: "#374151",
                    fontSize: "10px",
                  }}
                >
                  Method
                </th>
                <th
                  style={{
                    padding: "12px 8px",
                    textAlign: "left",
                    borderBottom: "1px solid #bbf7d0",
                    fontWeight: "600",
                    color: "#374151",
                    fontSize: "10px",
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {completedDeposits.map((deposit, index) => (
                <tr
                  key={deposit._id || index}
                  style={{ borderBottom: "1px solid #f3f4f6" }}
                >
                  <td
                    style={{
                      padding: "12px 8px",
                      fontWeight: "500",
                      color: "#1f2937",
                    }}
                  >
                    {deposit.memberName}
                  </td>
                  <td style={{ padding: "12px 8px", fontWeight: "600" }}>
                    <span style={{ color: "#059669" }}>
                      {getDepositSign()}৳{deposit.amount}
                    </span>
                  </td>
                  <td style={{ padding: "12px 8px", color: "#374151" }}>
                    {deposit.date}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      color: "#374151",
                      textTransform: "capitalize",
                    }}
                  >
                    {deposit.method}
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "9px",
                        fontWeight: "600",
                        display: "inline-block",
                      }}
                    >
                      {deposit.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "30px",
          paddingTop: "20px",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "10px",
            color: "#6b7280",
          }}
        >
          <p style={{ margin: "0" }}>
            Report generated by Quick Medicine Management System
          </p>
          <p style={{ margin: "0" }}>Page 1 of 1</p>
        </div>
      </div>
    </div>
  );
}
