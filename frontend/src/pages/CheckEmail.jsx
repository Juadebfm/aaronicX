import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";

const CheckMail = () => {
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [isCodeWrong, setIsCodeWrong] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const navigate = useNavigate(); // Add this line

  // Simulated correct verification code (in real app, this would come from backend)
  const CORRECT_VERIFICATION_CODE = "1234";

  // Handle input change
  const handleInputChange = (index, value) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");

    // Create a copy of the current verification code
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = numericValue;

    // Update state
    setVerificationCode(newVerificationCode);
    setIsCodeWrong(false);

    // Auto-focus next input if current input is filled
    if (numericValue.length === 1 && index < 3) {
      inputRefs[index + 1].current.focus();
    }

    // Check if all inputs are filled
    const isFullyFilled = newVerificationCode.every(
      (code) => code.length === 1
    );
    setIsCodeValid(isFullyFilled);
  };

  // Handle key events (backspace to go to previous input)
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && verificationCode[index] === "") {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = () => {
    const enteredCode = verificationCode.join("");
    console.log("Clicked", {
      enteredCode,
      isValid: enteredCode === CORRECT_VERIFICATION_CODE,
    });

    if (enteredCode === CORRECT_VERIFICATION_CODE) {
      console.log("Navigation should happen");
      navigate("/dashboard");
    } else {
      console.log("Code is incorrect");
      setIsCodeWrong(true);
      setCanResend(true);
    }
  };

  // Resend code functionality
  const handleResendCode = () => {
    // Reset state
    setVerificationCode(["", "", "", ""]);
    setIsCodeValid(false);
    setIsCodeWrong(false);
    setCanResend(false);

    // In a real app, this would trigger a new code generation and send
    console.log("Resending verification code");
  };

  return (
    <section className="h-max px-[30px] lg:px-12 relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 justify-center lg:justify-start items-center fixed top-0 left-0 bg-white w-full lg:w-screen py-5 lg:py-7 px-12">
        <img
          src="/dagcoin.png"
          alt="DagCoin Logo"
          className="w-[120px] lg:w-[173px] h-auto"
        />
      </div>
      <div className="flex flex-col items-center justify-center py-32 min-h-screen">
        <span className="text-[#1E2240] font-extralight uppercase pt-2">
          verification code
        </span>
        <p className="font-extralight text-center w-[80%] lg:w-full text-[18px] text-[#1E2240] mt-6">
          Please enter the verification code sent to your email
        </p>

        <div className="border-b pb-16">
          <div className="mt-10 w-[290px] h-[159px] rounded-2xl border-[1px] border-[#3038E5] flex items-center justify-center flex-col pb-7">
            <span className="uppercase text-[11px] font-extralight text-[#1E2240]">
              enter your code here
            </span>
            <div className="flex items-center justify-center mt-5">
              {verificationCode.map((code, index) => (
                <input
                  key={index}
                  type="text"
                  ref={inputRefs[index]}
                  value={code}
                  maxLength={1}
                  placeholder="0"
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="placeholder:text-[40px] text-[40px] placeholder:text-[#9397B3] placeholder:font-light w-10 h-[50px] pl-2 text-center mx-1 border-b-2 focus:outline-none"
                />
              ))}
            </div>
            {isCodeWrong && (
              <p className="text-red-500 text-sm mt-2">
                Incorrect verification code
              </p>
            )}
          </div>
        </div>

        {canResend && (
          <button
            onClick={handleResendCode}
            className="text-[#3038E5] underline mt-4 hover:text-blue-700"
          >
            Resend Code
          </button>
        )}

        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!isCodeValid}
          className={`
          ${
            isCodeValid
              ? "bg-[#3038E5] text-white"
              : "bg-[#D9E0F6]/50 text-[#A5A7B3]/40"
          }
          mt-4 py-4 px-6 text-base cursor-pointer duration-150 transition-all ease-linear flex items-center justify-center rounded-2xl w-[370px] h-[53px]
        `}
        >
          Verify Code
        </button>
      </div>
    </section>
  );
};

export default CheckMail;
