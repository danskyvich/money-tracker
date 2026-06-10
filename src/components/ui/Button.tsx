import Link from "next/link";

const variants = {
  primary:
    "bg-(--color-brand-accent-green) font-bold rounded-xl border border-(--color-brand-accent-green) text-white py-2 hover:cursor-pointer hover:bg-(--color-brand-green)",
  secondary:
    "bg-(--color-brand-secondary) rounded-xl border border-(--color-brand-gold) hover:cursor-pointer hover:bg-(--color-brand-gold) hover:text-(--color-bg-base)",
  ghost:
    "text-(--color-text-primary) border-(--color-border-strong) bg-transparent hover:bg-(--color-brand-green) border rounded-xl hover:cursor-pointer",
  danger:
    "hover:opacity-90 text-white bg-(--color-error) rounded-xl hover:cursor-pointer",
} as const;

type Variant = keyof typeof variants;

interface ButtonProps<T extends SVGElement = SVGSVGElement> extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  text?: string;
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
