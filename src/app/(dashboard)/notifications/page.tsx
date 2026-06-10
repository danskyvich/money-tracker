'use client'

import { useEffect } from "react"

export default function Notifications() {

    useEffect(() => {
        document.title = "Your notifications"
    }, []);

    return(
        <div className="flex w-full h-full">
        </div>
    )
}