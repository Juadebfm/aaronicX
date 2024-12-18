import React, { useState } from "react";
import TransactionHistory from "../components/TransactionHistory";
import { useAuthContext } from "../context/authcontext";
import { Bitcoin, DollarSign } from "lucide-react";

const Transactions = () => {
  const { getUserData } = useAuthContext();
  const user = getUserData();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <section className="px-[30px] md:px-14 lg:px-20 py-14">
      <span className="flex items-center justify-start gap-2 text-white">
        <span className="font-bold"> Your Crypto Balance</span>
      </span>
      <div className="text-[50px] flex items-center text-white/70">
        <DollarSign className="mr-1" />
        <span className="tracking-wide font-extralight">
          {user.balance.toLocaleString()}
        </span>
        <Bitcoin className="border border-white/60 rounded-full p-1 mt-4 ml-2 font-bold" />
      </div>
      <div className="mt-7 relative">
        <div className="rounded-b-3xl flex items-center justify-between h-[76px] absolute -top-1 left-0 w-full bg-[#3038E5] px-10 z-10">
          <span className="font-light"> Transactions</span>
        </div>
        <TransactionHistory
          transactions={user.transactionHistory}
          searchTerm={searchTerm}
        />
      </div>
    </section>
  );
};

export default Transactions;
