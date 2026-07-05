import BottomBar from "@/components/layout/BottomBar";

export default function AccountLayout({children}: {children: React.ReactNode}) {
    return (
      <div className="flex flex-col w-full h-full bg-(--color-bg-subtle)">
        {children}
        <BottomBar/>
      </div>
    );
}