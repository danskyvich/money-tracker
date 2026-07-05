import ProfilePage from "@/components/ui/ProfilePage";
import { createClient } from "@/lib/supabase/server";

export default async function Profile() {

  const supabase = await createClient();
  const { data, error } = await supabase.auth.mfa.listFactors()
  if (error) return <p className="text-red-500 text-[0.9rem]">{error.message}</p>

  return <ProfilePage data={data}/>
}