import Skeleton from "../../../components/layout/skeleton/skeleton-file";

export default function AccountListModalSkeleton() {
    return (
      <div className="flex flex-col gap-5 xl:w-275 md:w-250 w-150 h-165 bg-(--color-bg-secondary) p-5 border border-(--color-border-default) rounded-lg">
        {/* Header */}
        <div className="flex w-full h-fit items-center justify-between px-5 py-2">
          <Skeleton className="flex w-5 h-full" />
          <Skeleton className="flex w-45 h-full" />
          <Skeleton className="flex w-5 h-full" />
        </div>

        {/* Filter bar */}
        <div className="flex w-full h-fit px-5 pt-3 pb-1">
          <Skeleton className="w-20" />
          <Skeleton className="w-20" />
        </div>

        <div className="flex w-full gap-5">
          <Skeleton className="flex w-full h-5" />
          <Skeleton className="flex w-full h-5" />
          <Skeleton className="flex w-full h-5" />
          <Skeleton className="flex w-full h-5" />
          <Skeleton className="flex w-full h-5" />
          <Skeleton className="flex w-full h-5" />
        </div>

        <div className="flex flex-col w-full h-full gap-5">
          <Skeleton className="flex flex-1 w-full h-full" />
          <Skeleton className="flex flex-1 w-full h-full" />
          <Skeleton className="flex flex-1 w-full h-full" />
          <Skeleton className="flex flex-1 w-full h-full" />
        </div>
      </div>
    );
}