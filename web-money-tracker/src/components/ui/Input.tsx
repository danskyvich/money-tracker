import React from "react";
import "@/app/globals.css"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>{
  placeholder: string,
  label: string,
  id: string,
  type: string,
}

export default function Input({placeholder, label, id, type="text"}: InputProps) {
    return (
      <div className="group relative">
        <label htmlFor={id} className="font-mono">{label}</label>
        <input
          className="bg-amber-200 w-full border-b border-gray-300 pb-2 text-sm text-gray-400 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-200"
          placeholder={placeholder}
          name={id}
          type={type}
        />
      </div>
    );
}