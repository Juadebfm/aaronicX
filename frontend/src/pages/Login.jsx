import React from "react";
import { ChevronRight, KeyRound, User } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { useAuthContext } from "../context/authcontext";

const Login = () => {
  const { formState, updateFormField, isFormValid } = useAuthContext();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormField("login", name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement login logic
    console.log("Login submitted", formState.login);
  };

  const loginFormFields = ["username", "password"];
  const isLoginFormValid = isFormValid("login", loginFormFields);

  return (
    <section className="min-h-screen p-12">
      <div className="flex items-center justify-center">
        <img
          src="/dagcoin.png"
          alt="DagCoin Logo"
          className="w-[173px] h-auto"
        />
      </div>
      <div className="flex flex-col items-center justify-center mt-10">
        <span className="text-[#1E2240] font-extralight uppercase">Login</span>
        <img
          src="/login-dagcoin.png"
          alt="Login Illustration"
          className="w-[234px] lg:w-[334px] h-auto mt-10"
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

          <div className="text-[#9397B3] mt-20 flex items-center flex-col justify-center">
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
            <Button
              type="submit"
              btnText="Login Now"
              disabled={!isLoginFormValid}
              btnClass={`
                ${
                  isLoginFormValid
                    ? "bg-[#3038E5] text-white"
                    : "bg-[#D9E0F6]/50 text-[#A5A7B3]/40"
                }
                mt-4 px-6 py-4 sm:px-8 sm:py-3 text-sm sm:text-base font-extraLight
              `}
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
