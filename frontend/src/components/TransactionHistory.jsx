import React, { useState, useMemo } from "react";
import {
  Bitcoin,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { FaEthereum } from "react-icons/fa";

// Utility to get cryptocurrency icon
const getCryptoIcon = (cryptocurrency) => {
  switch (cryptocurrency.toUpperCase()) {
    case "BTC":
      return <Bitcoin className="text-orange-500" />;
    case "ETH":
      return <FaEthereum className="text-blue-500" size={25} />;
    default:
      return <div className="w-6 h-6 bg-gray-300 rounded-full"></div>;
  }
};

const TransactionHistoryItem = ({ transaction }) => {
  const { type, amount, cryptocurrency, createdAt, walletAddress } =
    transaction;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <div className="relative">
          {getCryptoIcon(cryptocurrency)}
          {type === "sent" ? (
            <ArrowUpRight
              className="absolute -top-3 -right-3 text-red-500 bg-red-100 rounded-full p-1"
              size={20}
            />
          ) : (
            <ArrowDownLeft
              className="absolute -top-3 -right-3 text-green-500 bg-green-100 rounded-full p-1"
              size={20}
            />
          )}
        </div>
        <div>
          <p className="font-medium capitalize">
            {type} {cryptocurrency}
          </p>
          <p className="text-[13px] text-gray-500 truncate max-w-[150px]">
            {walletAddress}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-semibold text-sm ${
            type === "sent" ? "text-red-500" : "text-green-500"
          }`}
        >
          {type === "sent" ? "-" : "+"} {`$`} {amount.toLocaleString()}{" "}
          {cryptocurrency}
        </p>
        <p className="text-[11px] text-gray-500">{formatDate(createdAt)}</p>
      </div>
    </div>
  );
};

const TransactionHistory = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    cryptocurrency: "",
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (transaction) =>
        (!filters.type || transaction.type === filters.type) &&
        (!filters.cryptocurrency ||
          transaction.cryptocurrency.toLowerCase() ===
            filters.cryptocurrency.toLowerCase()) &&
        (!searchTerm ||
          transaction.walletAddress
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.cryptocurrency
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );
  }, [transactions, searchTerm, filters]);

  // Filter modal component
  const FilterModal = () => (
    <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-10">
      <h3 className="text-lg font-semibold mb-4">Filter Transactions</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transaction Type
        </label>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded ${
              filters.type === "received"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                type: filters.type === "received" ? "" : "received",
              }))
            }
          >
            Received
          </button>
          <button
            className={`px-3 py-1 rounded ${
              filters.type === "sent" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                type: filters.type === "sent" ? "" : "sent",
              }))
            }
          >
            Sent
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cryptocurrency
        </label>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded ${
              filters.cryptocurrency === "btc"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                cryptocurrency: filters.cryptocurrency === "btc" ? "" : "btc",
              }))
            }
          >
            BTC
          </button>
          <button
            className={`px-3 py-1 rounded ${
              filters.cryptocurrency === "eth"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                cryptocurrency: filters.cryptocurrency === "eth" ? "" : "eth",
              }))
            }
          >
            ETH
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-b-3xl p-6 relative">
      {/* Search and Filter Bar */}
      <div className="mt-16 lg:mt-20 mb-6 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-[#3038E5] focus:border-[#3038E5] focus:outline-[#3038E5] active:border-[#3038E5]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <SlidersHorizontal
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
          />
        </div>

        {/* Filter Modal */}
        {isFilterModalOpen && <FilterModal />}
      </div>

      {/* Scrollable transaction list */}
      <div className="max-h-[350px] lg:max-h-[300px] overflow-y-auto pb-20">
        {filteredTransactions.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No transactions found
          </div>
        ) : (
          <div>
            {filteredTransactions.map((transaction) => (
              <TransactionHistoryItem
                key={transaction._id}
                transaction={transaction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
