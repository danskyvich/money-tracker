import { LockIcon } from "lucide-react";

export default function ChangePassword() {
    return(
        <div className="flex flex-col items-center justify-center h-full">

            <div className="flex p-5 w-fit bg-(--color-bg-base) rounded-lg border border-(--color-border-default) shadow-md gap-3">
                <div className="flex w-full justify-between items-center gap-5">
                    <LockIcon size={20}/>
                    <p className="text-xl font-bold font-display">Change your password</p>
                </div>

                
            </div>

        </div>
    )
}