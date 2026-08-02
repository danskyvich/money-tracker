export default function Skeleton({className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
    return(
        <div className={`animate-pulse rounded-md bg-(--color-bg-subtle) ${className}`}
            {...props}
        />
    )
}