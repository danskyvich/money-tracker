'use client'

import Card from "@/components/ui/Card"
import { useEffect } from "react"

export default function Profile() {

    useEffect(() => {
        document.title = 'Profile'
    })
    return (
      <div className="flex w-full h-full gap-5">
        <div className="flex flex-1 flex-col w-full h-full">

        </div>

        <Card
          header="Profile"
          subheader="View your personal information"
          className="flex flex-3 w-full"
        >
        </Card>
      </div>
    );
}