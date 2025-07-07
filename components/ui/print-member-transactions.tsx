interface PrintMemberTransactionsProps {
  transactions: any[];
  memberName: string;
}

export function PrintMemberTransactions({
  transactions,
  memberName,
}: PrintMemberTransactionsProps) {
  const getTransactionSign = (type: string) => {
    switch (type) {
      case "deposit":
        return "+";
      case "withdrawal":
        return "-";
      case "profit":
        return "+";
      default:
        return "";
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "#059669";
      case "withdrawal":
        return "#dc2626";
      case "profit":
        return "#2563eb";
      default:
        return "#374151";
    }
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

  // Only include completed transactions
  const completedTransactions = transactions.filter(
    (t) => t.status === "completed"
  );
  const totalDeposits = completedTransactions
    .filter((t) => t.type === "deposit")
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  const totalWithdrawals = completedTransactions
    .filter((t) => t.type === "withdrawal")
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  const totalProfits = completedTransactions
    .filter((t) => t.type === "profit")
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

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
          Member Transaction Report
        </h2>
      </div>

      {/* Member Info */}
      <div
        style={{
          marginBottom: "25px",
          padding: "15px",
          backgroundColor: "#f8fafc",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
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
              Member Name
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#1f2937",
                margin: "0",
              }}
            >
              {memberName}
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
              Total Transactions
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#1f2937",
                margin: "0",
              }}
            >
              {completedTransactions?.length}
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
              +৳{totalDeposits.toFixed(2)}
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
              Total Withdrawals
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#dc2626",
                margin: "0",
              }}
            >
              -৳{totalWithdrawals.toFixed(2)}
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
              Total Profits
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#2563eb",
                margin: "0",
              }}
            >
              +৳{totalProfits.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
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
          Transaction History ({completedTransactions?.length})
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
              <tr style={{ backgroundColor: "#f8fafc" }}>
                <th
                  style={{
                    padding: "12px 8px",
                    textAlign: "left",
                    borderBottom: "1px solid #e2e8f0",
                    fontWeight: "600",
                    color: "#374151",
                    fontSize: "10px",
                  }}
                >
                  Type
                </th>
                <th
                  style={{
                    padding: "12px 8px",
                    textAlign: "left",
                    borderBottom: "1px solid #e2e8f0",
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
                    borderBottom: "1px solid #e2e8f0",
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
                    borderBottom: "1px solid #e2e8f0",
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
                    borderBottom: "1px solid #e2e8f0",
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
              {completedTransactions.map((transaction, index) => (
                <tr
                  key={transaction._id || index}
                  style={{ borderBottom: "1px solid #f3f4f6" }}
                >
                  <td
                    style={{
                      padding: "12px 8px",
                      fontWeight: "500",
                      color: "#1f2937",
                      textTransform: "capitalize",
                    }}
                  >
                    {transaction.type}
                  </td>
                  <td style={{ padding: "12px 8px", fontWeight: "600" }}>
                    <span
                      style={{ color: getTransactionColor(transaction.type) }}
                    >
                      {getTransactionSign(transaction.type)}৳
                      {transaction.amount}
                    </span>
                  </td>
                  <td style={{ padding: "12px 8px", color: "#374151" }}>
                    {transaction.date}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      color: "#374151",
                      textTransform: "capitalize",
                    }}
                  >
                    {transaction.method}
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
                      {transaction.status}
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
