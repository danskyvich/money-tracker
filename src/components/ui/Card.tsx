import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface CardProps {
  header?: React.ReactNode;
  subheader?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  link?: string;
  linkText?: string;
}

export default function Card({
  header,
  subheader,
  children,
  className,
  link,
  linkText,
}: CardProps) {
  return (
    <div
      className={`flex flex-col w-full h-full border rounded-xl shadow-xl ${className}`}
      style={{ borderColor: "var(--color-border-default)" }}
    >
      <div className="flex w-full items-center justify-center px-5 py-4 ">
        {header && (
          <div className="flex flex-1 flex-col w-full text-xl">
            <p className="text-(--color-text-primary) font-semibold">
              {header}
            </p>
            <p
              className="font-mono text-sm font-normal"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {subheader}
            </p>
          </div>
        )}

        {link && (
          <div className="hover:scale-105 transition-transform duration-300 ease-in-out inline-flex">
            <Link
              href={link}
              className="flex px-3 py-2 rounded-2xl text-[0.7rem] font-semibold text-white items-center justify-center bg-(--color-brand-gold)"
            >
              <p>{linkText}</p>
              <ChevronRight size={20} />
            </Link>
          </div>
        )}
      </div>

      <hr
        className="border"
        style={{ borderColor: "var(--color-border-subtle)" }}
      />

      {children && (
        <div className="flex flex-col w-full h-full">{children}</div>
      )}
    </div>
  );
}
