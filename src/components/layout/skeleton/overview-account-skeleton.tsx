import Skeleton from "./skeleton-file";

export default function OverviewAccountsSkeleton() {
    return (
      <div className="flex flex-col w-full h-full gap-5 p-5">
        <Skeleton className="w-full h-15" />
        <Skeleton className="w-full h-15" />
        <Skeleton className="w-full h-15" />
        <Skeleton className="w-full h-15" />
      </div>
    );
}