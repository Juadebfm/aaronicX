import React, { useState, useEffect, useRef } from "react";
import { Bitcoin, DollarSign, EqualApproximately, Info } from "lucide-react";
import { useAuthContext } from "../context/authcontext";

const CACHE_KEY = "btc_rate_cache";
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

const BalanceDisplay = () => {
  const { getUserData } = useAuthContext();
  const user = getUserData();
  const [btcRate, setBtcRate] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const fetchAndCacheBitcoinRate = async () => {
      try {
        // Check cache first
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { rate, timestamp } = JSON.parse(cachedData);
          const now = Date.now();

          // If cache is still valid, use it
          if (now - timestamp < CACHE_DURATION) {
            setBtcRate(rate);
            return;
          }
        }

        // If no cache or expired, fetch new data
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const newRate = 1 / data.bitcoin.usd;

        // Cache the new rate
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            rate: newRate,
            timestamp: Date.now(),
          })
        );

        setBtcRate(newRate);
      } catch (error) {
        console.error("Error fetching Bitcoin rate:", error);
        // If fetch fails, try to use cached data even if expired
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { rate } = JSON.parse(cachedData);
          setBtcRate(rate);
        }
      }
    };

    fetchAndCacheBitcoinRate();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInfoClick = (e) => {
    e.stopPropagation();
    setShowTooltip(!showTooltip);
  };

  const btcAmount = btcRate && user?.balance ? user.balance * btcRate : null;

  return (
    <div className="flex flex-col items-center">
      <div className="text-[50px] flex items-center">
        <DollarSign className="mr-1" />
        <span className="tracking-wide font-extralight">
          {(user?.balance || 0).toLocaleString()}
        </span>
      </div>
      <div className="flex items-center text-white/70 text-lg mt-2">
        {btcAmount ? (
          <div className="flex items-center relative">
            <span className="flex items-center">
              <Bitcoin
                className="mr-1 border border-white/50 rounded-full p-1"
                size={25}
              />
              <EqualApproximately className="mr-1"/>

              {btcAmount.toFixed(8)}
            </span>
            <div ref={tooltipRef} className="relative">
              <Info
                className="ml-2 w-6 h-6 cursor-pointer text-white/50 hover:text-white/80 transition-colors"
                onClick={handleInfoClick}
              />
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-md shadow-lg w-max max-w-[250px] z-10">
                  <div className="text-center">
                    There might be a delay in updating data. Wallet balance is
                    updated after every encrypted transaction.
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <span>Loading conversion...</span>
        )}
      </div>
    </div>
  );
};

export default BalanceDisplay;
