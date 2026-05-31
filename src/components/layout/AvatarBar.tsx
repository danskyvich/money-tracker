'use client'
import { Bell } from "lucide-react";
import Link from "next/link";
import Avatar from "../ui/Avatar";
import { useRef, useState } from "react";
import NotificationItem from "./NotificationItem";
import { NotificationTypes } from "@/lib/mocks/mockNotifs";

export default function AvatarBar({}:{}) {
  const notifRef = useRef<HTMLDialogElement>(null)

    return (
      <div className="relative flex w-full rounded-xl items-center justify-center gap-5 px-10 py-4">
        <div className="flex flex-auto w-auto" />

        {/* Notifications */}
        <Bell
          size={20}
          className="hover:cursor-pointer"
        />

        <Avatar initials="DP" />

      </div>
    );
}