interface PdfTransactionsProps {
  transactions: any[];
}

export function PdfTransactions({ transactions }: PdfTransactionsProps) {
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
        return "text-green-600";
      case "withdrawal":
        return "text-red-600";
      case "profit":
        return "text-blue-600";
      default:
        return "text-gray-700";
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="font-sans p-5 text-sm text-gray-800">
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Quick Medicine
        </h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Transaction History Report
        </h2>
        <p className="text-gray-600">
          Generated on {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <div className="flex justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Transactions</p>
            <p className="text-base font-semibold text-gray-800">
              {transactions?.length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Report Date</p>
            <p className="text-base font-semibold text-gray-800">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50">
              {[
                "Member Name",
                "Type",
                "Amount",
                "Date",
                "Method",
                "Status",
              ].map((header) => (
                <th
                  key={header}
                  className="py-3 px-2 text-left border-b text-gray-700 font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={transaction._id || index}
                className="border-b border-gray-100"
              >
                <td className="py-3 px-2 font-medium text-gray-800">
                  {transaction.memberName}
                </td>
                <td className="py-3 px-2 capitalize text-gray-700">
                  {transaction.type}
                </td>
                <td
                  className={`py-3 px-2 font-semibold ${getTransactionColor(
                    transaction.type
                  )}`}
                >
                  {getTransactionSign(transaction.type)}৳{transaction.amount}
                </td>
                <td className="py-3 px-2 text-gray-700">{transaction.date}</td>
                <td className="py-3 px-2 capitalize text-gray-700">
                  {transaction.method}
                </td>
                <td className="py-3 px-2 ">
                  <span
                    className={` px-2 py-1 rounded-full text-[10px] font-semibold }`}
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
      <div className="mt-8 pt-5 border-t border-gray-200">
        <div className="flex justify-between text-xs text-gray-500">
          <p>Report generated by Quick Medicine Management System</p>
          <p>Page 1 of 1</p>
        </div>
      </div>
    </div>
  );
}
