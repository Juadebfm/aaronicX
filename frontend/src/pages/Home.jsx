import React from "react";
import { ChevronRight, KeyRound, User } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { useAuthContext } from "../context/authcontext";

const Login = () => {
  const { formState, updateFormField, isFormValid, login, authError } =
    useAuthContext();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormField("login", name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(); // Actually call the login method from AuthContext
  };

  const loginFormFields = ["username", "password"];
  const isLoginFormValid = isFormValid("login", loginFormFields);

  return (
    <section className="h-max px-[30px] lg:px-12 relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 justify-center lg:justify-start items-center fixed top-0 left-0 bg-white w-full lg:w-screen py-5 lg:py-7 px-12">
        <img
          src="/dagcoin.png"
          alt="DagCoin Logo"
          className="w-[120px] h-[56px]"
        />
      </div>
      <div className="flex flex-col items-center justify-center py-32 min-h-screen">
        <span className="text-[#1E2240] font-extralight uppercase pt-2">
          Login
        </span>
        <img
          src="/login-dagcoin.png"
          alt="Login Illustration"
          className="w-[234px] lg:w-[270px] h-auto mt-10"
        />
        <form
          onSubmit={handleSubmit}
          className="text-[#9397B3] w-full lg:w-1/3"
        >
          <div className="border-t py-6">
            <label
              htmlFor="username"
              className="uppercase text-[12px] tracking-widest"
            >
              username
            </label>
            <div className="flex items-center justify-between">
              <input
                id="username"
                name="username"
                type="text"
                value={formState.login?.username || ""}
                onChange={handleInputChange}
                placeholder="Type here"
                className="w-full ring-0 focus:outline-none active:outline-none py-2 bg-transparent focus:bg-transparent"
              />
              <User />
            </div>
          </div>
          <div className="border-y py-6">
            <label
              htmlFor="password"
              className="uppercase text-[12px] tracking-widest"
            >
              password
            </label>
            <div className="flex items-center justify-between">
              <input
                id="password"
                name="password"
                type="password"
                value={formState.login?.password || ""}
                onChange={handleInputChange}
                placeholder="Type here"
                className="w-full ring-0 focus:outline-none active:outline-none py-2 bg-transparent focus:bg-transparent"
              />
              <KeyRound />
            </div>
          </div>
          {authError && (
            <div className="text-red-500 font-bold capitalize text-sm mb-4 text-center mt-14">
              {authError}
            </div>
          )}

          <div className="text-[#9397B3] mt-14 flex items-center flex-col justify-center">
            <span className="flex items-center justify-center gap-1">
              <span className="text-sm text-[#9397B3] font-extralight">
                Forgot password?
              </span>
              <ChevronRight className="text-[#3038E5] font-bold" size={18} />
            </span>
            <span className="text-sm text-[#9397B3] font-extralight mt-2 space-x-1">
              <span>Don't have an account?</span>
              <Link to="/signup" className="text-[#3038E5] hover:underline">
                Sign Up
              </Link>
            </span>

            <button
              type="submit"
              disabled={!isLoginFormValid}
              className={`
                ${
                  isLoginFormValid
                    ? "bg-[#3038E5] text-white"
                    : "bg-[#D9E0F6]/50 text-[#A5A7B3]/40"
                }
                mt-4 px-6 py-4 sm:px-8 sm:py-3 text-sm sm:text-base font-extraLight
              `}
            >
              Login Now
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
