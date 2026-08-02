import AccountListSkeleton from "@/feature/accounts/components/account-list-modal";

export default function Loading() {
    return(
        <div className="flex gap-4">
            <AccountListSkeleton/>
        </div>
    )
}