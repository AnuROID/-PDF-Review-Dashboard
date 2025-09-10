"use client";

import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`
        w-full px-4 py-3 
        border border-gray-700 
        rounded-xl 
        bg-gray-900 text-gray-100 
        placeholder-gray-400 
        focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 
        transition-all duration-200 
        shadow-md
        ${className}
      `}
    />
  );
};

export default Input;
