import Skeleton from "@/components/layout/skeleton/skeleton-file";

export default function TransactionListSkeleton() {
  return (
    <div className="flex flex-col h-full w-full gap-5 p-5">
      <div className="flex flex-10 flex-col h-full gap-5">
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
      </div>
    </div>
  );
}
