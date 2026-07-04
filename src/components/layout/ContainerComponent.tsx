import Configuration from "@/app/(dashboard)/settings/page";
import Profile from "@/app/(dashboard)/profile/page";
import Backup from "@/app/(dashboard)/backup/page";

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