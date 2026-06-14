import React from "react";

export default function SettingItem({
  label,
  children,
  icon,
  tooltip,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  tooltip?: string;
}) {
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <div className="flex items-center justify-center w-full h-fit py-1 relative">
      <p className="flex text-[0.95rem] font-normal text-(--color-text-primary) items-center justify-center gap-2">
        {label}
        <span
          className="flex hover:cursor-pointer text-(--color-text-secondary) hover:text-gray-600 transition-all duration-100"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {icon}
        </span>
      </p>

      {showTooltip && tooltip && (
        <div className="absolute bottom-full left-0 px-3 py-2 bg-(--color-bg-subtle) border border-(--color-border-default) rounded-lg text-sm whitespace-nowrap z-50 shadow-md">
          {tooltip}
        </div>
      )}

      <div className="flex flex-auto w-auto h-fit" />
      {children}
    </div>
  );
}
