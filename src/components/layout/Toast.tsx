import { CircleAlert } from "lucide-react";

export default function Toast(message: string) {
  return (
    <div className="flex animation-to-right flex-col overflow-hidden w-fit md:w-75 bottom-4 right-4 fixed z-50 bg-(--color-bg-subtle) border border-(--color-border-default) rounded-lg shadow-md h-fit">
      <div
        className="h-0.75 w-full bg-red-600 animation-right-to-left"
      />
      <div className="flex items-center gap-1 px-5 pt-3">
        <CircleAlert size={20} />
        <p className="font-display text-[1rem]">Error</p>
      </div>
      <p className="text-[0.9rem] font-mono text-red-400 px-5 pb-3">
        {message}
      </p>
    </div>
  );
}
