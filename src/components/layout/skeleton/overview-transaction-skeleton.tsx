import Skeleton from "./skeleton-file";

export default function OverviewTransactionSkeleton() {

    return (
      <div className="flex relative w-full h-fit flex-col overflow-auto">
        <div className="flex flex-col w-full h-full">
          <div className="flex w-full h-17 justify-between border-b border-(--color-border-subtle) px-5 py-3 cursor-pointer">
            <div className="flex flex-col w-[65%]">
              <Skeleton className="w-full" />
              <Skeleton className="w-full" />
            </div>

            <div className="flex w-[35%] h-full items-center justify-end">
              <Skeleton className="flex w-full" />
            </div>
          </div>
          <div className="flex w-full h-17 justify-between border-b border-(--color-border-subtle) px-5 py-3 cursor-pointer">
            <div className="flex flex-col w-[65%]">
              <Skeleton className="w-full" />
              <Skeleton className="w-full" />
            </div>

            <div className="flex w-[35%] h-full items-center justify-end">
              <Skeleton className="flex w-full" />
            </div>
          </div>
          <div className="flex w-full h-17 justify-between border-b border-(--color-border-subtle) px-5 py-3 cursor-pointer">
            <div className="flex flex-col w-[65%]">
              <Skeleton className="w-full" />
              <Skeleton className="w-full" />
            </div>

            <div className="flex w-[35%] h-full items-center justify-end">
              <Skeleton className="flex w-full" />
            </div>
          </div>
          <div className="flex w-full h-17 justify-between border-b border-(--color-border-subtle) px-5 py-3 cursor-pointer">
            <div className="flex flex-col w-[65%]">
              <Skeleton className="w-full" />
              <Skeleton className="w-full" />
            </div>

            <div className="flex w-[35%] h-full items-center justify-end">
              <Skeleton className="flex w-full" />
            </div>
          </div>
          <div className="flex w-full h-17 justify-between border-b border-(--color-border-subtle) px-5 py-3 cursor-pointer">
            <div className="flex flex-col w-[65%]">
              <Skeleton className="w-full" />
              <Skeleton className="w-full" />
            </div>

            <div className="flex w-[35%] h-full items-center justify-end">
              <Skeleton className="flex w-full" />
            </div>
          </div>
          <div className="flex w-full h-17 justify-between border-b border-(--color-border-subtle) px-5 py-3 cursor-pointer">
            <div className="flex flex-col w-[65%]">
              <Skeleton className="w-full" />
              <Skeleton className="w-full" />
            </div>

            <div className="flex w-[35%] h-full items-center justify-end">
              <Skeleton className="flex w-full" />
            </div>
          </div>
        </div>
      </div>
    );
}