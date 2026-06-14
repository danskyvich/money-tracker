import Backup from "@/app/(dashboard)/settings/backup/page";
import Configuration from "@/app/(dashboard)/settings/configuration/page";
import Profile from "@/app/(dashboard)/settings/profile/page";

export default function ContainerComponent({path}: {path: string}) {
    const pageMap: Record<string, React.ReactNode> = {
        "/settings/profile": <Profile />,
        "/settings/backup": <Backup />,
        "/settings/configuration": <Configuration/>,
    }
    return(
        <div className="flex flex-col w-full">
            {pageMap[path]}
        </div>
    )
}