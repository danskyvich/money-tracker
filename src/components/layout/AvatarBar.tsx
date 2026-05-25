import { Bell } from "lucide-react";
import Image from "next/image";
import Avatar from "../ui/Avatar";
import Link from "next/link";

export default function AvatarBar({}:{}) {
    return (
      <div className="flex w-full p-5">
        {/**Bar */}
        <div className="flex w-full rounded-xl items-center justify-center gap-5 px-5 py-2 ">
          <div className="flex flex-auto w-auto" />
          <Link href="/notifications" className="">
            <Bell size={20} />
          </Link>
          <Avatar initials="DP" />
        </div>
      </div>
    );
}