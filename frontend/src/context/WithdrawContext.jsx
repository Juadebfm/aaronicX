import React, { createContext, useContext, useState } from "react";

const WithdrawContext = createContext();

export const WithdrawProvider = ({ children }) => {
  const [modalStep, setModalStep] = useState(0);
  const [withdrawCode, setWithdrawCode] = useState("");
  return (
    <WithdrawContext.Provider
      value={{
        modalStep,
        setModalStep,
        withdrawCode,
        setWithdrawCode,
      }}
    >
      {children}
    </WithdrawContext.Provider>
  );
};

export const useWithdrawContext = () => useContext(WithdrawContext);
