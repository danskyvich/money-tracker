import React from "react";
import { UseFormRegister, FieldError, Path, FieldValues} from "react-hook-form";
interface InputProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  label?: string;
  id: string;
  type?: string;
  icon: React.ReactNode;
  leadingIcon?: React.ReactNode;
  register: UseFormRegister<T>,
  name: Path<T>;
  error?: FieldError;
  className?: string;
}

export default function Input<T extends FieldValues>({
  placeholder,
  label,
  id,
  type = "text",
  icon,
  leadingIcon,
  error,
  register,
  name,
  className,
}: InputProps<T>) {

  return (
    <div className={`flex flex-col m-2 ${className || ""}`}>
      <label
        htmlFor={id}
        className="font-mono block mb-1 text-[var(--color-text-primary)]"
      >
        {label}
      </label>
      <div className="flex relative items-center">
        {" "}
        {icon && (
          <div className="absolute left-3 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`rounded-xl w-full bg-(--color-bg-secondary) pr-2 py-4 border-b border-[var(--color-border-strong)] text-sm text-gray-400 placeholder:text-gray-400 focus:outline-1 focus:outline-[var(--color-border-strong)] focus:border-gray-900 transition-colors duration-200 ${icon ? "pl-10" : "pl-4"} text-[var(--color-text-secondary)]`}
          placeholder={placeholder}
          id={id}
          type={type}
          {...register(name)}
        />
        {leadingIcon && (
          <div className="absolute right-3 text-gray-400 hover:cursor-pointer">
            {leadingIcon}
          </div>
        )}
      </div>
      {error && (
        <p
          style={{
            color: "red",
            fontSize: "0.8rem",
            alignItems: "start",
            width: "100%",
          }}
        >
          {error.message}
        </p>
      )}
    </div>
  );
}