import React from "react";
import { useAuthContext } from "../context/authcontext";
import { PoundSterling } from "lucide-react";

const DashboardHome = () => {
  const { getUserData } = useAuthContext();
  const user = getUserData();

  // Extract and capitalize the first name
  const firstName = user.name.split(" ")[0];
  const capitalizedFirstName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

  return (
    <section className="px-20 py-14 text-white">
      <p className="text-[24px]">
        Hey {capitalizedFirstName},
        <span className="text-white/50 ml-2">what do you want today?</span>
      </p>

      <div className="mt-10">
        <span className="flex items-center justify-start gap-2">
          <span className="text-[18px]"> Your Balance</span>
          <PoundSterling
            className="border border-white rounded-full p-1 font-bold"
            size={20}
          />
        </span>
        <div className="flex items-center justify-between">
          <div className="text-[50px]">{user.balance}</div>

          <div>
            <button className="mt-4 px-6 py-4 sm:px-8 sm:py-3 text-sm sm:text-base font-extraLight bg-white text-[#3038E5] rounded-2xl">
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardHome;
