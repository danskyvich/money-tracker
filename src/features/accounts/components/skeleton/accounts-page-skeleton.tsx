import Skeleton from "@/components/layout/skeleton/skeleton-file";

export default function AccountsPageSkeleton() {
  return (
    <div className="flex flex-col h-full w-full gap-5 p-5">
      <div className="flex flex-1 w-[60%] xl:h-full gap-5">
        <Skeleton className="flex w-20 h-full" />
        <Skeleton className="flex w-35 h-full" />
        <Skeleton className="flex w-20 h-full" />
      </div>
      <div className="flex flex-10 flex-col h-[90%] xl:h-full gap-5">
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
      </div>
    </div>
  );
}
