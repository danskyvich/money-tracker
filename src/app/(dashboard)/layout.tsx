import AvatarBar from "@/components/layout/AvatarBar";
import Sidebar from "../../components/layout/Sidebar";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
    return (
      <div className="flex h-full w-full bg-[var(--color-bg-secondary)]">
        <Sidebar />
        <div className="flex flex-col w-full h-full">
            <AvatarBar/>
            {children}
        </div>
      </div>
    );
}