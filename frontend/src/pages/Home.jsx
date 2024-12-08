import React from "react";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="bg-[#3038E5] h-screen text-white flex flex-col items-center justify-center relative overflow-x-hidden">
      {/* Circular Image Container */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full lg:w-[1300px] h-full lg:h-[900px]">
        <img
          src="/circular.png"
          alt="Circular background"
          className="hidden lg:block w-full h-full"
        />
        {/* Wallet Image Centered */}
        <img
          src="/wallet.png"
          alt="Wallet"
          className="absolute top-32 sm:top-40 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] sm:w-[211px] sm:h-[212px]"
        />
      </div>

      {/* Welcome Text and Button */}
      <div className="z-40 mt-40 sm:mt-56 flex flex-col items-center justify-center text-center">
        <span className="capitalize text-[#9DA3F9] text-[16px] sm:text-[20px] font-extralight">
          Welcome to your digital wallet
        </span>
        <div className="mt-6 sm:mt-8">
          <Link to="/login">
            <Button
              btnClass="bg-[#3038E5] text-white hover:bg-[#2027C6]/90 shadow-gray-400/50 mt-4 shadow-md sm:px-8 sm:py-3 text-sm sm:text-base"
              btnText="Login"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
