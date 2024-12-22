// WithdrawButton.jsx
import React, { useState, useEffect } from "react";
import { useWithdrawContext } from "../context/WithdrawContext";

const WithdrawButton = () => {
  const { setModalStep, modalStep } = useWithdrawContext();
  const [processing, setProcessing] = useState(() => {
    // Initialize from localStorage
    return localStorage.getItem("withdrawalProcessing") === "true";
  });

  // Monitor modalStep to handle button state
  useEffect(() => {
    if (modalStep === 4) {
      const timer = setTimeout(() => {
        setModalStep(0);
        setProcessing(true);
        localStorage.setItem("withdrawalProcessing", "true");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [modalStep, setModalStep]);

  // Check for ongoing withdrawal on component mount
  useEffect(() => {
    const ongoingWithdrawal = localStorage.getItem("ongoingWithdrawal");
    if (ongoingWithdrawal) {
      const withdrawalData = JSON.parse(ongoingWithdrawal);
      // If there's an ongoing withdrawal, show the modal at the saved step
      setModalStep(withdrawalData.currentStep);
    }
  }, [setModalStep]);

  const handleClick = () => {
    if (!processing) {
      setModalStep(1);
      // Mark the start of withdrawal process
      localStorage.setItem(
        "ongoingWithdrawal",
        JSON.stringify({
          started: new Date().toISOString(),
          currentStep: 1,
        })
      );
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={processing}
      className={`mt-4 px-6 py-4 sm:px-8 sm:py-3 text-sm sm:text-base font-extraLight rounded-2xl w-[158px] h-[52px] ${
        processing
          ? "bg-gray-500 text-gray-300 cursor-not-allowed"
          : "bg-white text-[#3038E5]"
      }`}
    >
      {processing ? (
        <span className="animate-pulse">Processing...</span>
      ) : (
        "Withdraw"
      )}
    </button>
  );
};

export default WithdrawButton;
