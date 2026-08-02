import Skeleton from "./skeleton-file";

export default function SnippetSkeleton() {
    return (
      <div className="flex flex-col items-center p-4 w-full h-fit border border-(--color-border-default) rounded-xl">
        <div className="flex justify-between w-full">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-14" />
        </div>

        <div className="flex flex-auto w-auto h-full" />

        <Skeleton className="h-7 w-full" />

        <div className="flex w-full items-center mt-1">
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
}