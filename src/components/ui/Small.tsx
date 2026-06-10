interface SmallProps {
    children: React.ReactNode,
    status: "increasing" | "decreasing",
    className?: string

}

const statusVariants = {
    increasing: "bg-(--color-brand-green) border-2 border-(--color-brand-green)",
    decreasing: "bg-(--color-red-400) border-2 border-(--color-red-400)"
}

export default function Small({children, status, className}: SmallProps) {
    return (
      <div
        className={`flex rounded-xl px-3 items-center justify-center w-fit h-fit text-white font-semibold ${statusVariants[status]} ${className}`}
      >
        {children}
      </div>
    );
}