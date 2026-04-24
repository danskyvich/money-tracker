import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  label: string;
  id: string;
  type: string;
  icon: React.ReactNode;
}

export default function Input({
  placeholder,
  label,
  id,
  type = "text",
  icon,
}: InputProps) {
  return (
    <div className="m-5">
      <label htmlFor={id} className="font-mono block mb-1 text-[var(--color-text-primary)]">
        {label}
      </label>
      <div className="relative flex items-center">
        {" "}
        {/* ✅ icon positions relative to this */}
        {icon && (
          <div className="absolute left-3 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`rounded-xl w-full bg-(--color-bg-secondary) pr-2 py-5 border-b border-[var(--color-border-strong)] text-sm text-gray-400 placeholder:text-gray-400 focus:outline-1 focus:outline-[var(--color-border-strong)] focus:border-gray-900 transition-colors duration-200 ${icon ? "pl-10" : "pl-4"} text-[var(--color-text-secondary)]`}
          placeholder={placeholder}
          name={id}
          id={id}
          type={type}
        />
      </div>
    </div>
  );
}