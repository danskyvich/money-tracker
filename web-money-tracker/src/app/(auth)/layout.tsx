export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className='flex w-dvw h-dvh'>{children}</div>;
}