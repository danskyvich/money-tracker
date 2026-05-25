export const SidebarItem = ({icon, label, path}: {icon: React.ReactNode, label: string, path: string}) => {
  return (
    <div 
      className={`flex w-full h-fit gap-auto items-center py-2 px-5 gap-3 rounded-2xl hover:cursor-pointer hover:bg-[var(--color-border-subtle)]`}
      >
        <div className="flex">{icon}</div>
        <p className="flex font-mono text-[0.9rem] ">{label}</p>
    </div>
  );
}