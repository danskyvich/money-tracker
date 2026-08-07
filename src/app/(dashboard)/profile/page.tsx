import ProfilePage from "@/components/ui/ProfilePage";
import { getUser, isUserMfaEnabled, listUserMfaFactors } from "@/lib/supabase/actions/auth";
import { User } from "@supabase/supabase-js";

export default async function Profile() {
  const [user, mfaActive] = await Promise.all([
    getUser(),
    isUserMfaEnabled(),
  ])


  return (
    <ProfilePage  user={user} mfaActive={mfaActive} />
  );
}