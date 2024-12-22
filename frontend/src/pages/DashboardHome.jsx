import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/authcontext";
import {
  Bitcoin,
  DollarSign,
  PoundSterling,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import TransactionHistory from "../components/TransactionHistory";
import DepositButton from "../components/DepositButton";
import WithdrawModals from "../components/WithdrawModals";
import WithdrawButton from "../components/WithdrawButton";
import BalanceDisplay from "../components/BalanceDisplay";

const DashboardHome = () => {
  const { getUserData } = useAuthContext();
  const user = getUserData();

  const [conversionRate, setConversionRate] = useState(0.79);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch(
          "https://api.frankfurter.app/latest?from=USD&to=GBP"
        );
        const data = await response.json();
        setConversionRate(data.rates.GBP);
      } catch (error) {
        console.error("Error fetching conversion rate:", error);
      }
    };

    fetchRate();
  }, []);

  // Extract and capitalize the first name
  const firstName = user.name.split(" ")[0];
  const capitalizedFirstName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

  // Toggle search input
  const handleSearchToggle = () => {
    setIsSearchActive(!isSearchActive);
    setSearchTerm("");
  };

  // Filter modal component
  const FilterModal = () => (
    <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-10">
      <h3 className="text-lg font-semibold mb-4">Filter Transactions</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transaction Type
        </label>
        <div className="flex space-x-2">
          <button className="px-3 py-1 rounded bg-gray-200">Received</button>
          <button className="px-3 py-1 rounded bg-gray-200">Sent</button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cryptocurrency
        </label>
        <div className="flex space-x-2">
          <button className="px-3 py-1 rounded bg-gray-200">BTC</button>
          <button className="px-3 py-1 rounded bg-gray-200">ETH</button>
        </div>
      </div>
    </div>
  );

  return (
    <section className="px-[30px] md:px-14 lg:px-20 py-14 text-white mt-14 lg:mt-0">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <p className="hidden lg:block text-lg">
          Hey {capitalizedFirstName}!
          <span className="text-white/50 ml-2">What do you want today?</span>
        </p>

        <div className="flex items-center justify-center gap-2 mt-3 lg:mt-0 text-[12px] text-white/70 lg:text-base">
          <span>Balance in pounds: </span>
          <div className="flex justify-center items-center">
            <PoundSterling className="mr-1 font-bold" size={13} />
            <span>
              {(user.balance * conversionRate).toLocaleString("en-GB", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
            </span>
          </div>
          <img src="/icon.png" alt="" width={22} height={22} />
        </div>
      </div>

      <div className="mt-7 lg:mt-16">
        <span className="flex items-center justify-center gap-2">
          <span className="font-bold"> Your Crypto Balance</span>
        </span>
        <div className="flex flex-col items-center justify-between">
          <BalanceDisplay />

          <div className="flex items-center gap-5">
            <DepositButton />
            <WithdrawButton />
          </div>
          <WithdrawModals />
        </div>
        <div className="mt-7 lg:mt-14 relative">
          <TransactionHistory
            transactions={user.transactionHistory}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </section>
  );
};

export default DashboardHome;
