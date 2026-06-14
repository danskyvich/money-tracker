"use client";

import { useModal } from "@/lib/hooks/useModal";

export default function ModalBackdrop() {
  const { isOpen } = useModal();

  if (!isOpen) return null;

  return <div className="fixed inset-0 bg-black/20 z-40 pointer-events-none" />;
}
