import { X } from "lucide-react";

interface ModalProps {
    onOpen: (value: boolean) => void,
    open: boolean,
    header: string,
    message: React.ReactNode,
    icon: React.ReactNode,
    onConfirm: () => void;
    onCancel: () => void;
    noButtonText: string,
    yesButtonText: string,
}

export default function Modal({onCancel, noButtonText, yesButtonText, onOpen, open, header, message, icon, onConfirm}: ModalProps) {
    if (!open) return null;

    return (
      <div className="flex flex-col w-50 sm:w-70 md:w-85 lg:w-110 xl:w-130 border border-(--color-border-default) rounded-lg bg-(--color-bg-secondary) justify-between p-5">
        {/* Header */}
        <div className="flex w-full h-fit items-center justify-between mb-3">
          {icon}
          <p className="font-semibold text-xl">{header}</p>
          <X
            size={15}
            className="cursor-pointer"
            onClick={() => {onOpen(false); onCancel()}}
          />
        </div>

        {/* Content */}
        <div className="flex w-full h-fit text-[0.9rem] font-mono my-2">
          <p>{message}</p>
        </div>

        {/* Buttons */}
        <div className="flex w-full h-fit justify-between items-center mt-3">
          <button
            className="flex w-fit border border-(--color-brand-green) rounded-lg text-[0.9rem] px-5 py-1 hover:bg-(--color-brand-green) active:bg-emerald-600 cursor-pointer transition-all duration-100"
            onClick={() => {onOpen(false); onCancel()}}
          >
            <p>{noButtonText}</p>
          </button>

          <button
            className="flex w-fit rounded-lg text-[0.9rem] px-5 py-1 bg-(--color-brand-green) hover:bg-emerald-600 active:bg-emerald-700 transition-all duration-100 cursor-pointer"
            onClick={() => onConfirm()}
          >
            <p>{yesButtonText}</p>
          </button>
        </div>
      </div>
    );
}