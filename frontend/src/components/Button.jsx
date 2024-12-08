import React from "react";

const Button = ({ btnText, btnClass }) => {
  return (
    <div
      className={`${btnClass} py-4 px-6 w-[370px] h-[53px] text-[19px] cursor-pointer duration-150 transition-all ease-linear flex items-center justify-center rounded-2xl`}
    >
      {btnText}
    </div>
  );
};

export default Button;
