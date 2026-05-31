import { PiggyBankIcon, Wallet2 } from "lucide-react";

export const NotificationTypes = [
  {
    message: "Have you checked your finances today?",
    icon: (
      <PiggyBankIcon size={20} className="text-[var(--color-text-primary)]" />
    ),
  },
  {
    message: "Your spending is consistent with previous recorded expenses.",
    icon: <Wallet2 size={20} className="text-[var(--color-text-primary)]" />,
  },
]

