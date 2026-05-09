import Link from "next/link";

const variants = {
  primary:
    "bg-[var(--color-brand-accent-green)] font-normal rounded-xl border-1 border-[var(--color-brand-accent-green)] text-white py-2 hover:cursor-pointer hover:bg-[var(--color-brand-green)]",
  secondary:
    "bg-[var(--color-brand-secondary)] rounded-xl border-1 border-[var(--color-brand-gold)] hover:cursor-pointer hover:bg-[var(--color-brand-gold)] hover:text-[var(--color-bg-base)]",
  ghost:
    "text-[var(--color-text-primary)] border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] hover:bg-[var(--color-bg-secondary)] border-2 rounded-xl hover:cursor-pointer",
  danger:
    "hover:opacity-90 text-white bg-[var(--color-error)] rounded-xl hover:cursor-pointer",
} as const;

type Variant = keyof typeof variants;

interface ButtonProps<T extends SVGElement = SVGSVGElement> extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  text: string;
  icon?: React.ReactElement<React.SVGProps<T>>;
  className?: string;
  link: string
}

export default function Button<T extends SVGElement = SVGElement>({
  text,
  variant = "primary",
  className = "",
  type = "button",
  icon,
  link,
  ...props
}: ButtonProps<T>) {
  return (
    <button
      className={`relative mt-2 font-medium py-2 text-sm transition-all duration-200 disabled:opacity-50 ${variants[variant]} ${className} w-full h-fit py-2`}
      type={type}
      {...props}
    >
      <Link href={link} className="flex flex-row items-center justify-center gap-3">
        {icon}
        <p>{text}</p>
      </Link>
    </button>
  );
}
