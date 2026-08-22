import { X } from "lucide-react";
import Spinner from "./spinner";

interface ModalProps {
    onOpen: (value: boolean) => void,
    open: boolean,
    header?: string,
    message?: React.ReactNode,
    icon: React.ReactNode,
    onConfirm?: () => void;
    onCancel: () => void;
    noButtonText?: string,
    yesButtonText?: string,
    children?: React.ReactNode,
    loading: boolean;
}

export default function Modal({loading, children, onCancel, noButtonText, yesButtonText, onOpen, open, header, message, icon, onConfirm}: ModalProps) {
    if (!open) return null;

    return (
      <div className="flex flex-col w-100 mx-5 sm:mx-0 sm:w-110 md:w-125 lg:w-140 xl:w-160 border border-(--color-border-default) rounded-lg bg-(--color-bg-secondary) justify-between p-5">
        {/* Header */}
        <div className="flex w-full h-fit items-center justify-between mb-3">
          {icon}
          <p className="font-semibold text-xl">{header}</p>
          <X
            size={15}
            className="cursor-pointer"
            onClick={() => {
              onOpen(false);
              onCancel();
            }}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col w-full h-fit text-[0.9rem] font-display my-2 gap-2">
          <p>{message}</p>
          {children}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-[1fr_1fr] gap-x-3 mt-3 w-full h-fit">
          <button
            className={`${!noButtonText && "hidden"} whitespace-nowrap py-1 flex w-full items-center justify-center hover:text-white border border-(--color-brand-green) rounded-lg text-[0.9rem] hover:bg-(--color-brand-green) active:bg-emerald-600 cursor-pointer transition-all duration-100`}
            onClick={() => {
              onOpen(false);
              onCancel();
            }}
          >
            <p>{noButtonText}</p>
          </button>

          <button
            className={`${onConfirm === undefined && "hidden"} whitespace-nowrap text-white py-2 flex w-full items-center justify-center rounded-lg text-[0.9rem] bg-(--color-brand-green) hover:bg-emerald-600 active:bg-emerald-700 transition-all duration-100 cursor-pointer`}
            onClick={() => {
              onConfirm === undefined ? null : onConfirm();
            }}
          >
            {
              loading ? <Spinner/> : yesButtonText
            }
          </button>
        </div>
      </div>
    );
}