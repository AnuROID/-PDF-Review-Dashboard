"use client";

import React, { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode; // make children required
  className?: string;
};

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button {...props} className={`${className} focus:outline-none`}>
      {children}
    </button>
  );
}
