import { User } from "@supabase/supabase-js";
import { LockIcon, VerifiedIcon, X } from "lucide-react";

interface ProfileHeader {
    user: User | null | undefined;
    mfaActive: boolean;
}

export default function ProfileHeader({user, mfaActive}:ProfileHeader) {
    return (
      <div className="flex flex-col md:flex-row flex-0 w-full h-fit gap-0 md:gap-5 p-3 md:p-5 rounded-xl bg-linear-to-r mb-2 from-slate-800 to-emerald-600 items-center justify-between">
        {/* User information */}
        <div className="flex flex-col w-full h-fit items-center justify-center md:items-start">
          <p className="text-[0.85rem] md:text-lg font-mono text-white">
            <span>{user?.email}</span>
          </p>
          <div className="text-[0.75rem] text-white">
            <p className="pb-5">
              Created on{" "}
              {new Date(user?.created_at as string).toLocaleDateString()},{" "}
              {new Date(user?.created_at as string).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* MFA status */}
        <div className="flex text-white w-fit h-fit border-white border rounded-lg text-[0.9rem] px-5 py-1 whitespace-nowrap gap-3">
          <div className="items-center flex gap-1">
            <LockIcon size={15} />
            <p>MFA status:</p>
          </div>

          <div className="flex items-center gap-1">
            <p>{mfaActive ? "Active" : "Inactive"}</p>
            {mfaActive ? <VerifiedIcon size={17} /> : <X size={17} />}
          </div>
        </div>
      </div>
    );
}