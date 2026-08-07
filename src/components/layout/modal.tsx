interface ModalProps {
    onOpen: (value: boolean) => void,
    open: boolean,
    header: string,
    message: string,
    icon: React.ReactNode,
    onConfirm: () => void;
}

export default function Modal({onOpen, open, header, message, icon, onConfirm}: ModalProps) {
    if (!open) return null;

    return(
        <div className="flex flex-col xl:w-130 w-50 border border-(--color-border-default) rounded-lg bg-(--color-bg-secondary) p-3">


        </div>
    )
}