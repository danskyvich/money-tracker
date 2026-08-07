import { InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ErrorModalProps {
  message: string | undefined;
}

export default function ErrorModal({ message }: ErrorModalProps) {
  const [visible, setVisible] = useState<boolean>(!!message);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 5000);
    message = undefined;
    return () => clearTimeout(timer);
  }, [message]);
  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          className="fixed top-5 left-1/2 items-center justify-center -translate-x-1/2 flex inset-0 z-100 w-fit h-fit gap-3 border border-(--color-border-default) rounded-lg shadow-xl px-5 py-2 bg-(--color-bg-subtle)"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 5 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <InfoIcon size={15} />
          <p className="font-sans text-[0.9rem]">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
