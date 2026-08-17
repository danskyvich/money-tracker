import Skeleton from "./skeleton-file";

export default function SnippetSkeleton() {
    return (
      <div className="flex flex-col h-31.5 w-full flex-1 gap-3 border border-(--color-border-default) rounded-xl px-5 py-3">
        <Skeleton className="flex flex-1 w-full h-full" />
        <Skeleton className="flex flex-1 w-full h-full" />
        <div className="flex w-full h-[10%] gap-5">
          <Skeleton className="flex flex-1 w-full h-full" />
          <Skeleton className="flex flex-1 w-full h-full" />
        </div>
      </div>
    );
}