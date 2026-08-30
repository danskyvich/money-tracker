import Skeleton from "../../../../components/layout/skeleton/skeleton-file";

export default function AccountListModalSkeleton() {
    return (
      <div className="flex flex-col gap-5 w-full h-full bg-(--color-bg-secondary) p-5">
        <div className="flex flex-col w-full h-full gap-5">
          <Skeleton className="flex flex-1 w-full h-full" />
          <Skeleton className="flex flex-1 w-full h-full" />
          <Skeleton className="flex flex-1 w-full h-full" />
          <Skeleton className="flex flex-1 w-full h-full" />
          <Skeleton className="flex flex-1 w-full h-full" />
          <Skeleton className="flex flex-1 w-full h-full" />
        </div>
      </div>
    );
}