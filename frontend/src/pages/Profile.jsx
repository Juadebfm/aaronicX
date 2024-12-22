import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Edit, Copy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/authcontext";
import BalanceDisplay from "../components/BalanceDisplay";

const Profile = () => {
  const navigate = useNavigate();
  const { getUserData } = useAuthContext();
  const user = getUserData();
  const [currentTransactionIndex, setCurrentTransactionIndex] = useState(0);

  // Extract and capitalize the first name
  const firstName = user.name.split(" ")[0];
  const capitalizedFirstName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

  // Get user initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`dagcoin.me/${user.id}`);
  };

  const handlePrevTransaction = () => {
    setCurrentTransactionIndex((prev) =>
      prev > 0 ? prev - 1 : user.transactionHistory.length - 1
    );
  };

  const handleNextTransaction = () => {
    setCurrentTransactionIndex((prev) =>
      prev < user.transactionHistory.length - 1 ? prev + 1 : 0
    );
  };

  const currentTransaction = user.transactionHistory[currentTransactionIndex];

  return (
    <section className="h-full overflow-y-auto rounded-lg text-white p-4 pt-28 pb-20 md:p-14 lg:p-20 lg:pt-14 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between text-white">
        <button
          onClick={handleGoBack}
          className="text-blue-500 hover:text-blue-600"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold">Profile</h1>
        <div></div>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center gap-4 mt-14">
        {/* Avatar with fallback */}
        {user.profileImage !== "default-profile.png" ? (
          <div className="relative">
            <img
              src={user.profileImage}
              alt={user.name}
              className="h-28 w-28 rounded-full border-4 border-white object-cover"
            />
            <img
              src="/ON.png"
              alt=""
              className="w-7 h-7 absolute bottom-[-8px] left-1/2 transform -translate-x-1/2"
            />
          </div>
        ) : (
          <div className="h-24 w-24 rounded-full relative bg-gray-500 border-4 border-white flex items-center justify-center text-white text-xl">
            <span>{getInitials(user.name)}</span>
            <img
              src="/ON.png"
              alt=""
              width={30}
              height={30}
              className="-bottom-3 absolute"
            />
          </div>
        )}
        <h2 className="text-3xl font-semibold mt-10 border-b-2 pb-7 border-[#262ED3] text-white">
          {user.name}
        </h2>

        {/* Public Link */}
        <div className="flex flex-col items-center gap-2 rounded-lg p-2 border-b-2 pb-7 border-[#262ED3]">
          <p className="text-[#648CFF] text-sm uppercase">Private Link</p>
          <div>
            <span className="text-gray-300 text-sm lg:text-lg">
              dagcoin.me/{user.id}
            </span>
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-400 hover:text-white"
            >
              <Copy className="h-3 lg:h-4 w-3 lg:w-4" />
            </button>
          </div>
        </div>

        <div className="border-b-2 pb-7 border-[#262ED3]">
          <BalanceDisplay />
        </div>
      </div>
    </section>
  );
};

export default Profile;
