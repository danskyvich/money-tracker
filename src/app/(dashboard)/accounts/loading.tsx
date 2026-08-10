import Skeleton from "@/components/layout/skeleton/skeleton-file";
import AccountListSkeleton from "@/features/accounts/components/skeleton/account-list-modal-skeleton";

export default function Loading() {
    return (
      <div className="flex w-full h-full gap-5">
        <Skeleton className="flex w-35 h-15" />
        <div className="grid grid-cols-[1fr_1fr] w-full h-full gap-x-5">
          <div className="flex flex-col w-full h-full gap-5">
            <Skeleton className="flex w-full h-20" />
            <Skeleton className="flex w-full h-20" />
            <Skeleton className="flex w-full h-20" />
            <Skeleton className="flex w-full h-20" />
            <Skeleton className="flex w-full h-20" />
          </div>
          <div className="flex flex-col w-full h-full gap-5">
            <Skeleton className="flex w-full h-20" />
            <Skeleton className="flex w-full h-20" />
            <Skeleton className="flex w-full h-20" />
            <Skeleton className="flex w-full h-20" />
            <Skeleton className="flex w-full h-20" />
          </div>
        </div>
      </div>
    );
}