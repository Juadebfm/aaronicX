import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const GetCoins = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <section className="px-[30px] lg:px-20 py-14 text-white mt-14 lg:mt-0">
      <div className="flex items-center justify-between text-[19px] mt-3">
        <ChevronLeft
          onClick={handleGoBack}
          className="cursor-pointer hover:opacity-70 transition-opacity duration-300"
        />
        <h2 className="block font-light text-xl capitalize">Buy</h2>
        <div></div>
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-20 
        overflow-x-auto 
        grid-flow-col 
        auto-cols-[100%] 
        sm:auto-cols-[calc(100%-2rem)] 
        lg:grid-flow-row 
        lg:auto-cols-auto 
        h-[calc(100vh-300px)] 
        lg:overflow-y-auto 
        lg:overflow-x-hidden 
        snap-x 
        snap-mandatory 
        scrollbar-hide 
        w-full"
      >
        {[
          {
            to: "https://swipex.com/",
            img: "/swipeX.png",
            imgClass: "w-[176px] h-[88px]",
            title: "Buy From",
            boldTitle: "SwipeX",
            link: "www.swipex.com",
          },
          {
            to: "/dashboard/get-coins/redeem-card",
            img: "/giftX.png",
            imgClass: "w-[78px] h-[78px]",
            title: "Redeem your",
            boldTitle: "Giftcard",
            link: "Already Have A Card?",
          },
          {
            to: "https://card.dagcoin.org/",
            img: "/50dagX.png",
            imgClass: "w-auto h-[116px]",
            title: "Prepaid",
            boldTitle: "Card",
            link: "giftcard.dagcoin.org",
          },
          {
            to: "https://card.dagcoin.org/",
            img: "/dag100.png",
            imgClass: "w-auto h-[116px]",
            title: "Prepaid",
            boldTitle: "Card",
            link: "giftcard.dagcoin.org",
          },
        ].map((card, index) => (
          <Link
            key={index}
            to={card.to}
            target={card.to.startsWith("http") ? "_blank" : undefined}
            className="bg-[#424EF2] min-h-[340px] rounded-xl cursor-pointer 
            hover:shadow-lg hover:shadow-gray-300/20 border border-[#3038E5] 
            duration-300 transition-all flex flex-col items-center 
            justify-between py-7 px-14 snap-center lg:snap-align-none 
            shrink-0 w-full sm:w-[calc(100%-2rem)] lg:w-auto"
          >
            <div className="pt-7">
              <img src={card.img} alt="" className={card.imgClass} />
            </div>
            <div className="w-full lg:w-[80%] mx-auto">
              <div className="text-[20px] font-light border-b border-[#6C74F3] w-full text-center pb-4">
                {card.title} <span className="font-bold">{card.boldTitle}</span>
              </div>

              <div className="text-[#969AF1]">
                <div className="flex items-center justify-between pb-4 pt-5">
                  <span></span>
                  <span>{card.link}</span>
                  <ChevronRight size={12} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default GetCoins;
