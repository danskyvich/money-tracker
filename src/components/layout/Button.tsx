import Link from "next/link";

const variants = {
  primary:
    "bg-(--color-brand-green-accent) font-bold rounded-xl ring-inset ring ring-(--color-brand-green-accent) text-white py-2 hover:cursor-pointer hover:bg-(--color-brand-green)",
  secondary:
    "bg-transparent rounded-xl ring ring-inset ring-(--color-brand-gold) hover:cursor-pointer hover:bg-(--color-brand-gold) hover:text-(--color-bg-base)",
  ghost:
    "text-(--color-text-primary) ring-inset ring ring-(--color-brand-green-accent) bg-transparent hover:bg-(--color-brand-green) hover:text-white rounded-xl hover:cursor-pointer",
  danger:
    "hover:opacity-90 text-white bg-(--color-error) rounded-xl hover:cursor-pointer",
} as const;

type Variant = keyof typeof variants;

interface ButtonProps<T extends SVGElement = SVGSVGElement> extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  text?: string;
  icon?: React.ReactElement<React.SVGProps<T>>;
  className?: string;
  link?: string
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
      className={`flex w-full font-medium py-2 text-sm items-center justify-center transition-all duration-200 disabled:opacity-50 ${variants[variant]} ${className} h-fit py-2`}
      type={type}
      {...props}
    >
      {icon}
      <Link
        href={link ?? ""}
        className="flex flex-row gap-3"
      >
        {text}
      </Link>
    </button>
  );
}
