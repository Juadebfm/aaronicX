import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const RedeemCard = () => {
  return (
    <div className="h-full overflow-y-auto rounded-lg p-[20px] pt-28 pb-20 md:p-14 lg:p-20 lg:pt-14 flex flex-col">
      <div className="flex items-center justify-between text-white">
        <Link
          to="/dashboard/get-coins"
          className="text-blue-500 hover:underline"
        >
          <ChevronLeft />
        </Link>
        <h1 className="text-xl font-bold">Redeem Your Card</h1>
        <div></div>
      </div>
      <div>
        <img
          src="/giftX.png"
          alt=""
          className="w-[150px] h-auto mx-auto mt-20"
        />
        <p className="mt-20 text-center text-[#969AF1] text-lg w-full md:w-[60%] lg:w-[15%] mx-auto">
          Please, enter the code on the back of your giftcard.
        </p>

        <div className="bg-[#0C1595]/50 w-[334px] h-[122px] rounded-2xl mt-16 mx-auto flex flex-col items-center justify-center px-14">
          <input
            type="text"
            className="w-full border-none outline-none bg-transparent text-[35px] text-white placeholder:text-center placeholder:text-[35px]"
            placeholder="*********"
          />
          <div className="text-[#5560F3] uppercase tracking-wide text-[11px]">
            giftcard number
          </div>
        </div>

        <Link
          to="https://card.dagcoin.org/"
          target="_blank"
          className="text-[#969AF1] hover:text-[#969AF1]/80 flex items-center justify-center gap-6 mt-14 text-[19px]"
        >
          <span>Buy a Giftcard</span>
          <ChevronRight />
        </Link>

        <div className="flex items-center justify-center mt-16">
          <button
            className="bg-custom-gradient text-white/85 px-12 shadow-md shadow-black/40 py-4 font-medium hover:opacity-90 rounded-2xl hover:cursor-not-allowed"
            disabled
          >
            Redeem Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedeemCard;
