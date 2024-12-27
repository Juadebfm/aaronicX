import React, { useState } from "react";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

const TransactionHistory = ({ transactions, searchTerm }) => {
  const [selectedDate, setSelectedDate] = useState("");

  // Filter transactions based on searchTerm and selectedDate
  const filteredTransactions = transactions?.filter((transaction) => {
    const matchesSearch = searchTerm
      ? transaction.cryptocurrency
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.walletAddress
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;

    const matchesDate = selectedDate
      ? format(new Date(transaction.transactionDate), "yyyy-MM-dd") ===
        selectedDate
      : true;

    return matchesSearch && matchesDate;
  });

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
          Transaction History
        </h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Type
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Date
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Amount
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Cryptocurrency
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Wallet Address
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions?.map((transaction, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {transaction.type === "received" ? (
                      <ArrowDownLeft className="w-5 h-5 text-green-500" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-500" />
                    )}
                    <span
                      className={`capitalize ${
                        transaction.type === "received"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {format(
                    new Date(
                      transaction.transactionDate || transaction.timestamp
                    ),
                    "PPP p"
                  )}
                </td>
                <td className="py-4 px-4 text-sm font-medium">
                  {transaction.amount.toFixed(8)}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {transaction.cryptocurrency}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  <span className="font-mono">
                    {`${transaction.walletAddress.slice(
                      0,
                      6
                    )}...${transaction.walletAddress.slice(-4)}`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!filteredTransactions || filteredTransactions.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
