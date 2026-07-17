"use server"

import OverviewPage from "@/components/ui/OverviewPage"
import { createClient } from "@/services/supabase/server"

export default async function Overview() {

  return(
    <div className="flex flex-col w-full h-full">
      <OverviewPage/>
    </div>
  )
}