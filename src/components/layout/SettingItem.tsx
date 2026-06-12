export default function SettingItem({label, children, icon}:{label: string, children: React.ReactNode, icon?: React.ReactNode} ) {
    return (
      <div className="flex items-center justify-center w-full h-fit py-1">
        <p className="flex text-[0.95rem] font-mono text-(--color-text-primary) items-center justify-center gap-2">
          {label}
          <span className="flex hover:cursor-pointer text-(--color-text-secondary) hover:text-white transition-all duration-100">{icon}</span>
        </p>

        <div className="flex flex-auto w-auto h-fit" />
        {children}
      </div>
    );
}