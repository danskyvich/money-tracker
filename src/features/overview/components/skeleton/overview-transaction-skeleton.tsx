import Skeleton from "../../../../components/layout/skeleton/skeleton-file";

export default function OverviewTransactionSkeleton() {

    return (
      <div className="flex flex-col relative w-full h-fit gap-5 px-5">
        <Skeleton className="flex flex-1 w-full h-full" />
        <Skeleton className="flex flex-1 w-full h-full" />
        <Skeleton className="flex flex-1 w-full h-full" />
        <Skeleton className="flex flex-1 w-full h-full" />
      </div>
    );
}