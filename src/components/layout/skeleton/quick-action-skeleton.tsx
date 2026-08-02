import Skeleton from "./skeleton-file"

export default function QuickActionsSkeleton() {
  return (
    <div className="flex flex-col flex-2  rounded-lg shadow-md w-full h-full p-5 gap-2">
      <Skeleton className="w-full flex" />
      <div className="flex w-full h-full gap-5 flex-col md:flex-row">
        <div className="flex flex-1 rounded-lg shadow-md items-center justify-center gap-1 py-2">
          <Skeleton className="w-5 h-5" />
          <Skeleton className="flex w-full h-10" />
        </div>

        <div className="flex flex-1 rounded-lg shadow-md items-center justify-center gap-1 py-2">
          <Skeleton className="w-5 h-5" />
          <Skeleton className="flex w-full h-10" />
        </div>
      </div>
    </div>
  );
}
