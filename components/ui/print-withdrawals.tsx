interface PrintWithdrawalsProps {
  withdrawals: any[];
  withdrawalRequests: any[];
}

export function PrintWithdrawals({
  withdrawals,
  withdrawalRequests,
}: PrintWithdrawalsProps) {
  const getWithdrawalSign = () => {
    return "-";
  };

  const getWithdrawalColor = () => {
    return "#dc2626";
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

  const totalWithdrawals = withdrawals.reduce(
    (sum, withdrawal) => sum + (parseFloat(withdrawal.amount) || 0),
    0
  );
  const totalRequests = withdrawalRequests.reduce(
    (sum, request) => sum + (parseFloat(request.amount) || 0),
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
          Withdrawal Management Report
        </h2>
      </div>

      {/* Summary */}
      <div
        style={{
          marginBottom: "25px",
          padding: "15px",
          backgroundColor: "#fef2f2",
          borderRadius: "8px",
          border: "1px solid #fecaca",
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
              {withdrawals?.length}
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
              Pending Requests
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#f59e0b",
                margin: "0",
              }}
            >
              {withdrawalRequests?.length}
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

      {/* All Withdrawals Section */}
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
          All Withdrawals ({withdrawals?.length})
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
              <tr style={{ backgroundColor: "#fef2f2" }}>
                <th
                  style={{
                    padding: "12px 8px",
                    textAlign: "left",
                    borderBottom: "1px solid #fecaca",
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
                    borderBottom: "1px solid #fecaca",
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
                    borderBottom: "1px solid #fecaca",
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
                    borderBottom: "1px solid #fecaca",
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
                    borderBottom: "1px solid #fecaca",
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
              {withdrawals.map((withdrawal, index) => (
                <tr
                  key={withdrawal._id || index}
                  style={{ borderBottom: "1px solid #f3f4f6" }}
                >
                  <td
                    style={{
                      padding: "12px 8px",
                      fontWeight: "500",
                      color: "#1f2937",
                    }}
                  >
                    {withdrawal.memberName}
                  </td>
                  <td style={{ padding: "12px 8px", fontWeight: "600" }}>
                    <span style={{ color: "#dc2626" }}>
                      {getWithdrawalSign()}৳{withdrawal.amount}
                    </span>
                  </td>
                  <td style={{ padding: "12px 8px", color: "#374151" }}>
                    {withdrawal.date}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      color: "#374151",
                      textTransform: "capitalize",
                    }}
                  >
                    {withdrawal.method}
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
                      {withdrawal.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Requests Section */}
      {withdrawalRequests?.length > 0 && (
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
            Pending Requests ({withdrawalRequests?.length})
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
                <tr style={{ backgroundColor: "#fffbeb" }}>
                  <th
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      borderBottom: "1px solid #fed7aa",
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
                      borderBottom: "1px solid #fed7aa",
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
                      borderBottom: "1px solid #fed7aa",
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
                      borderBottom: "1px solid #fed7aa",
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
                      borderBottom: "1px solid #fed7aa",
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
                {withdrawalRequests.map((request, index) => (
                  <tr
                    key={request._id || index}
                    style={{ borderBottom: "1px solid #f3f4f6" }}
                  >
                    <td
                      style={{
                        padding: "12px 8px",
                        fontWeight: "500",
                        color: "#1f2937",
                      }}
                    >
                      {request.memberName}
                    </td>
                    <td style={{ padding: "12px 8px", fontWeight: "600" }}>
                      <span style={{ color: "#dc2626" }}>
                        {getWithdrawalSign()}৳{request.amount}
                      </span>
                    </td>
                    <td style={{ padding: "12px 8px", color: "#374151" }}>
                      {request.date}
                    </td>
                    <td
                      style={{
                        padding: "12px 8px",
                        color: "#374151",
                        textTransform: "capitalize",
                      }}
                    >
                      {request.method}
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "9px",
                          fontWeight: "600",
                          display: "inline-block",
                          ...getStatusStyle(request.status),
                        }}
                      >
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
