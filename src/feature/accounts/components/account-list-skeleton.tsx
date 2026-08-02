import Skeleton from "../../../components/layout/skeleton/skeleton-file"

export default function AccountListSkeleton() {
    return (
      <div className="xl:flex-2 h-full xl:h-full w-[80%] border border-(--color-border-default) rounded-lg">
        <div className="flex flex-1 w-full h-fit">
          {/** Top Bar */}
          <div className="flex w-full h-fit px-5 py-2 gap-2">
            <Skeleton className="w-25 h-5" />
            <Skeleton className="w-25 h-5" />
            <Skeleton className="w-35 h-5" />
          </div>
        </div>

        {/* Accounts table */}
        <div className="flex flex-1 flex-col w-full h-full px-5">
          <div className="grid grid-cols-[repeat(4,1fr)] w-full h-fit px-5 py-1">
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>

          <div className="flex flex-col flex-3 w-full h-full gap-5 xl:h-full">
            <Skeleton className="flex flex-1 w-full h-full" />
            <Skeleton className="flex flex-1 w-full h-full" />
            <Skeleton className="flex flex-1 w-full h-full" />
            <Skeleton className="flex flex-1 w-full h-full" />
            <Skeleton className="flex flex-1 w-full h-full" />
            <Skeleton className="flex flex-1 w-full h-full" />
            <Skeleton className="flex flex-1 w-full h-full" />
            <Skeleton className="flex flex-1 w-full h-full" />
            <Skeleton className="flex flex-1 w-full h-full" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-1 h-fit justify-between w-full px-5 py-2">
          <div className="flex w-full items-center gap-2">
            <Skeleton className="flex h-5 w-20" />
            <Skeleton className="flex h-5 w-5" />
            <Skeleton className="flex h-5 w-23" />
          </div>

          <div className="flex w-fit h-full gap-2 items-center justify-end">
            <Skeleton className="flex h-5 w-15" />
            <Skeleton className="flex h-5 w-25" />
            <Skeleton className="flex h-5 w-15" />
          </div>
        </div>
      </div>
    );
}