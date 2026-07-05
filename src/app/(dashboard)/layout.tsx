import AvatarBar from "@/components/layout/AvatarBar";
import Sidebar from "../../components/layout/Sidebar";
import { ModalProvider } from "@/lib/hooks/useModal";
import ModalBackdrop from "@/components/layout/Backdrop";
import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // retrieve user data
  const { user, error } = await getUser();
  if ( error || !user ) {
    redirect("/login")
  }

  return (
    <ModalProvider>
      <div className="flex h-full w-full bg-(--color-bg-secondary)">
        <Sidebar email={user.email as string} lastLogIn={user.last_sign_in_at as string} />
        <div className="flex flex-col w-full h-full px-5 pb-5">
          <AvatarBar />
          <div className="flex flex-1 w-full overflow-auto">{children}</div>
        </div>
        <ModalBackdrop />
      </div>
    </ModalProvider>
  );
}
