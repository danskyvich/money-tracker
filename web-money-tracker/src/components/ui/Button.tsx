const variants = {
  primary:
    "bg-[var(--color-brand-primary)] rounded-xl border-2 border-[var(--color-brand-primary)] text-white",
  secondary:
    "bg-[var(--color-brand-secondary)] rounded-xl border-2 border-[var(--color-brand-secondary)]",
  ghost:
    "text-[var(--color-text-primary)] border-[var(--color-brand-secondary)] border-2 rounded-xl",
  danger: "hover:opacity-90 text-white bg-[var(--color-error)] rounded-xl",
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
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium px-4 py-2 text-sm transition-all duration-200 disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {text}
    </button>
  );
}
