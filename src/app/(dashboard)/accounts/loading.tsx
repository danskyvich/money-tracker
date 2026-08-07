import AccountListSkeleton from "@/features/accounts/components/skeleton/account-list-modal-skeleton";

export default function Loading() {
    return(
        <div className="flex gap-4">
            <AccountListSkeleton/>
        </div>
    )
}