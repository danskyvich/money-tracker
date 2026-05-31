import { NotificationTypes } from "@/lib/mocks/mockNotifs"

interface NotificationItemProps {
    icon: React.ReactNode,
    message: string
}
export default function NotificationItem ({icon, message}: NotificationItemProps) {
    return (
      <div className="flex flex-col w-full">
        <div className="flex w-full py-3 px-5 gap-2 items-center text-[var(--color-text-primary)] font-normal text-[0.9rem] hover:bg-[var(--color-bg-subtle)] hover:cursor-pointer ">
          {icon}
          <p>{message}</p>
        </div>
      </div>
    );
}