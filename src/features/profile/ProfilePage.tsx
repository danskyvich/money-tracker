"use client";

import { useEffect, useState } from "react";
import {
  CircleQuestionMark,
  Eye,
  Lock,
  LockIcon,
  LogOutIcon,
  VerifiedIcon,
  X,
} from "lucide-react";
import { deleteUser, getUser, getUserAuthenticationAssuranceLevel, signOut } from "@/lib/supabase/actions/auth";
import { useRouter } from "next/navigation";
import { AuthenticatorAssuranceLevels, User } from "@supabase/supabase-js";
import Modal from "../../components/layout/modal";
import ProfileHeader from "./components/profile-card";
import Toggle from "@/components/layout/toggle";

export default function ProfilePage({
  user,
  mfaActive,
}: {
  user?: User | null;
  mfaActive: boolean;
}) {

  // states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toggle, setToggle] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [factorId, setFactorId] = useState<string | null>(null)
  const [assuranceLevel, setAssuranceLevel] = useState<AuthenticatorAssuranceLevels | null | undefined>(null)
  const router = useRouter();

  useEffect(() => {
    document.title = "Profile";

    const checkUserAssuranceLevel = async () => {
      const result = await getUserAuthenticationAssuranceLevel();
      if (!result) return null;
      setAssuranceLevel(result?.data?.currentLevel);
    };

    checkUserAssuranceLevel();
    setToggle(assuranceLevel === "aa1" ? false : true);
  }, [toggle, ]);

  const profile = [
    {
      item: "Sign out of your account",
      value: "Sign out",
      icon: <LogOutIcon size={15} />,
      onClick: () => setActiveModal("sign-out"),
    },
    {
      item: "Delete your account",
      value: "Delete account",
      icon: <X size={15} />,
      onClick: () => setActiveModal("delete"),
    },
  ];

  const handleOpenModalMFA = () => {
   assuranceLevel === "aa1" ? router.push("/2fa") : () => setActiveModal("disable-mfa");
  }

  const handleMFA = () => {

  }

  return (
    <div className="relative flex flex-col w-full h-full">
      {activeModal === "sign-out" && (
        <div className="fixed z-50 inset-0 bg-black/50 flex items-center justify-center">
          <Modal
            open
            onOpen={() => setActiveModal(null)}
            icon={<CircleQuestionMark size={20} />}
            onCancel={() => setActiveModal(null)}
            onConfirm={signOut}
            yesButtonText="Yes, sign me out"
            noButtonText="No, go back"
            message={"Are you sure you want to sign out of your account?"}
            header="Sign out"
            loading={loading}
          />
        </div>
      )}

      {/* Delete account modal */}
      {activeModal === "delete" && (
        <div className="fixed z-50 inset-0 bg-black/50 flex items-center justify-center">
          <Modal
            open
            onOpen={() => setActiveModal(null)}
            icon={<CircleQuestionMark size={20} />}
            onCancel={() => setActiveModal(null)}
            onConfirm={deleteUser}
            yesButtonText="Yes, delete my account"
            noButtonText="No, go back"
            message={
              "Are you sure you want to delete your account? This will delete everything including your data and existing configurations."
            }
            header="Delete your account"
            loading={loading}
          />
        </div>
      )}
      {activeModal === "disable-mfa" && (
        <div className="fixed z-50 inset-0 bg-black/50 flex items-center justify-center">
          <Modal
            open
            onOpen={() => setActiveModal(null)}
            icon={<Lock size={20} />}
            onCancel={() => setActiveModal(null)}
            onConfirm={handleMFA}
            yesButtonText="Disable MFA"
            noButtonText="No"
            header="Disable your MFA"
            loading={loading}            
          />
        </div>
      )}

      <p className="font-semibold text-3xl pb-5">Profile</p>

      <div className="flex w-full h-full gap-5">
        {/* Card */}
        <div className="flex flex-2 w-full h-full border border-(--color-border-default) rounded-lg shadow-md">
          <div className="flex flex-col w-full h-full p-5">
            <ProfileHeader user={user} mfaActive={mfaActive} />

            <div className="flex w-full h-fit items-center justify-between my-2">
              <p className="text-[0.9rem]">Enable MFA</p>
              <Toggle
                enable={toggle}
                onEnable={() => setToggle((prev) => !prev)}
                onClick={handleOpenModalMFA}
              />
            </div>

            {/* Content */}
            {profile.map((item, index) => (
              <div
                className="grid grid-cols-[1fr_1fr] w-full h-fit text-[0.9rem]  py-2 items-center justify-between"
                key={index}
              >
                <p>{item.item}</p>

                {/* Buttons */}
                <button
                  className={`flex w-fit h-fit ring ring-inset ring-(--color-brand-green) text-[0.9rem] items-center justify-self-end gap-2 hover:bg-(--color-brand-green) whitespace-nowrap hover:text-white rounded-lg shadow-md px-5 py-1 transition-all duration-100 cursor-pointer`}
                  onClick={() => item.onClick()}
                >
                  {item.icon === null ? null : item.icon}
                  <p>{item.value}</p>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
