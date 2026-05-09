import { Bell } from "lucide-react";

export default function AvatarBar({}:{}) {
    return (
      <div className="flex flex-row w-full h-[3%] gap-2">
        <div className="flex flex-auto h-fit" />

        <Bell size={20} />
      </div>
    );
}