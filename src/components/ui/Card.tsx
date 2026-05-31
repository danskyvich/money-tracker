import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface CardProps {
    header?: React.ReactNode,
    subheader?: React.ReactNode
    children?: React.ReactNode,
    footer?: React.ReactNode,
    classname?: string,
    link?: string,
    linkText?: string,
}

export default function Card({header, subheader, children, classname, link, linkText}: CardProps){
    return (
      <div
        className={`flex flex-col w-full h-full border-(--color-border-default) border rounded-xl p-6 shadow-xl ${classname}`}
      >
        <div className="flex w-full h-fit items-center justify-center mb-2">
          {header && (
            <div className="flex flex-1 flex-col w-full font-normal font-semibold text-xl">
              <p>{header}</p>
              <p className="font-mono text-sm font-light my-1 text-(--color-text-secondary)">
                {subheader}
              </p>
            </div>
          )}

          {link && (
            <div className="block hover:scale-105 transition-transform duration-300 ease-in-out">
              <Link
                href={link}
                style={{ backgroundColor: "var(--color-border-strong)" }}
                className="flex px-3 py-2 rounded-2xl text-[var(--color-text-primary)] text-[0.7rem] items-center justify-center"
              >
                <p>{linkText}</p>
                <ChevronRight size={20} />
              </Link>
            </div>
          )}
        </div>

        <hr className="border border-(--color-border-subtle) my-2" />

        {children && (
          <div className="flex flex-col w-full h-full">{children}</div>
        )}

        {}
      </div>
    );
}