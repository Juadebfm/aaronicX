import React, { useState, useEffect } from "react";
import TransactionHistory from "../components/TransactionHistory";
import { useAuthContext } from "../context/authcontext";
import DepositButton from "../components/DepositButton";
import {
  Bitcoin,
  DollarSign,
  Shield,
  Globe,
  Clock,
  Monitor,
} from "lucide-react";
import WithdrawButton from "../components/WithdrawButton";
import BalanceDisplay from "../components/BalanceDisplay";

const Transactions = () => {
  const { getUserData } = useAuthContext();
  const user = getUserData();
  const [searchTerm, setSearchTerm] = useState("");
  const [securityInfo, setSecurityInfo] = useState({
    ipAddress: "",
    lastLogin: new Date().toLocaleString(),
    device: "",
    location: "",
  });

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        setSecurityInfo((prev) => ({
          ...prev,
          ipAddress: data.ip,
        }));
      })
      .catch(() => {
        setSecurityInfo((prev) => ({
          ...prev,
          ipAddress: "Unable to detect",
        }));
      });

    const userAgent = window.navigator.userAgent;
    const device = /mobile/i.test(userAgent)
      ? "Mobile Device"
      : "Desktop Computer";

    const location = new Intl.DisplayNames(["en"], { type: "region" }).of(
      navigator.language.split("-")[1] || "US"
    );

    setSecurityInfo((prev) => ({
      ...prev,
      device,
      location,
    }));
  }, []);

  return (
    <section className="bg-[#3038E5] h-full px-[30px] md:px-14 lg:px-20 py-8 overflow-y-auto">
      {/* Security Information Section */}
      <div className="bg-white/10 rounded-xl p-6 mb-8 mt-16">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-white" />
          <h2 className="text-lg font-semibold text-white pt-1">
            Security Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-blue-300" />
            <div>
              <p className="text-sm text-gray-300">IP Address</p>
              <p className="text-sm font-medium text-white">
                {securityInfo.ipAddress}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-blue-300" />
            <div>
              <p className="text-sm text-gray-300">Last Login</p>
              <p className="text-sm font-medium text-white">
                {securityInfo.lastLogin}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Monitor className="w-4 h-4 text-blue-300" />
            <div>
              <p className="text-sm text-gray-300">Device</p>
              <p className="text-sm font-medium text-white">
                {securityInfo.device}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-blue-300" />
            <div>
              <p className="text-sm text-gray-300">Location</p>
              <p className="text-sm font-medium text-white">
                {securityInfo.location}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Section */}
      <div className="mb-8">
        <div className="text-white">
          <span className="flex items-center justify-center gap-2">
            <span className="font-bold">Your Crypto Balance</span>
          </span>
          <div className="flex flex-col items-center justify-between">
            <BalanceDisplay />

            <div className="flex items-center gap-5">
              <DepositButton />
              <WithdrawButton />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div>
        <TransactionHistory
          transactions={user.transactionHistory}
          searchTerm={searchTerm}
        />
      </div>
    </section>
  );
};

export default Transactions;
