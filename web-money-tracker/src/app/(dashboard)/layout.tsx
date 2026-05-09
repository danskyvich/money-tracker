import AvatarBar from "@/components/layout/AvatarBar";
import Sidebar from "../../components/layout/Sidebar";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
    return (
      <div className="flex h-full w-full">
        <Sidebar />
        <div className="flex flex-col">
            <AvatarBar/>
            {children}
        </div>
      </div>
    );
}