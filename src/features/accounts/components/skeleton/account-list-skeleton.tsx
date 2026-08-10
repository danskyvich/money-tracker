import Skeleton from "@/components/layout/skeleton/skeleton-file"

export default function AccountListSkeleton() {
    return (
      <div className="flex flex-col h-80dvh xl:h-full w-full rounded-lg gap-5 p-5">
        <div className="flex w-[60%] h-full gap-5">
          <Skeleton className="flex w-20 h-full" />
          <Skeleton className="flex w-20 h-full" />
          <Skeleton className="flex w-20 h-full" />
        </div>
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
      </div>
    );
}