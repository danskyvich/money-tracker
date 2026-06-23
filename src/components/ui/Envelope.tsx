'use client'

const variants = [

]

export default function BudgetEnvelope({title, amount, target}: {title: string, amount: string, target: string}) {
    return (
      <div className="flex flex-col w-[300px] h-[100px] border border-(--color-border-default) rounded-lg px-5 py-3 shadow-md">
        <p className="font-display font-light text-[1rem]">{title}</p>

        <div className="flex flex-auto h-auto" />

        <div className="flex w-full items-center">
          <p className="font-mono text-xl">
            <span className="mr-1 text-[0.8rem]">₱</span>
            {amount}
          </p>

          <div className="flex flex-auto w-auto" />

          <p className="text-[0.8rem] text-(--color-text-secondary)">
            <span className="mr-1 text-xl text-(--color-text-primary)">/</span>
            <span className="text-lg mr-1">₱</span>
            {target}
          </p>
        </div>
      </div>
    );
}