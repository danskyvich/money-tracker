import Link from "next/link"

interface SidebarItemProps {
  icon: React.ReactNode,
  label: string,
  className?: string,
  path: string,
  isActive: boolean,
}

export const SidebarItem = ({icon, label, className, path, isActive}: SidebarItemProps) => {
  return (
    <Link
      href={path}
      className={`flex gap-3 px-2 py-3 font-mono text-sm hover:bg-[var(--color-border-subtle)] hover:cursor-pointer rounded-2xl ${className} ${
        isActive
          ? "rounded-2xl border-2 border-[var(--color-border-strong)] hover:bg-transparent"
          : ""
      }`}
    >
      {icon}
      <p>{label}</p>
    </Link>
  );
}