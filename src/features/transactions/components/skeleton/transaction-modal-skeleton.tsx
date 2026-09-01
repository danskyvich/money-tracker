import Skeleton from "@/components/layout/skeleton/skeleton-file";

export default function TransactionModalSkeleton() {
    return (
      <div className="flex flex-col w-100 h-110 mx-5 sm:mx-0 sm:w-110 gap-5 p-5 bg-(--color-bg-secondary) md:w-125 lg:w-140 xl:w-160 border border-(--color-border-default) rounded-lg">
        <div className="flex w-full h-full justify-between gap-5 items-center">
          <Skeleton className="flex flex-1 w-full h-full" />
          <Skeleton className="flex flex-4 w-full h-full" />
          <Skeleton className="flex flex-1 w-full h-full" />
        </div>
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <div className="flex w-full h-full gap-5">
          <Skeleton className="flex flex-1 w-full h-full" />
          <Skeleton className="flex flex-1 w-full h-full" />
        </div>
      </div>
    );
}