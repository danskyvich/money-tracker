import Skeleton from "@/components/layout/skeleton/skeleton-file";

export default function EditAccountModalSkeleton() {
  return (
    <div className="flex flex-col h-70 w-full gap-5">
      <div className="flex w-full h-full justify-between gap-5 items-center">
        <Skeleton className="flex flex-1 w-full h-full" />
        <Skeleton className="flex flex-4 w-full h-full" />
        <Skeleton className="flex flex-1 w-full h-full" />
      </div>
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
