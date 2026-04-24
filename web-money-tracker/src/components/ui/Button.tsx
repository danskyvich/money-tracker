import { ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "bg-[var(--color-brand-green)] font-normal rounded-xl border border-[var(--color-brand-accent-green)] text-white py-2 hover:cursor-pointer",
  secondary:
    "bg-[var(--color-brand-secondary)] rounded-xl border-2 border-[var(--color-brand-secondary)] hover:cursor-pointer",
  ghost:
    "text-[var(--color-text-primary)] border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] hover:bg-[var(--color-bg-secondary)] border-2 rounded-xl hover:cursor-pointer",
  danger:
    "hover:opacity-90 text-white bg-[var(--color-error)] rounded-xl hover:cursor-pointer",
} as const;

type Variant = keyof typeof variants;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  text: string;
}

export default function Button({
  text,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium px-4 py-2 text-sm transition-all duration-200 disabled:opacity-50 ${variants[variant]} ${className} w-full h-fit py-2`}
      type={type}
      {...props}
    >
      {text}
    </button>
  );
}
