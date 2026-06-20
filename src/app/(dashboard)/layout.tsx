import AvatarBar from "@/components/layout/AvatarBar";
import Sidebar from "../../components/layout/Sidebar";
import { ModalProvider } from "@/lib/hooks/useModal";
import ModalBackdrop from "@/components/ui/Backdrop";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModalProvider>
      <div className="flex h-full w-full bg-(--color-bg-secondary)">
        <Sidebar />
        <div className="flex flex-8 flex-col w-full h-full px-10 pb-5">
          <AvatarBar />
          <div className="flex h-full w-full overflow-auto">{children}</div>
        </div>
        <ModalBackdrop />
      </div>
    </ModalProvider>
  );
}
