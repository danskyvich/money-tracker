import ProfilePage from "@/features/profile/profile-page";
import { getUser, isUserMfaEnabled } from "@/lib/supabase/actions/auth";

export default async function Profile() {
  
  const [user, mfaActive] = await Promise.all([
    getUser(),
    isUserMfaEnabled(),
  ])

  return (
    <ProfilePage  user={user} mfaActive={mfaActive} />
  );
}