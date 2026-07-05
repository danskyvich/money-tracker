"use client";

import { useEffect, useRef, useState } from "react";
import Card from "@/components/layout/Card";
import {
  ArrowUp,
  BaggageClaim,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleDollarSign,
  Coins,
  PiggyBank,
  Plus,
  X,
} from "lucide-react";
import {
  MonthlyInflowOutflows,
  TransactionCategories,
  transactions,
} from "@/lib/mocks/mockTransactions";
import * as echarts from "echarts";
import IncomeBreakdownPage from "@/components/layout/IncomeBreakdown";
import ExpenseBreakdownPage from "@/components/layout/ExpenseBreakdown";
import { accountCategories, accounts, monthlyExpenses, monthlyIncome } from "@/lib/mocks/mockAccounts";
import Input from "@/components/layout/Input";

export default function Overview() {

  // variables - general
  const [time, setTime] = useState("");
  const [isAccountModal, setIsAccountModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState(1);
  const pagination = [1, 2, 3];

  // Transaction modal
  const types = ['Income', 'Expense', 'Transfer'];
  const labels = [
    { name: "Income", component: <IncomeBreakdownPage /> },
    { name: "Expenses", component: <ExpenseBreakdownPage /> },
  ];
  const [chosenPage, setChosenPage] = useState<React.ReactNode>(
    <IncomeBreakdownPage />,
  );

  const categoryMap: {[key: string]: string | undefined} = {
    "Income": monthlyIncome[0]?.category,
    "Expenses": monthlyExpenses[0]?.category,
  }
  const [isTransactionModal, setIsTransactionModal] = useState<boolean>(false);
  const [chosenType, setChosenType] = useState("Income");

  // category dropdown
  const [chosenCategory, setChosenCategory] = useState(
    categoryMap[chosenType] ?? null,
  );
  const [categoryDropdownClicked, setCategoryDropdownClicked] = useState(false);

  // account dropdown
  const [chosenAccount, setChosenAccount] = useState(accounts.map(item => item.name)[0]);
  const [accountDropdownClicked, setAccountDropdownClicked] = useState(false)

  //account type
  const [chosenAccountType, setChosenAccountType] = useState(accountCategories.map(item => item)[0]);

  // date and time

  // variables for the stacked bar chart
  const sixMonthsRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  //declare page title
  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  //stacked bar chart
  useEffect(() => {
    const options = {
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "shadow",
        },
      },
      color: ["#FF6B6B", "#4ECDC4"],
      grid: {
        left: "30px",
        right: "15px",
        top: "30px",
        bottom: "30px",
        containLabel: true,
      },
      label: {
        show: false,
      },
      AvoidLabelOverlap: true,
      xAxis: {
        data: MonthlyInflowOutflows.map((item) => item.month),
      },
      yAxis: {
        type: "value",
        data: Math.ceil(
          Math.max(
            ...MonthlyInflowOutflows.map(
              (item) => item.inflows + item.outflows,
            ),
          ) / 100,
        ),
      },
      series: [
        {
          type: "bar",
          data: MonthlyInflowOutflows.map((item) => item.inflows),
          stack: "total",
        },
        {
          type: "bar",
          data: MonthlyInflowOutflows.map((item) => item.outflows),
          stack: "total",
        },
      ],
    };

    // attach container ref to chartRef if chartRef is null
    if (!chartRef.current && sixMonthsRef.current) {
      chartRef.current = echarts.init(sixMonthsRef.current);
    }

    if (chartRef.current) {
      chartRef.current.setOption(options);
    }

    // function for handling resize
    const handleResize = () => chartRef.current?.resize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [MonthlyInflowOutflows]);

  // get the time
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

  //close account modal
  const handleCloseAccountDropdown = (item: string) => {
    setAccountDropdownClicked(false);
    setChosenAccount(item);
  }

  //close category modal
  const handleCloseCategoryDropdown = (item: string) => {
    setCategoryDropdownClicked(false);
    setChosenCategory(item);
  }

  // Sun & moon icons
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

  //get icon from overview icons
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
      {/* Add Transaction Modal */}
      {isTransactionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 shadow-md">
          <div className="p-5 w-50 transform:translate(-50%, -50%) md:w-100 border border-(--color-border-default) rounded-xl bg-(--color-bg-secondary) shadow-md">
            <div className="flex w-full justify-between items-center">
              <Coins size={20} />
              <p className="font-semibold text-xl">Add a transaction</p>
              <X
                size={15}
                onClick={() => setIsTransactionModal(false)}
                className="cursor-pointer"
              />
            </div>

            <div className="flex justify-around w-full mt-7 mb-2 gap-2">
              {types.map((item, index) => (
                <div
                  key={index}
                  className={`inline-flex w-full text-center ring ring-inset ring-(--color-border-strong) rounded-lg px-5 py-1 text-[0.9rem] cursor-pointer duration-100 transition-all ${chosenType === item ? (item === "Income" ? "bg-(--color-brand-green) text-white ring-(--color-brand-green)" : item === "Expense" ? "bg-red-400 ring-red-400 text-white" : "ring-blue-400 text-white bg-blue-400") : null}`}
                  onClick={() => setChosenType(item)}
                >
                  <p>{item}</p>
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="grid grid-cols-[1fr_2fr] gap-y-2 w-full py-2 text-[0.9rem] items-center">
              {/* Date */}
              <p>Date</p>
              <div className="inline-flex w-full gap-5">
                <div className="border border-(--color-border-default) rounded-lg px-5 py-1 cursor-pointer hover:bg-(--color-bg-subtle) w-full">
                  <p>6/26/2026</p>
                </div>
                <div className="border border-(--color-border-default) rounded-lg px-5 py-1 cursor-pointer hover:bg-(--color-bg-subtle) w-full">
                  <p>11:50 AM</p>
                </div>
              </div>

              {/* Category */}
              <p>Category</p>
              <div
                className="inline-flex relative justify-between items-center border border-(--color-border-default) rounded-lg px-5 py-1 cursor-pointer hover:bg-(--color-bg-subtle)"
                onClick={() => setCategoryDropdownClicked((prev) => !prev)}
              >
                <p>{chosenCategory}</p>
                {categoryDropdownClicked ? (
                  <ChevronUp size={15} />
                ) : (
                  <ChevronDown size={15} />
                )}

                {categoryDropdownClicked && (
                  <div className="flex flex-col top-10 right-17 z-50 absolute w-fit border border-(--color-border-subtle) bg-(--color-bg-base) rounded-lg shadow-md">
                    {TransactionCategories.map((item) => (
                      <div
                        className="flex w-full border-b border-(--color-border-subtle) hover:bg-(--color-bg-subtle) cursor-pointer px-5 py-1"
                        onClick={() => handleCloseCategoryDropdown(item)}
                        key={item}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Account */}
              {chosenType !== "Transfer" ? (
                <>
                  <p>Account</p>
                  <div>
                    <div
                      className="flex relative border justify-between items-center border-(--color-border-default) rounded-lg text-[0.9rem] px-5 py-1 cursor-pointer hover:bg-(--color-bg-subtle)"
                      onClick={() => setAccountDropdownClicked((prev) => !prev)}
                    >
                      <p>{chosenAccount}</p>
                      {accountDropdownClicked ? (
                        <ChevronUp size={15} />
                      ) : (
                        <ChevronDown size={15} />
                      )}
                    </div>

                    {accountDropdownClicked && (
                      <div className="flex flex-col mt-2 rounded-lg absolute border border-(--color-border-default) bg-(--color-bg-base)">
                        {accounts.map((item, index) => (
                          <div
                            className="flex w-full px-5 py-1 cursor-pointer hover:bg-(--color-bg-subtle) border-b border-(--color-border-subtle)"
                            onClick={() =>
                              handleCloseAccountDropdown(item.name)
                            }
                            key={index}
                          >
                            {item.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p>From</p>
                  <div>
                    <div className="flex border justify-between items-center border-(--color-border-default) rounded-lg text-[0.9rem] px-5 py-1 cursor-pointer hover:bg-(--color-bg-subtle)">
                      <p>{chosenAccount}</p>
                      <ChevronDown size={15} />
                    </div>
                  </div>

                  <p>To</p>
                  <div>
                    <div className="flex border justify-between items-center border-(--color-border-default) rounded-lg text-[0.9rem] px-5 py-1 cursor-pointer hover:bg-(--color-bg-subtle)">
                      <p>{chosenAccount}</p>
                      <ChevronDown size={15} />
                    </div>
                  </div>
                </>
              )}

              <p>Amount</p>
              <div>
                <input
                  placeholder="0.00"
                  className="focus:outline-none  border border-(--color-border-default) rounded-lg w-full px-5 py-1"
                />
              </div>

              <label htmlFor="note">Note</label>
              <div>
                <textarea
                  id="note"
                  rows={4}
                  className="w-full border border-(--color-border-default) rounded-lg focus:outline-none resize-none px-5"
                ></textarea>
              </div>
            </div>

            <div className="flex w-full mt-10 mb-3">
              <div className="cursor-pointer hover:bg-emerald-600 active:bg-emerald-700 bg-(--color-brand-green) text-white rounded-lg text-[0.9rem] px-5 py-1 items-center justify-center w-full text-center">
                <p onClick={() => setIsTransactionModal(false)}>
                  Add transaction
                </p>{" "}
                {/* Handle data processing here... */}
              </div>
            </div>
          </div>
        </div>
      )}

      {isAccountModal && (
        
        <div className="fixed inset-0 z-50 flex items-center justify-center shadow-md bg-black/50">

          {/* Modal */}
          <div className="p-5 w-50 transform:translate(-50, -50%) bg-(--color-bg-secondary) md:w-100 border border-(--color-border-default) rounded-lg shadow-md">

            {/* Header */}
            <div className="flex w-full justify-between items-center">
              <PiggyBank size={20} />
              <p className="font-semibold text-xl whitespace-nowrap">
                Add an account
              </p>
              <X
                size={20}
                onClick={() => setIsAccountModal(false)}
                className="cursor-pointer"
              />
            </div>

            {/* Content */}
            <div className="flex-col relative flex w-full h-full my-5">
              <div className="grid grid-cols-[1fr_2fr] w-full h-full text-[0.9rem] gap-y-3 gap-2 items-center">
                <label htmlFor="nameInput">Name</label>
                <input
                  id="nameInput"
                  className="focus:outline-none border border-(--color-border-default) rounded-lg px-3 py-1"
                />

                <p>Type</p>
                <div
                  className="relative flex w-full justify-between border border-(--color-border-default) items-center px-5 py-1 rounded-lg hover:bg-(--color-bg-subtle) cursor-pointer"
                  onClick={() => setAccountDropdownClicked((prev) => !prev)}
                >
                  <p>{chosenAccountType}</p>
                  {accountDropdownClicked ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>

                {accountDropdownClicked && (
                  <div className="flex flex-col h-fit absolute top-22 z-50 left-32 w-40 border border-(--color-border-default) rounded-lg bg-(--color-bg-secondary)">
                    {accountCategories.map((item) => (
                      <div className="border-b border-(--color-border-subtle) px-5 py-1 hover:bg-(--color-bg-subtle) cursor-pointer" onClick={() => {setChosenAccountType(item); setAccountDropdownClicked(false)}}>{item}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer - button */}
            <div className="flex w-full pt-7">
              <div className="flex bg-(--color-brand-green) rounded-lg shadow-md hover:bg-(--color-brand-green-accent) active:bg-emerald-700 items-center justify-center px-5 py-1 w-full cursor-pointer" onClick={() => setIsAccountModal(false)}>
                <p className="text-[0.9rem]">Add account</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col">
        <div className="flex items-center gap-5 text-xl text-primary">
          {getOverviewIcon({ time })}
          <div className="flex flex-col justify-center">
            <p className="flex font-mono text-[1.5rem]">
              Welcome, Juan!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col 2xl:flex-row w-full md:h-full gap-5">
        {/* Left side */}
        <div className="flex flex-1 flex-col w-full h-full gap-5">
          <div className="flex w-full flex-col gap-1">
            <p className="text-[0.8rem]">Total earnings</p>
            <p className="flex text-5xl font-display font-semibold">
              <span className="text-3xl self-end mr-2">₱</span>
              3,100.00
            </p>
          </div>

          {/* Summary */}
          <div className="flex flex-col md:flex-row w-full h-fit gap-5">
            <div className="flex flex-col h-31.5 flex-1 border border-(--color-border-default) rounded-xl px-5 py-3 shadow-md">
              <p className="font-semibold">Income</p>
              <div className="flex flex-auto w-auto h-full" />
              <p className="flex text-2xl font-display font-normal">
                <span className="mr-1">₱</span>
                2,311.25
              </p>
              <div className="flex w-full items-center text-sm mt-1 text-(--color-text-secondary)">
                <p>Growth rate</p>

                <div className="flex w-auto flex-auto" />
                <ArrowUp size={15} />
                <p>20%</p>
              </div>
            </div>

            <div className="flex flex-col h-31.5 flex-1 border border-(--color-border-default) rounded-xl px-5 py-3 shadow-md">
              <p className="font-semibold">Expenses</p>
              <div className="flex flex-auto w-auto h-full" />
              <p className="flex text-2xl font-display font-normal">
                <span className="mr-1">₱</span>
                776.00
              </p>
              <div className="flex w-full items-center text-sm mt-1 text-(--color-text-secondary)">
                <p>Spending rate</p>

                <div className="flex w-auto flex-auto" />
                <ArrowUp size={15} />
                <p>5%</p>
              </div>
            </div>

            <div className="flex flex-col flex-2 border border-(--color-border-default) rounded-lg shadow-md w-full h-full p-5 gap-2">
              <p className="text-xl font-semibold">Quick Actions</p>
              <div className="flex w-full h-full gap-5 flex-col md:flex-row">
                <div
                  className="flex flex-1 bg-(--color-brand-green) text-white rounded-lg shadow-md items-center justify-center text-[0.9rem] gap-1 py-2 cursor-pointer hover:bg-(--color-brand-green-accent) duration-100 transition-all active:bg-emerald-600"
                  onClick={() => setIsTransactionModal((prev) => !prev)}
                >
                  <Plus size={20} />
                  <p className="hidden lg:block whitespace-nowrap">
                    Add a transaction
                  </p>
                </div>

                <div
                  className="flex flex-1 ring ring-inset ring-(--color-brand-green) hover:bg-(--color-brand-green) rounded-lg shadow-md items-center justify-center text-[0.9rem] gap-1 py-2 cursor-pointer duration-100 transition-all active:bg-emerald-600"
                  onClick={() => setIsAccountModal((prev) => !prev)}
                >
                  <PiggyBank size={20} />
                  <p className="hidden lg:block whitespace-nowrap">
                    Add an account
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom side */}
          <div className="flex flex-col md:flex-row w-full h-auto gap-5">
            {/* Pie chart */}
            <div className="flex flex-col w-full h-75 md:h-full border border-(--color-border-default) rounded-lg px-5 py-3 gap-2 shadow-md">
              <div className="flex w-full">
                <div className="flex flex-5 w-auto" />
                <div className="flex flex-1 w-full gap-3">
                  {labels.map((item, index) => (
                    <div
                      className={`flex w-fit h-full px-5 py-1 border border-(--color-border-default) text-[0.8rem] rounded-lg items-center cursor-pointer hover:bg-(--color-bg-subtle)${chosenPage ? "active:bg-(--color-border-strong)" : null} duration-100 transition-all`}
                      key={index}
                      onClick={() => setChosenPage(item.component)}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-3 w-full">{chosenPage}</div>
            </div>

            {/* Transactions list */}
            <Card
              header={
                <div className="flex md:h-auto gap-2 items-center min-h-0">
                  <CircleDollarSign size={20} />
                  <p>Transactions</p>
                </div>
              }
              className="flex flex-col w-full h-[500px] border border-(--color-border-default) rounded-lg shadow-md"
              link="/transactions"
              linkText="View transactions"
            >
              <div className="flex flex-col overflow-auto">
                {transactions.map((item, index) => (
                  <div
                    className="flex w-full h-fit py-2 border border-(--color-border-subtle) gap-3 hover:bg-(--color-bg-subtle) cursor-pointer"
                    key={index}
                  >
                    <div className="flex flex-col flex-2 w-full h-fit pl-5">
                      <p className="text-[0.9rem]">{item.description}</p>
                      <div className="flex flex-1 w-full items-center text-[0.7rem] text-stone-400">
                        <p>{item.date}</p>
                        <div className="flex flex-auto w-auto" />
                        <p>{item.time}</p>
                      </div>
                    </div>

                    <div className="flex flex-1 w-full h-full pr-5 items-center justify-end">
                      <p
                        className={`text-[1rem] font-semibold ${item.type === "Expense" ? "text-red-400" : item.type === "Income" ? "text-green-400" : "text-(--color-text-primary)"}`}
                      >
                        <span className="mr-1">
                          {item.type === "Expense" ? "-" : null}
                        </span>
                        <span className="text-[0.9rem] mr-1 justify-self-end">
                          ₱
                        </span>
                        {item.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-1 w-full flex-col gap-5">
          {/* Stacked bar chart */}
          <div className="flex flex-col w-full h-100 md:h-full border border-(--color-border-default) rounded-lg px-5 py-3 shadow-md">
            {/* Header */}
            <div className="flex w-full h-fit items-center">
              <p className="font-display text-xl font-semibold">
                Inflows and outflows{" "}
                <span className="text-[0.9rem] font-light">
                  ( general, all accounts )
                </span>
              </p>

              <div className="flex flex-auto w-auto" />

              <div className="flex w-fit h-fit items-center gap-1">
                <ChevronDown size={15} />
                <p className="text-[0.8rem]">Monthly</p>
              </div>
            </div>

            {/* Stacked bar chart */}
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                minHeight: 0,
              }}
              ref={sixMonthsRef}
            />

            {/* Footer */}
            <div className="flex w-full h-fit gap-10 justify-center">
              <div className="flex h-fit gap-2">
                <div className="flex rounded-md bg-[#FF6B6B] px-4" />
                <p className="font-mono text-[0.7rem]">Inflows</p>
              </div>

              <div className="flex h-fit gap-2">
                <div className="flex rounded-md bg-[#4ECDC4] px-4" />
                <p className="font-mono text-[0.7rem]">Outflows</p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-2 w-full h-auto gap-5">
            {/* Accounts list */}
            <Card
              className="flex h-100 lg:flex-2 flex-col w-full"
              header={
                <div className="flex gap-2 items-center">
                  <BaggageClaim size={20} />
                  <p>Accounts</p>
                </div>
              }
              link="/accounts"
              linkText="View your accounts"
            >
              <div className="flex flex-col w-full h-fit">
                {/* Header */}
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr] w-full h-full px-5 py-1 font-display text-[0.9rem] border-b border-(--color-border-subtle)">
                  <p>Name</p>
                  <p>Type</p>
                  <p>Amount</p>
                  <p>Description</p>
                </div>
              </div>

              <div className="flex flex-2 flex-col w-full h-fit">
                {accounts.map((item, index) => (
                  <div
                    className="grid grid-cols-[1fr_1fr_1fr_1fr] w-full px-5 py-2 text-[0.9rem] border-b border-(--color-border-subtle) hover:bg-(--color-bg-subtle) cursor-pointer items-center"
                    key={index}
                  >
                    <p className="font-mono text-[0.8rem] text-(--color-text-secondary)">
                      {item.name}
                    </p>
                    <p className="font-mono text-[0.8rem] text-(--color-text-secondary)">
                      {item.type}
                    </p>
                    <p>
                      <span className="mr-1">₱</span>
                      {item.amount}
                    </p>
                    <p className="text-[0.8rem] text-(--color-text-secondary)">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-0 w-full h-fit px-5 py-3 text-[0.9rem] text-(--color-text-secondary) whitespace-nowrap items-center">
                <div className="flex flex-1 w-full h-fit">
                  <p>
                    Show data{" "}
                    <span className="border border-(--color-border-subtle) mx-1 rounded-lg p-2">
                      6
                    </span>
                    of 100
                  </p>
                </div>

                <div className="flex flex-auto w-auto h-fit" />

                <div className="flex flex-1 w-full h-full items-center justify-end gap-2">
                  {pagination.map((item, index) => (
                    <div
                      className={`flex w-fit h-fit px-2 py-1 rounded-md border border-(--color-border-default) ${selectedPage ? "bg-(--color-border-strong)" : null} cursor-pointer hover:bg-(--color-bg-subtle) duration-100 transition-all`}
                      key={index}
                      onClick={() => setSelectedPage(item)}
                    >
                      <p>{item}</p>
                    </div>
                  ))}
                  <div className="flex w-fit h-fit border-(--color-border-default) border rounded-lg px-2 py-2">
                    <ChevronRight size={15} />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
