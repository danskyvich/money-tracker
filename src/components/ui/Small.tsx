interface SmallProps {
    children: React.ReactNode,
    status: "increasing" | "decreasing",
    className?: string

}

const statusVariants = {
    increasing: "bg-green-500 border border-green-500",
    decreasing: ""
}

export default function Small({children, status, className}: SmallProps) {
    return (
      <div
        className={`flex rounded-xl px-3  items-center justify-center w-fit h-fit ${statusVariants[status]} ${className}`}
      >
        {children}
      </div>
    );
}