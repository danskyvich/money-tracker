import { UtensilsIcon, Building2, GraduationCap, Wifi} from 'lucide-react'

export const transactions = [
  {
    amount: "50.00",
    account: "Wallet",
    description: "Lawson - 16oz Iced Coffee",
    category: "Food",
    icon: <UtensilsIcon size={20} className="text-(--color-text-primary)" />,
  },
  {
    amount: "2000.15",
    account: "BPI Savings",
    description: "Savings",
    category: "Banking",
    icon: <Building2 size={20} className="text-(--color-text-primary)" />,
  },
  {
    amount: "(275.00)",
    account: "Wallet",
    description: "24 Chicken - Half 2x Yangneom",
    category: "Food",
    icon: <UtensilsIcon size={20} className="text-(--color-text-primary)" />,
  },
  {
    amount: "100.00",
    account: "Maya",
    description: "Savings",
    category: "Banking",
    icon: <Building2 size={20} className="text-(--color-text-primary)" />,

  },
  {
    amount: "(980.00)",
    account: "Wallet",
    description: "Thesis Bookbind",
    category: "Education",
    icon: <GraduationCap size={20} className="text-(--color-text-primary)" />,
  },
  {
    amount: "(99.00)",
    account: "GCash",
    description: "Smart load (Regular 99)",
    category: "Telecommunications",
    icon: <Wifi size={20} className="text-(--color-text-primary)" />,
  },
];