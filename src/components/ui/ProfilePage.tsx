"use client";

import { useEffect, useState } from "react";
import {
  CircleQuestionMark,
  LockIcon,
  LogOutIcon,
  PhoneIcon,
  X,
} from "lucide-react";
import { deleteUser, signOut } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";
import { Factor } from "@supabase/supabase-js";

export default function ProfilePage({
  email,
  data,
}: {
  email?: string;
  data: { totp: Factor[] };
}) {
  useEffect(() => {
    document.title = "Profile";
  });

  // states
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const router = useRouter();

  const profile = [
    {
      item: "Sign out of your account",
      value: "Sign out",
      icon: <LogOutIcon size={15} />,
      onClick: () => setSignOutModalOpen(true),
    },
    {
      item: "Delete your account",
      value: "Delete account",
      icon: <X size={15} />,
      onClick: () => setDeleteModalOpen(true),
    },
    {
      item: "Enable multi-factor authentication (MFA)",
      value: "Set-up MFA",
      icon: <LockIcon size={15} />,
      onClick: () => router.push("/2fa"),
    },
  ];

  return (
    <div className="relative flex flex-col w-full h-full">
      {/* Sign out modal */}
      {signOutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black/40">
          <div className="absolute flex-col w-100 gap-5 z-50 p-5 border border-(--color-border-strong) rounded-lg shadow-md bg-(--color-bg-subtle)">
            <div className="flex w-full items-center gap-5">
              <CircleQuestionMark size={20} />
              <p className="text-xl font-bold">Are you sure?</p>
            </div>
            <div className="flex w-full mt-5 gap-5 text-[0.9rem]">
              <button
                className="flex w-full text-(--color-text-primary) border gap-3 border-(--color-border-strong) rounded-lg px-5 py-1 items-center hover:bg-(--color-brand-green) cursor-pointer active:bg-emerald-700 transition-all duration-100"
                onClick={() => setSignOutModalOpen(false)}
              >
                <X size={15} />
                No, go back
              </button>
              <button
                className="flex whitespace-nowrap w-full bg-(--color-brand-red) gap-3 cursor-pointer hover:bg-red-900 active:bg-red-950 rounded-lg px-5 py-1 items-center transition-all duration-100"
                onClick={signOut}
              >
                <LogOutIcon size={15} />
                Yes, sign me out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete account modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black/40">
          <div className="absolute flex-col w-fit gap-5 z-50 p-5 border border-(--color-border-strong) rounded-lg shadow-md bg-(--color-bg-subtle)">
            <div className="flex w-full items-center gap-5">
              <CircleQuestionMark size={20} />
              <p className="text-xl font-bold">Are you sure?</p>
            </div>

            <p className="w-100 mt-3 text-[0.9rem] mb-5">
              Deleting your account also deletes your transaction and account
              data, current configuration, and account information.
            </p>
            <div className="flex w-full mt-5 gap-5 text-[0.9rem]">
              <button
                className="flex whitespace-nowrap w-fit text-(--color-text-primary) border gap-3 border-(--color-border-strong) rounded-lg px-5 py-1 items-center hover:bg-(--color-brand-green) cursor-pointer active:bg-emerald-700 transition-all duration-100"
                onClick={() => setDeleteModalOpen(false)}
              >
                <X size={15} />
                No, do not delete
              </button>
              <button
                className="flex whitespace-nowrap w-fit bg-(--color-brand-red) gap-3 cursor-pointer hover:bg-red-900 active:bg-red-950 rounded-lg px-5 py-1 items-center transition-all duration-100"
                onClick={deleteUser}
              >
                <LogOutIcon size={15} />
                Delete my account
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="font-semibold text-3xl pb-5">Profile</p>

      <div className="flex w-full h-full gap-5">
        {/* Modal */}
        <div className="flex flex-2 w-full h-full border border-(--color-border-default) rounded-lg shadow-md">
          <div className="flex flex-col w-full h-full p-5">
            {/* User header */}
            <div className="flex flex-0 w-full h-fit gap-5 p-5 rounded-xl bg-linear-to-r mb-2 from-slate-800 to-emerald-600">
              {/* Avatar */}
              <div className="flex bg-(--color-brand-gold) h-fit rounded-[50%] px-4 py-3">
                <p className="text-black">DP</p>
              </div>

              {/* User information */}
              <div className="flex flex-col w-full h-fit">
                <p className="text-lg font-mono text-white">
                  <span>{email}</span>
                </p>
                <p className="text-sm text-white font-mono">{email}</p>
              </div>

              <div className="flex flex-auto w-auto h-fit" />
            </div>

            {profile.map((item, index) => (
              <div
                className="grid grid-cols-[1fr_1fr] w-full h-fit text-[0.9rem] px-5 py-2 items-center"
                key={index}
              >
                <p>{item.item}</p>

                {/* Buttons */}
                <div
                  className="flex w-fit h-fit ring ring-inset ring-(--color-brand-green) text-[0.9rem] items-center justify-self-end gap-2 hover:bg-(--color-brand-green) whitespace-nowrap hover:text-white rounded-lg shadow-md px-5 py-1 transition-all duration-100 cursor-pointer"
                  onClick={() => item.onClick()}
                >
                  {item.icon === null ? null : item.icon}
                  <p>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col flex-1 w-full h-full border border-(--color-border-default) rounded-xl">
          <p className="text-xl font-semibold px-5 pt-2">Enrolled devices</p>
          <p className="font-mono text-[0.8rem] text-(--color-text-secondary) px-5 pb-2 border-b border-(--color-border-subtle)">
            Enroll and unenroll devices with MFA enabled
          </p>

          {/* List */}
          <div className="flex w-full h-fit mt-5 px-5">
            {data.totp.map((factor) => (
              <div
                className="flex w-full items-center h-fit px-5 py-3 ring ring-inset ring-(--color-border-default) rounded-xl gap-5"
                key={factor.id}
              >
                <PhoneIcon size={20} />
                <div className="flex flex-col w-full justify-center gap-1">
                  {/* friendly_name */}
                  <p className="text-[1rem] font-mono">
                    {factor.friendly_name}
                  </p>

                  {/* Created_at, status, and unenroll row */}
                  <div className="flex w-full items-center justify-between">
                    <p className="text-[0.75rem] font-light">
                      {new Date(factor.created_at).toDateString() +
                        " | " +
                        new Date(factor.created_at).toLocaleTimeString()}
                    </p>
                    <div className="flex gap-5">
                      <div
                        className={`rounded-xl flex w-fit px-5 text-(--color-text-primary) text-[0.9rem] ${factor.status === "verified" ? "bg-(--color-brand-green)" : "bg-(--color-brand-red)"}`}
                      >
                        <p className="lowercase first-letter:uppercase">
                          {factor.status}
                        </p>
                      </div>

                      <p className="text-red-500 hover:underline active:text-red-400 text-[0.9rem] cursor-pointer">
                        Unenroll
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
