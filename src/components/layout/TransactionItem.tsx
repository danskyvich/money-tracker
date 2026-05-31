interface TransactionItemProps {
    className?: string;
    category: string;
    amount: string;
    icon?: React.ReactNode;
    account: string;
    description?: string;
}

export default function TransactionItem({className, category, amount, icon, account, description}: TransactionItemProps) {
    return (
      <div
        className={`flex w-full h-fit ${className} items-center gap-2 px-5 py-3 hover:bg-(--color-bg-subtle) hover:cursor-pointer border-b border-(--color-border-subtle)`}
      >
        <div className="flex mr-2">{icon}</div>
        <p className="flex-1 text-[0.9rem]">{category}</p>
        <div className="flex flex-col flex-[2]">
          <p className="text-[0.9rem]">{description}</p>
          <p className="text-[0.7rem] text-(--color-text-secondary)">
            {account}
          </p>
        </div>
        <p className="flex-1 font-mono text-right">{amount}</p>
      </div>
    );
}