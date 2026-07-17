export default function Spinner() {
    return(
        <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-4 border-(--color-text-primary) animate-spin rounded-full border-t-transparent"/>
        </div>
    )
}