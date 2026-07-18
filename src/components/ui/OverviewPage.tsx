"use client";

import { useEffect, useRef, useState } from "react";
import Card from "@/components/layout/Card";
import {
  ArrowUp,
  BaggageClaim,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleDollarSign,
  PiggyBank,
  Plus,
  X,
} from "lucide-react";
import * as echarts from "echarts";
import IncomeBreakdownPage from "@/components/layout/IncomeBreakdown";
import ExpenseBreakdownPage from "@/components/layout/ExpenseBreakdown";
import AddTransaction from "@/components/layout/Transaction/AddTransaction";
import { PostgrestError } from "@supabase/supabase-js";
import { iconMap } from "@/lib/Icons";
import ConvertTimestampToDateTime from "@/utils/convertToDateTime";
import { getOverviewData } from "@/lib/data/overview";

export default function OverviewPage() {
  // variables - general
  const [time, setTime] = useState("");
  const [isAccountModal, setIsAccountModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState(1);
  const [chosenAccountType, setChosenAccountType] = useState(false);
  const [accountDropdownClicked, setAccountDropdownClicked] = useState(false);
  const pagination = [1, 2, 3];

  const labels = [
    { name: "Income", component: <IncomeBreakdownPage /> },
    { name: "Expenses", component: <ExpenseBreakdownPage /> },
  ];
  const [chosenPage, setChosenPage] = useState<React.ReactNode>(
    <IncomeBreakdownPage />,
  );

  // pagination
  const [currentPage, setCurrentPage] = useState<number>(0);

  // fetch data
  const [transactData, setTransactData] = useState<any[] | null>(null);
  const [accountData, setAccountData] = useState<any[] | null>(null);
  const [balanceData, setBalanceData] = useState<any[] | null>(null);
  const [transactError, setTransactError] = useState<PostgrestError | null>(null)
  const [balanceError, setBalanceError] = useState<PostgrestError | null>(null);
  const [accountError, setaccountError] = useState<PostgrestError | null>(null);
  const [loadingTransactions, setLoadingTransactions] = useState(false); 
  const [loadingAccounts, setLoadingAccounts] = useState(false); 

  const fetchData = async (page: number) => {
    setLoadingAccounts(true)
    setLoadingTransactions(true)

    const { transactionData, transactionError, accountsData, accountsError, balancesData, balancesError } = await getOverviewData(page);
    if (!transactionData || !accountsData || !balancesData) {
      setTransactError(transactionError)
      setBalanceError(balancesError)
      setaccountError(accountsError)
      setLoadingAccounts(false);
      setLoadingTransactions(false);
    }
    setTransactData(transactionData)
    setAccountData(accountsData)
    setBalanceData(balancesData)
    setLoadingAccounts(false);
    setLoadingTransactions(false);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // variables for the stacked bar chart
  const sixMonthsRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  const [transactionModalOpen, setIsTransactionModalOpen] =
    useState<boolean>(false);

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
        data: "",
      },
      yAxis: {
        type: "value",
        data: "",
      },
      series: [
        {
          type: "bar",
          data: "",
          stack: "total",
        },
        {
          type: "bar",
          data: "",
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
  }, []);

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
      {/* Create a transaction */}
      <AddTransaction
        iconLeft={<PiggyBank size={20} />}
        title="Add a transaction"
        openModal={transactionModalOpen}
        setOpenModal={setIsTransactionModalOpen}
      />

      {/* Create an account */}
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
                  <div className="flex flex-col h-fit absolute top-22 z-50 left-32 w-40 border border-(--color-border-default) rounded-lg bg-(--color-bg-secondary)"></div>
                )}
              </div>
            </div>

            {/* Footer - button */}
            <div className="flex w-full pt-7">
              <div
                className="flex bg-(--color-brand-green) rounded-lg shadow-md hover:bg-(--color-brand-green-accent) active:bg-emerald-700 items-center justify-center px-5 py-1 w-full cursor-pointer"
                onClick={() => setIsAccountModal(false)}
              >
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
            <p className="flex font-mono text-[1.5rem]">Welcome, Juan!</p>
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

            {/* Quick actions */}
            <div className="flex flex-col flex-2 border border-(--color-border-default) rounded-lg shadow-md w-full h-full p-5 gap-2">
              <p className="text-xl font-semibold">Quick Actions</p>
              <div className="flex w-full h-full gap-5 flex-col md:flex-row">
                <div
                  className="flex flex-1 bg-(--color-brand-green) text-white rounded-lg shadow-md items-center justify-center text-[0.9rem] gap-1 py-2 cursor-pointer hover:bg-(--color-brand-green-accent) duration-100 transition-all active:bg-emerald-600"
                  onClick={() => setIsTransactionModalOpen((prev) => !prev)}
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
              className="flex flex-col w-full h-125 border border-(--color-border-default) rounded-lg shadow-md"
              link="/transactions"
              linkText="View transactions"
            >
              <div className="flex relative flex-col overflow-auto">
                {transactData ? (
                  <div className="flex flex-col w-full h-full">
                    {transactData?.map((item) => (
                      <div className="flex w-full h-17 justify-between hover:bg-(--color-bg-subtle) border-b border-(--color-border-subtle) px-5 py-3 cursor-pointer">
                        <div className="flex flex-col w-[65%]">
                          <p className="font-display text-[0.85rem] line-clamp-1">
                            {item.description}
                          </p>
                          <p className="text-(--color-text-secondary) text-[0.7rem]">
                            {ConvertTimestampToDateTime(item.date_time)}
                          </p>
                        </div>

                        <div className="flex w-[35%] h-full items-center justify-end">
                          <p
                            className={`text-[1rem] font-mono ${item.type === "income" ? "text-emerald-500" : item.type === "expense" ? "text-red-500" : "text-(--color-text-primary)"}`}
                          >
                            {item.amount}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="absolute z-50 bg-black/20 flex w-full h-full inset-0 items-center justify-center">
                    <div className="flex border border-(--color-border-default) bg-(--color-bg-secondary) rounded-lg shadow-md px-5 py-2">
                      {loadingTransactions ? (
                        <div className="flex w-full items-center gap-4">
                          <p className="text-[0.9rem] font-mono">
                            Loading transactions...
                          </p>
                        </div>
                      ) : (
                        <div className="flex w-full items-center gap-4">
                          <CircleAlert size={15} />
                          <p className="text-[0.9rem]">{"Error: " + transactError}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
                  <p>Description</p>
                  <p>Type</p>
                  <p>Balance</p>
                </div>
              </div>

              {/* Accounts table */}
              <div className="flex relative flex-2 flex-col w-full h-fit overflow-y-auto">
                {accountData ? (
                  <div className="flex flex-col w-full h-full">
                    {accountData?.map((item, key) => (
                      <div
                        className="grid grid-cols-[1fr_1fr_1fr_1fr] w-full h-17 border-b border-(--color-border-subtle) px-5 py-2 text-[0.9rem]"
                        key={key}
                      >
                        <div className="">{item.name}</div>
                        <div className="text-(--color-text-secondary)">
                          {item.description}
                        </div>
                        <div className="">{item.category_id?.name}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="absolute z-50 inset-0 flex w-full h-full bg-black/50 items-center justify-center">
                    <div className="flex border border-(--color-border-default) bg-(--color-bg-secondary) rounded-lg shadow-md px-5 py-2">
                      {loadingAccounts ? (
                        <div className="flex w-full items-center gap-4">
                          <p className="text-[0.9rem] font-mono">
                            Loading accounts...
                          </p>
                        </div>
                      ) : (
                        <div className="flex w-full items-center gap-4">
                          <CircleAlert size={15} />
                          <p className="text-[0.9rem]">
                            {"Error: " + accountError + balanceError}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
