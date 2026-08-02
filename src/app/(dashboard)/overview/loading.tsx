import OverviewTransactionSkeleton from "@/features/overview/components/skeleton/overview-transaction-skeleton";
import QuickActionsSkeleton from "@/features/overview/components/skeleton/quick-action-skeleton";
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