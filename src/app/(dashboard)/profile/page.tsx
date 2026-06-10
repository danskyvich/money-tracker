'use client'

import Card from "@/components/ui/Card"
import { useEffect } from "react"

export default function Profile() {

    useEffect(() => {
        document.title = 'Profile'
    })
    return (
      <div className="flex w-full h-full gap-5">

        {/* Left side */}
        <div className="flex flex-col w-full h-full gap-5">
          <Card classname="flex w-full h-fit" />
            <p>
            </p>
          <Card classname="flex w-full h-fit" />
        </div>

        {/* Right side */}
        <div className="flex flex-col w-full h-full">
          <Card

          >

          </Card>
        </div>
      </div>
    );
}