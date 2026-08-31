import Skeleton from "@/components/layout/skeleton/skeleton-file";

export default function CategoriesSkeleton() {
    return (
      <div className="flex flex-col p-5 w-full h-full gap-5">
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
        <Skeleton className="flex w-full h-full" />
      </div>
    );
}