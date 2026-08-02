import OverviewTransactionSkeleton from "@/components/layout/skeleton/overview-transaction-skeleton";
import QuickActionsSkeleton from "@/components/layout/skeleton/quick-action-skeleton";
import SnippetSkeleton from "@/components/layout/skeleton/snippet-skeleton";

export default function Loading() {
    return(
        <div className="flex gap-4">
            <SnippetSkeleton/>
            <SnippetSkeleton/>
            <QuickActionsSkeleton/>
            <OverviewTransactionSkeleton/>
        </div>
    )
}