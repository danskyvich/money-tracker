import Skeleton from "@/components/layout/skeleton/skeleton-file";

export default function Loading() {
    return (
      <div className="flex w-full h-full flex-col p-5 gap-5">
        <Skeleton className="flex w-35 h-15" />
        <div className="flex flex-col gap-5 w-full h-full">
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