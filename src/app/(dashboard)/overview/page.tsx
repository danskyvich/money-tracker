"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { transactions } from "@/lib/mocks/mockTransactions";
import { useUser } from "@/lib/hooks/useUser";
import { accountCategories, accounts } from "@/lib/mocks/mockAccounts";
import { ArrowDown, ArrowUp, ChevronRight, Plus } from "lucide-react";

export default function Overview() {
  const [time, setTime] = useState("");
  const { user } = useUser();
  const pagination = [1,2,3];
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [accountCurrentPage, setAccountCurrentPage] = useState<number>(1);

  useEffect(() => {
    document.title = "Dashboard";
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      const getTime = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);

      setTime(getTime);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  const iconMap = [
    {
      range: [6, 12],
      icon: (
        <svg
          className="text-primary"
          fill="currentColor"
          width="30px"
          height="30px"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M23,16a1,1,0,0,1-1,1H2a1,1,0,0,1,0-2H22A1,1,0,0,1,23,16Zm-5,5a1,1,0,0,0,0-2H6a1,1,0,0,0,0,2ZM7,12a1,1,0,0,0,2,0,3,3,0,0,1,6,0,1,1,0,0,0,2,0A5,5,0,0,0,7,12Zm4-7a1,1,0,0,0,2,0V4a1,1,0,0,0-2,0Zm7,7a1,1,0,0,0,1,1h1a1,1,0,0,0,0-2H19A1,1,0,0,0,18,12ZM4,11a1,1,0,0,0,0,2H5a1,1,0,0,0,0-2ZM5.636,5.636a1,1,0,0,0,0,1.414l.707.707A1,1,0,0,0,7.757,6.343L7.05,5.636A1,1,0,0,0,5.636,5.636Zm11.314,0-.707.707a1,1,0,1,0,1.414,1.414l.707-.707A1,1,0,1,0,16.95,5.636Z" />
        </svg>
      ),
    },
    {
      range: [12, 17],
      icon: (
        <svg
          className="text-primary"
          width="30px"
          height="30px"
          viewBox="0 0 15 15"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            d="M7.5 0C7.77614 0 8 0.223858 8 0.5V2.5C8 2.77614 7.77614 3 7.5 3C7.22386 3 7 2.77614 7 2.5V0.5C7 0.223858 7.22386 0 7.5 0ZM2.1967 2.1967C2.39196 2.00144 2.70854 2.00144 2.90381 2.1967L4.31802 3.61091C4.51328 3.80617 4.51328 4.12276 4.31802 4.31802C4.12276 4.51328 3.80617 4.51328 3.61091 4.31802L2.1967 2.90381C2.00144 2.70854 2.00144 2.39196 2.1967 2.1967ZM0.5 7C0.223858 7 0 7.22386 0 7.5C0 7.77614 0.223858 8 0.5 8H2.5C2.77614 8 3 7.77614 3 7.5C3 7.22386 2.77614 7 2.5 7H0.5ZM2.1967 12.8033C2.00144 12.608 2.00144 12.2915 2.1967 12.0962L3.61091 10.682C3.80617 10.4867 4.12276 10.4867 4.31802 10.682C4.51328 10.8772 4.51328 11.1938 4.31802 11.3891L2.90381 12.8033C2.70854 12.9986 2.39196 12.9986 2.1967 12.8033ZM12.5 7C12.2239 7 12 7.22386 12 7.5C12 7.77614 12.2239 8 12.5 8H14.5C14.7761 8 15 7.77614 15 7.5C15 7.22386 14.7761 7 14.5 7H12.5ZM10.682 4.31802C10.4867 4.12276 10.4867 3.80617 10.682 3.61091L12.0962 2.1967C12.2915 2.00144 12.608 2.00144 12.8033 2.1967C12.9986 2.39196 12.9986 2.70854 12.8033 2.90381L11.3891 4.31802C11.1938 4.51328 10.8772 4.51328 10.682 4.31802ZM8 12.5C8 12.2239 7.77614 12 7.5 12C7.22386 12 7 12.2239 7 12.5V14.5C7 14.7761 7.22386 15 7.5 15C7.77614 15 8 14.7761 8 14.5V12.5ZM10.682 10.682C10.8772 10.4867 11.1938 10.4867 11.3891 10.682L12.8033 12.0962C12.9986 12.2915 12.9986 12.608 12.8033 12.8033C12.608 12.9986 12.2915 12.9986 12.0962 12.8033L10.682 11.3891C10.4867 11.1938 10.4867 10.8772 10.682 10.682ZM5.5 7.5C5.5 6.39543 6.39543 5.5 7.5 5.5C8.60457 5.5 9.5 6.39543 9.5 7.5C9.5 8.60457 8.60457 9.5 7.5 9.5C6.39543 9.5 5.5 8.60457 5.5 7.5ZM7.5 4.5C5.84315 4.5 4.5 5.84315 4.5 7.5C4.5 9.15685 5.84315 10.5 7.5 10.5C9.15685 10.5 10.5 9.15685 10.5 7.5C10.5 5.84315 9.15685 4.5 7.5 4.5Z"
          />
        </svg>
      ),
    },
    {
      range: [17, 20],
      icon: (
        <svg
          className="text-primary"
          fill="currentColor"
          width="30px"
          height="30px"
          viewBox="0 0 32 32"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>sunset</title>
          <path d="M30 20.25h-5.291l-0.723-2.941 4.402-2.667c0.218-0.134 0.361-0.371 0.361-0.642s-0.143-0.508-0.358-0.64l-0.003-0.002-4.402-2.667 1.227-4.998c0.014-0.053 0.021-0.115 0.021-0.178 0-0.207-0.084-0.395-0.219-0.531l0 0c-0.134-0.137-0.321-0.221-0.527-0.221-0.065 0-0.129 0.008-0.189 0.024l0.005-0.001-4.998 1.228-2.665-4.402c-0.134-0.218-0.371-0.361-0.642-0.361s-0.508 0.143-0.64 0.358l-0.002 0.003-2.667 4.402-4.998-1.228c-0.053-0.013-0.113-0.020-0.175-0.020-0.208 0-0.397 0.083-0.534 0.219l0-0c-0.136 0.136-0.22 0.323-0.22 0.53 0 0.063 0.008 0.125 0.023 0.184l-0.001-0.005 1.228 4.998-4.402 2.667c-0.218 0.134-0.361 0.371-0.361 0.642s0.143 0.508 0.358 0.64l0.003 0.002 4.402 2.667-0.723 2.941h-5.291c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h28c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0zM13.568 19.875c-2.337-0.979-3.949-3.248-3.949-5.893 0-3.519 2.853-6.372 6.372-6.372s6.372 2.853 6.372 6.372c0 3.115-2.235 5.708-5.189 6.262l-0.040 0.006h-2.287c-0.485-0.090-0.913-0.22-1.321-0.391l0.042 0.016zM22.651 18.16l0.513 2.090h-2.41c0.753-0.578 1.384-1.27 1.878-2.057l0.019-0.032zM26.553 14l-2.923 1.77c0.13-0.533 0.205-1.145 0.205-1.774 0-0.626-0.074-1.235-0.214-1.818l0.011 0.053zM22.647 9.855c-0.644-1.021-1.485-1.86-2.477-2.482l-0.033-0.019 3.323-0.816zM16 3.447l1.77 2.922c-0.532-0.13-1.142-0.205-1.77-0.205s-1.238 0.075-1.823 0.216l0.053-0.011zM11.856 7.353c-1.023 0.64-1.863 1.479-2.485 2.469l-0.019 0.032-0.814-3.316zM5.447 14l2.919-1.768c-0.131 0.533-0.206 1.144-0.206 1.773 0 0.625 0.074 1.233 0.214 1.816l-0.011-0.053zM9.351 18.151c0.521 0.826 1.164 1.522 1.912 2.085l0.020 0.014h-2.447zM28 24.25h-24c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h24c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0zM26 28.25h-20c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h20c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0z"></path>
        </svg>
      ),
    },
  ];

  const getOverviewIcon = ({ time }: { time: string }) => {
    const hour = parseInt(time.split(":")[0], 10);
    return (
      iconMap.find(({ range }) => hour >= range[0] && hour < range[1])
        ?.icon ?? (
        <svg
          width="30px"
          height="30px"
          viewBox="0 0 15 15"
          fill="currentColor"
          className="text-primary"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.66077 11.3619C2.09296 11.4524 2.54093 11.5 3.00002 11.5C6.58987 11.5 9.50002 8.58987 9.50002 5.00002C9.50002 3.25482 8.81224 1.67027 7.69295 0.502625C11.4697 0.604839 14.5 3.69855 14.5 7.50002C14.5 11.366 11.366 14.5 7.49999 14.5C5.06138 14.5 2.91401 13.253 1.66077 11.3619Z"
            stroke="currentColor"
            strokeLinejoin="round"
          />
        </svg>
      )
    );
  };

  return (
    <div className="flex flex-col w-full h-full gap-5">
      {/* Header */}
      <div className="flex flex-col">
        <div className="flex items-center gap-5 text-xl text-primary">
          {getOverviewIcon({ time })}
          <div className="flex flex-col justify-center">
            <p className="flex font-mono text-[1.5rem]">
              Welcome,{user.first_name}!
            </p>
            <p className="flex font-normal text-(--color-text-primary) text-[0.8rem] text-secondary">
              Your finances are looking healthy this month
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full h-full gap-5">
        {/* Left side */}
        <Card
          header="Transactions"
          subheader="Your transactions for the month of May"
          link="/transactions"
          linkText="See your transactions"
          className="h-full"
        >
          <div className="flex flex-col w-full h-full">
            <div className="grid flex-0 grid-cols-[100px_100px_100px_1fr_100px] gap-4 font-mono text-sm text-secondary py-2 px-5 font-display">
              <div>Icon</div>
              <div>Account</div>
              <div>Type</div>
              <div>Description</div>
              <div>Amount</div>
            </div>

            <div className="flex flex-col flex-1 w-full h-full">
              {transactions.map((transaction, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[100px_100px_100px_1fr_100px] gap-4 items-center py-3 text-[0.9rem] hover:bg-(--color-bg-subtle) hover:cursor-pointer active:bg-(--color-border-default) px-5 border-b border-(--color-border-subtle)"
                >
                  {/* Icon */}
                  <div className="flex items-center">{transaction.icon}</div>

                  {/* Account */}
                  <div className="text-(--color-text-secondary)">
                    {transaction.account}
                  </div>

                  {/* Type */}
                  <div className="text-(--color-text-secondary)">
                    {transaction.type}
                  </div>

                  {/* Transaction */}
                  <div>
                    <p className="text-(--color-text-primary)">
                      {transaction.description}
                    </p>
                  </div>

                  {/* Amount */}
                  <div
                    className={`text-left font-semibold ${
                      transaction.type.match("Expense")
                        ? "text-red-400"
                        : transaction.type.match("Transfer")
                          ? "text-(--color-text-primary)"
                          : "text-green-400"
                    }`}
                  >
                    {transaction.amount}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-0 text-[0.9rem] w-full h-fit px-5 py-2 font-display text-(--color-text-secondary) gap-2 items-center">
              <p>Show data</p>

              <p className="border border-(--color-border-default) px-2 py-2 rounded-lg">
                10
              </p>

              <p>of 200</p>

              <div className="flex flex-auto w-auto" />

              <div className="flex w-fit gap-2">
                {pagination.map((item, index) => (
                  <div
                    className={`border border-(--color-border-default) rounded-lg px-3 py-2 shadow-sm hover:cursor-pointer ${currentPage === item ? "bg-(--color-border-strong) text-white" : null}`}
                    onClick={() => setCurrentPage(item)}
                    key={index}
                  >
                    <p>{item}</p>
                  </div>
                ))}

                <div className="flex w-fit px-3 py-2 font display items-center border border-(--color-border-default) rounded-lg hover:cursor-pointer hover:bg-(--color-border-subtle) shadow-md">
                  <p>Next</p>
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Right side */}
        <div className="flex w-full h-full flex-col gap-5">
          {/* Top */}
          <div className="flex flex-1 w-full h-full gap-5">
            <div className="flex flex-col h-full w-full gap-5">
              {/* Income */}
              <div className="flex h-full border border-(--color-border-default) p-5 rounded-lg shadow-lg justify-center">
                <div className="flex flex-3 flex-col w-full h-full justify-center">
                  <p className="text-[0.9rem] text-(--color-text-primary)">
                    Income
                  </p>
                  <p className="font-mono text-2xl">3,105.25</p>
                </div>

                <div className="flex flex-1 w-full h-full items-center">
                  <div className="flex w-fit h-fit px-5 py-1 rounded-3xl text-white bg-emerald-500 items-center justify-center gap-1">
                    <ArrowUp size={20} />
                    <p className="font-mono text-[0.9rem]">9%</p>
                  </div>
                </div>
              </div>
              {/* Expenses */}
              <div className="flex h-full border border-(--color-border-default) p-5 rounded-lg shadow-lg justify-center">
                <div className="flex flex-3 flex-col w-full h-full justify-center">
                  <p className="text-[0.9rem] text-(--color-text-primary)">
                    Expenses
                  </p>
                  <p className="font-mono text-2xl">1,220.00</p>
                </div>

                <div className="flex flex-1 w-full h-full items-center">
                  <div className="flex w-fit h-fit px-5 py-1 rounded-3xl text-white bg-red-500 items-center justify-center gap-1">
                    <ArrowDown size={20} />
                    <p className="font-mono text-[0.9rem]">3.5%</p>
                  </div>
                </div>
              </div>
            </div>

            <Card header="Quick actions" subheader="Add account or transaction">
              <div className="flex flex-col p-5 gap-5">
                <div className="flex w-full px-2 py-3 gap-2 border border-(--color-brand-green) rounded-lg text-[0.95rem] hover:bg-(--color-brand-green) cursor-pointer transition-all duration-150">
                  <Plus size={20} />
                  <p>Add a transaction</p>
                </div>

                <div className="flex w-full px-2 py-3 gap-2 border border-(--color-brand-green) rounded-lg text-[0.95rem] hover:bg-(--color-brand-green) cursor-pointer transition-all duration-150">
                  <Plus size={20} />
                  <p>Add an account</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Bottom */}
          <Card
            className="flex flex-3 w-full h-full"
            header="Accounts"
            subheader="All accounts and account categories"
            linkText="See all accounts"
            link="/accounts"
          >
            <div className="flex w-full h-full">
              {/* Left side */}
              <div className="flex flex-col flex-2 w-full h-full border-r border-(--color-border-default)">
                <div className="grid w-full h-fit font-mono grid-cols-[100px_100px_100px_150px] px-5 py-1 text-[0.9rem] border-b border-(--color-border-default)">
                  <p>Name</p>
                  <p>Type</p>
                  <p>Amount</p>
                  <p>Description</p>
                </div>

                <div className="flex flex-col flex-3 w-full h-full">
                  {accounts.map((item, index) => (
                    <div
                      className="grid grid-cols-[100px_100px_100px_150px] w-full h-fit px-5 py-3 text-[0.9rem] border-b border-(--color-border-subtle) cursor-pointer hover:bg-(--color-bg-subtle)"
                      key={index}
                    >
                      <p>{item.name}</p>
                      <p>{item.type}</p>
                      <p
                        className="font-mono 
                    "
                      >
                        {item.amount}
                      </p>
                      <p>
                        {item.description === null ? "-" : item.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-0 w-full h-fit px-3 py-2 text-[0.9rem] text-(--color-text-secondary) items-center justify-center">
                  <div className="flex w-fit h-fit items-center">
                    <p>Show data</p>

                    <p className="border border-(--color-border-default) px-2 py-2 mx-2 rounded-lg">
                      10
                    </p>

                    <p>of 200</p>
                  </div>

                  <div className="flex flex-auto w-auto h-fit" />

                  <div className="flex w-fit gap-2">
                    {pagination.map((item) => (
                      <div
                        className={`border border-(--color-border-default) rounded-lg px-3 py-2 shadow-sm hover:cursor-pointer ${accountCurrentPage === item ? "bg-(--color-border-strong) text-white" : null}`}
                        onClick={() => setAccountCurrentPage(item)}
                      >
                        <p>{item}</p>
                      </div>
                    ))}

                    <div className="flex w-fit px-3 py-2 font display items-center border border-(--color-border-default) rounded-lg hover:cursor-pointer hover:bg-(--color-border-subtle) shadow-md">
                      <p>Next</p>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex flex-col flex-1 w-full h-full">
                <div className="flex w-full h-fit px-5 py-1 font-mono text-[0.9rem] border-b border-(--color-border-default)">
                  <p>Categories</p>
                </div>

                {/* Account categories */}
                <div className="flex w-full flex-col h-full flex-1 px-3 py-2 gap-3">
                  {accountCategories.map((item, index) => (
                    <div
                      className="flex flex-col border border-(--color-border-default) rounded-lg px-2 py-1 text-[0.9rem]"
                      key={index}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
