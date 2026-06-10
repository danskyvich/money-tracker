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
      className={`flex gap-3 p-4 font-mono text-sm hover:bg-(--color-border-subtle) hover:cursor-pointer rounded-2xl ${className} ${
        isActive
          ? "rounded-2xl ring-inset ring-2 ring-(--color-border-strong) hover:bg-transparent"
          : ""
      }`}
    >
      {icon}
      <p>{label}</p>
    </Link>
  );
}