import AvatarBar from "@/components/layout/avatar-bar";
import Sidebar from "@/components/layout/sidebar-ui";
import { getUser } from "@/lib/supabase/actions/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // retrieve user data
  const user = await getUser();
  if ( !user ) {
    redirect("/login")
  }

  return (
    <div className="flex h-full w-full bg-(--color-bg-secondary)">
      <Sidebar
        email={user.email as string}
        lastLogIn={user.last_sign_in_at as string}
      />
      <div className="flex flex-col w-full h-full px-5 pb-5">
        <AvatarBar />
        <div className="flex flex-1 w-full overflow-auto">{children}</div>
      </div>
    </div>
  );
}
