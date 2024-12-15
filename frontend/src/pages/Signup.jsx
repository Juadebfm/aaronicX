import React, { useState } from "react";
import {
  ChevronRight,
  KeyRound,
  Mail,
  User,
  Eye,
  EyeOff,
  IdCard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/authcontext";

const Signup = () => {
  const {
    formState,
    updateFormField,
    isFormValid,
    signup,
    validatePassword,
    authError,
  } = useAuthContext();

  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormField("signup", name, value);

    // Special handling for password to show strength
    if (name === "password") {
      const strength = validatePassword(value);
      setPasswordStrength(strength);
    }
    console.log(formState.signup); // Debugging the form state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signup function called"); // Add this line

    await signup(); // Actually call the signup method from AuthContext
  };

  const signupFormFields = [
    "firstname",
    "lastname",
    "email",
    "password",
    "age",
    "nin",
  ];
  const isSignupFormValid = isFormValid("signup", signupFormFields);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  console.log("Is signup form valid?", isSignupFormValid);

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
          Sign up
        </span>
        <img
          src="/signupdagcoin.png"
          alt="Signup Illustration"
          className="w-[234px] lg:w-[270px] h-auto my-10"
        />
        <form
          onSubmit={handleSubmit}
          className="text-[#9397B3] w-full lg:w-1/3"
        >
          {/* Firstname Input */}
          <div className="border-t py-6">
            <label
              htmlFor="firstname"
              className="uppercase text-[12px] tracking-widest"
            >
              Firstname
            </label>
            <div className="flex items-center justify-between">
              <input
                id="firstname"
                name="firstname"
                type="text"
                value={formState.signup?.firstname || ""}
                onChange={handleInputChange}
                placeholder="Type here"
                className="w-full ring-0 focus:outline-none active:outline-none py-2 bg-transparent focus:bg-transparent"
              />
              <User />
            </div>
          </div>

          {/* Lastname Input */}
          <div className="border-t py-6">
            <label
              htmlFor="lastname"
              className="uppercase text-[12px] tracking-widest"
            >
              Lastname
            </label>
            <div className="flex items-center justify-between">
              <input
                id="lastname"
                name="lastname"
                type="text"
                value={formState.signup?.lastname || ""}
                onChange={handleInputChange}
                placeholder="Type here"
                className="w-full ring-0 focus:outline-none active:outline-none py-2 bg-transparent focus:bg-transparent"
              />
              <User />
            </div>
          </div>

          {/* Email Input */}
          <div className="border-y py-6">
            <label
              htmlFor="email"
              className="uppercase text-[12px] tracking-widest"
            >
              Email
            </label>
            <div className="flex items-center justify-between">
              <input
                id="email"
                name="email"
                type="email"
                value={formState.signup?.email || ""}
                onChange={handleInputChange}
                placeholder="Type here"
                className="w-full ring-0 focus:outline-none active:outline-none py-2 bg-transparent focus:bg-transparent"
              />
              <Mail />
            </div>
          </div>

          {/* Age Input */}
          <div className="border-t py-6">
            <label
              htmlFor="age"
              className="uppercase text-[12px] tracking-widest"
            >
              Age
            </label>
            <div className="flex items-center justify-between">
              <input
                id="age"
                name="age"
                type="number"
                min="0"
                value={formState.signup?.age || ""}
                onChange={handleInputChange}
                placeholder="Enter your age"
                className="w-full ring-0 focus:outline-none active:outline-none py-2 bg-transparent focus:bg-transparent"
              />
              <User />
            </div>
          </div>

          {/* NIN Input */}
          <div className="border-t py-6">
            <label
              htmlFor="nin"
              className="uppercase text-[12px] tracking-widest"
            >
              National ID Number (NIN)
            </label>
            <div className="flex items-center justify-between">
              <input
                id="nin"
                name="nin"
                type="text"
                value={formState.signup?.nin || ""}
                onChange={handleInputChange}
                placeholder="Enter your NIN"
                className="w-full ring-0 focus:outline-none active:outline-none py-2 bg-transparent focus:bg-transparent"
              />
              <IdCard />
            </div>
          </div>

          {/* Password Input */}
          <div className="border-y py-6">
            <label
              htmlFor="password"
              className="uppercase text-[12px] tracking-widest"
            >
              Password
            </label>
            <div className="flex items-center justify-between">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formState.signup?.password || ""}
                onChange={handleInputChange}
                placeholder="Type here"
                className="w-full ring-0 focus:outline-none active:outline-none py-2 bg-transparent focus:bg-transparent"
              />
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="mr-2"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {formState.signup?.password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        passwordStrength?.score === 5
                          ? "bg-green-500"
                          : passwordStrength?.score === 4
                          ? "bg-green-400"
                          : passwordStrength?.score === 3
                          ? "bg-yellow-500"
                          : passwordStrength?.score === 2
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${(passwordStrength?.score || 0) * 20}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs whitespace-nowrap">
                    {passwordStrength?.label}
                  </span>
                </div>

                {/* Password Requirements */}
                <div className="text-xs mt-2 text-gray-600">
                  <p>Password must include:</p>
                  <ul className="list-disc pl-4">
                    <li
                      className={
                        passwordStrength?.details.length
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      At least 12 characters long
                    </li>
                    <li
                      className={
                        passwordStrength?.details.uppercase
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      Contains uppercase letter
                    </li>
                    <li
                      className={
                        passwordStrength?.details.lowercase
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      Contains lowercase letter
                    </li>
                    <li
                      className={
                        passwordStrength?.details.numbers
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      Contains number
                    </li>
                    <li
                      className={
                        passwordStrength?.details.specialChars
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      Contains special character
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          {authError && (
            <div className="text-red-500 text-sm mb-4 text-center mt-20">
              {authError}
            </div>
          )}
          <div className="text-[#9397B3] mt-14 flex items-center flex-col justify-center">
            <span className="text-sm text-[#9397B3] font-extralight mt-2 space-x-1">
              <span>Already have an account?</span>
              <Link to="/signin" className="text-[#3038E5] hover:underline">
                Sign In
              </Link>
            </span>
            <button
              type="submit"
              disabled={!isSignupFormValid}
              className={`
                ${
                  isSignupFormValid
                    ? "bg-[#3038E5] text-white"
                    : "bg-[#D9E0F6]/50 text-[#A5A7B3]/40"
                }
                mt-4 px-6 py-4 sm:px-8 sm:py-3 text-sm sm:text-base font-extraLight
              `}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Signup;
