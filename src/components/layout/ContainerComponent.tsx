import Backup from "@/app/(dashboard)/settings/backup/page";
import Configuration from "@/app/(dashboard)/settings/configuration/page";
import Help from "@/app/(dashboard)/settings/help/page";
import Passcode from "@/app/(dashboard)/settings/passcode/page";
import Profile from "@/app/(dashboard)/settings/profile/page";

export default function ContainerComponent({path}: {path: string}) {
    const pageMap: Record<string, React.ReactNode> = {
        "/settings/profile": <Profile />,
        "/settings/backup": <Backup />,
        "/settings/help": <Help/>,
        "/settings/configuration": <Configuration/>,
        "/settings/passcode": <Passcode />
    }
    return(
        <div className="flex flex-col w-full">
            {pageMap[path]}
        </div>
    )
}