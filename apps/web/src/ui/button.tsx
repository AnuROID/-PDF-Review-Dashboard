"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, className = "", ...props }) => {
  return (
    <button
      {...props}
      className={`
        px-6 py-3 
        rounded-2xl 
        bg-gradient-to-r from-sky-500 to-indigo-600 
        text-white font-semibold 
        hover:from-sky-400 hover:to-indigo-500 
        active:scale-95 transition-transform duration-150 
        shadow-lg 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
