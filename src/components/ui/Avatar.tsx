import Link from "next/link";
import { useState } from "react";

export default function Avatar({initials}:{initials: string}) {

    return (
      <Link
        href="/profile"
        className="flex rounded-[50%] px-2 py-1 bg-(--color-brand-gold) hover:cursor-pointer"
      >
        <p className="font-semibold">{initials}</p>
      </Link>
    );
}