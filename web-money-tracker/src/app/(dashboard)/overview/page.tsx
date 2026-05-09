'use client'

import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function Overview() {
    const pathName = usePathname;

    useEffect(() => {
        document.title = "Dashboard"
    })
    return (
        <div className="flex flex-col w-auto h-full s">
            
        </div>
    )
}