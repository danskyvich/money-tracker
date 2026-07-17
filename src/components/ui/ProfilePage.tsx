"use client";

import { useEffect, useState } from "react";
import {
  CircleQuestionMark,
  Eye,
  LockIcon,
  LogOutIcon,
  VerifiedIcon,
  X,
} from "lucide-react";
import { deleteUser, signOut, unenrollFactor } from "@/services/supabase/actions";
import { useRouter } from "next/navigation";
import { Factor, User } from "@supabase/supabase-js";
import Button from "../layout/Button";

export default function ProfilePage({
  user,
  mfaActive,
}: {
  user?: User | null;
  mfaActive: boolean;
}) {
  useEffect(() => {
    document.title = "Profile";
  });

  // states
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [unenrollFactorModalOpen, setUnenrollFactorModalOpen] = useState(false)
  const [factorId, setFactorId] = useState<string | null>(null)
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
    {
      item: "View all enrolled devices",
      value: "View",
      icon: <Eye size={15}/>,
      onClick: () => alert('Coming Soon')
    },
  ];

  const handleFactorUnenrollment = (factorId: string) => {
  }

  return (
    <div className="relative flex flex-col w-full h-full">
      {unenrollFactorModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black/40">
          <div className="absolute flex-col w-120 gap-5 z-50 p-5 border border-(--color-border-strong) rounded-lg shadow-md bg-(--color-bg-subtle)">
            <div className="flex w-full gap-5 items-center">
              <CircleQuestionMark size={20} />
              <p className="text-xl font-semibold">
                Disable MFA on this account
              </p>
            </div>

            <p className="text-[0.9rem]/5 font-mono my-4">
              Are you sure you want to disable multi-factor authentication (MFA)
              on this account?
            </p>

            <div className="flex w-full gap-5">
              <Button
                variant="secondary"
                onClick={() => setUnenrollFactorModalOpen(false)}
                className="flex w-full"
                text="No"
              />

              <Button
                variant="primary"
                onClick={() => handleFactorUnenrollment(factorId as string)}
                className="flex w-full"
                text="Unenroll MFA"
              />
            </div>
          </div>
        </div>
      )}
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
            <div className="flex flex-0 w-full h-fit gap-5 p-5 rounded-xl bg-linear-to-r mb-2 from-slate-800 to-emerald-600 items-center justify-between">
              {/* User information */}
              <div className="flex flex-col w-full h-fit">
                <p className="text-lg font-mono text-white">
                  <span>{user?.email}</span>
                </p>
                <div className="text-[0.85rem] text-white">
                  <p>
                    Created on{" "}
                    {new Date(user?.created_at as string).toLocaleDateString()},{" "}
                    {new Date(user?.created_at as string).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* MFA status */}
              <div className="flex text-white w-fit h-fit border-white border rounded-lg text-[0.9rem] px-5 py-1 whitespace-nowrap gap-3">
                <div className="items-center flex gap-1">
                  <LockIcon size={15} />
                  <p>MFA status:</p>
                </div>
                
                <div className="flex items-center gap-1">
                  <p>{mfaActive ? "Active" : "Inactive"}</p>
                  {mfaActive ? <VerifiedIcon size={17} /> : <X size={17} />}
                </div>
              </div>
            </div>

            {/* Content */}
            {profile.map((item, index) => (
              <div
                className="grid grid-cols-[1fr_1fr] w-full h-fit text-[0.9rem] px-5 py-2 items-center justify-between"
                key={index}
              >
                <p>{item.item}</p>

                {/* Buttons */}
                <button
                  className={`flex w-fit h-fit ring ring-inset ring-(--color-brand-green) text-[0.9rem] items-center justify-self-end gap-2 hover:bg-(--color-brand-green) whitespace-nowrap hover:text-white rounded-lg shadow-md px-5 py-1 transition-all duration-100 cursor-pointer`}
                  onClick={() => item.onClick()}
                >
                  {item.icon === null ? null : item.icon}
                  <p>{item.value === "Set-up MFA" ? "MFA already enabled" : item.value}</p>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
