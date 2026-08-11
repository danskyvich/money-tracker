import Skeleton from "@/components/layout/skeleton/skeleton-file";

export default function AccountCategoryListSkeleton() {
    return (
      <div className="flex flex-col w-full xl:h-full p-5 gap-5">
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
      </div>
    );
}