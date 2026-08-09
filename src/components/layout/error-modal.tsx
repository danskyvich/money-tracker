import { InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ErrorModalProps {
  message: string | null;
}

export default function ErrorModal({ message }: ErrorModalProps) {
  const [visible, setVisible] = useState<boolean>(!!message);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 5000);
    message = null;
    return () => clearTimeout(timer);
  }, [message]);
  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          className="fixed top-5 text-white left-1/2 items-center justify-center -translate-x-1/2 flex inset-0 z-100 w-fit h-fit gap-3 border border-red-800 rounded-lg shadow-xl px-5 py-2 bg-red-800"
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
