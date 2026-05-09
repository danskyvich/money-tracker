import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex w-dvw h-dvh items-center justify-center">
      <Image src="/bg-fractal.png" alt="bg-auth-image" fill priority sizes="100vw" quality={100} className="object-fill"/>
      <main className="relative z-10 w-full h-full flex items-center justify-center">{children}</main>
    </div>
  );
}

