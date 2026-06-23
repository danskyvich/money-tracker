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
      className={`flex gap-3 px-4 py-2 font-mono text-sm rounded-2xl ${className} ${
        isActive
          ? "rounded-2xl ring-inset bg-(--color-border-strong) duration-200 transition-all"
          : "hover:bg-(--color-border-subtle) hover:cursor-pointer"
      }`}
    >
      <div>{icon}</div>
      <p className="hidden min-[1700px]:block">{label}</p>
    </Link>
  );
}