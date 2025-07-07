"use client";

interface PrintTransactionsProps {
  transactions: any[];
}

export function PrintTransactions({ transactions }: PrintTransactionsProps) {
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

  return (
    <div>
      {/* Print content */}
      <div className="p-8 bg-white">
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Quick Medicine
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Transaction History
          </h2>
        </div>

        {/* Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-lg font-semibold text-gray-800">
                {transactions?.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Report Date</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Member Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction, index) => (
                <tr key={transaction._id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.memberName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {transaction.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    <span
                      className={`
                        ${
                          transaction.type === "deposit" ? "text-green-600" : ""
                        }
                        ${
                          transaction.type === "withdrawal"
                            ? "text-red-600"
                            : ""
                        }
                        ${transaction.type === "profit" ? "text-blue-600" : ""}
                      `}
                    >
                      {getTransactionSign(transaction.type)}৳
                      {transaction.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {transaction.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`
                        inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                        ${
                          transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : ""
                        }
                        ${
                          transaction.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : ""
                        }
                      `}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <p>Report generated by Quick Medicine Management System</p>
            <p>Page 1 of 1</p>
          </div>
        </div>
      </div>
    </div>
  );
}
