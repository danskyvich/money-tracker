"use client";
import { listUserMfaFactors, unenrollFactor } from "@/lib/auth/actions";
import { useEffect, useState } from "react";

export default function DebugMfaPage() {
  const [factors, setFactors] = useState<any[]>([]);

  useEffect(() => {
    listUserMfaFactors().then((res) => {
      console.log("FACTORS RES:", res);
      if (res.totp) setFactors(res.totp);
    });
  }, []);

  async function handleUnenroll(factorId: string) {
    await unenrollFactor(factorId);
    setFactors((prev) => prev.filter((f) => f.id !== factorId));
  }

  return (
    <div className="p-10 flex flex-col gap-2">
      {factors.map((f) => (
        <div key={f.id} className="flex gap-2 items-center">
          <p>
            {f.friendly_name} — {f.status}
          </p>
          <button
            onClick={() => handleUnenroll(f.id)}
            className="underline text-red-500"
          >
            Unenroll
          </button>
        </div>
      ))}
    </div>
  );
}
