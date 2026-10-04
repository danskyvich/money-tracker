import { RecaptchaProvider } from "@/components/recaptcha-provider";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RecaptchaProvider>
      <div className="relative flex w-dvw h-dvh items-center justify-center bg-gradient-to-b from-sky-950 to-slate-800">
        <main className="relative z-10 w-full h-full flex items-center justify-center bg-[linear-gradient(to_right,#10496e_1px,transparent_1px),linear-gradient(to_bottom,#10496e_1px,transparent_1px)] bg-size-[24px_24px]">
          {children}
        </main>
      </div>
    </RecaptchaProvider>
  );
}
