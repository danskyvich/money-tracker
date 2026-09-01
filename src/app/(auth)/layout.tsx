import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex w-dvw h-dvh items-center justify-center bg-linear-180 from-sky-950 to-slate-800">
      <main className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}

