import React, { useState, useEffect } from "react";

const DepositButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Handle screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // 1024px is Tailwind's 'lg' breakpoint
    };

    // Check initially
    checkScreenSize();

    // Add listener for resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleInteraction = (event) => {
    if (!isLargeScreen && event.type === "click") {
      setShowTooltip(!showTooltip);
    } else if (isLargeScreen) {
      setShowTooltip(event.type === "mouseenter");
    }
  };

  return (
    <div className="relative">
      <button
        className="mt-4 px-6 py-4 sm:px-8 sm:py-3 text-sm sm:text-base font-extraLight bg-white/40 text-[#3038E5] rounded-2xl w-[158px] h-[52px] cursor-pointer hover:shadow-md duration-300"
        onClick={handleInteraction}
        onMouseEnter={handleInteraction}
        onMouseLeave={handleInteraction}
        aria-describedby="deposit-tooltip"
      >
        Deposit
      </button>

      {showTooltip && (
        <div
          id="deposit-tooltip"
          className="absolute z-50 w-64 bg-white text-gray-950 text-sm rounded-lg shadow-lg px-4 py-2 bottom-[-85px] lg:bottom-full left-1/2 transform -translate-x-1/2 lg:mb-2"
          role="tooltip"
        >
          <p>
            Deposits are currently paused for this account. Please contact the
            primary account owner to enable deposits.
          </p>
          <div className="absolute lg:top-full lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-mt-1">
            <div className="border-8 border-transparent lg:border-t-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositButton;
