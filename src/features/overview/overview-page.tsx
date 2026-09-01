"use client";

import { useEffect, useState } from "react";
import Card from "@/components/layout/card";
import { BaggageClaim, CircleDollarSign, PiggyBank, Plus } from "lucide-react";
import IncomeBreakdownPage from "@/features/overview/components/breakdown-income";
import ExpenseBreakdownPage from "@/features/overview/components/breakdown-expense";
import SixMonthsRef from "../../components/charts/BarChart";
import { getMonthlyInflowOutflow } from "@/features/overview/api/fetchChartData";
import Snippet from "./components/snippet-income-expense";
import TransactionList from "../transactions/components/transaction-partial";
import OverviewHeader from "./components/icon-and-name";
import AddAccountModal from "../accounts/components/add-account-modal";
import {
  CalculateTotalEarnings,
  FetchAccounts,
  FetchTransaction,
} from "@/lib/supabase/actions/database";
import TransactionModal from "../transactions/components/transaction-modal";
import AccountsPartialList from "./components/accounts-partial";
import {
  AccountCategories,
  AccountsWithBalance,
  TransactionSearchResults,
} from "@/lib/types/derived";
import Skeleton from "@/components/layout/skeleton/skeleton-file";

export default function OverviewPage() {
  // variables - general
  const [toggle, setToggle] = useState<string | null>(null);
  const [totalNumberOfItems, setTotalNumberOfItems] = useState<
    number | null | undefined
  >(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // for doughnut charts (income and expense)
  const labels = [
    { name: "Income", key: "income" as const },
    { name: "Expenses", key: "expense" as const },
  ];
  const [chosenPage, setChosenPage] = useState<"income" | "expense">("income");

  // fetch data
  const [transactionData, setTransactionData] = useState<
    TransactionSearchResults[]
  >([]);
  const [accounts, setAccounts] = useState<
    AccountsWithBalance[] | null | undefined
  >(null);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountCategoriesData, setAccountCategoriesData] = useState<
    Pick<AccountCategories, "id" | "name">[]
  >([]);
  const [calculateError, setCalculateError] = useState<string | null>(null);

  // loading states
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  // sixmonthsbarchart
  const [xAxisLabels, setXAxisLabels] = useState<string[] | never[]>();
  const [inflowData, setInflowData] = useState<number[] | never[]>();
  const [outflowData, setOutflowData] = useState<number[] | never[]>();

  // page header
  const [total, setTotal] = useState<number | null>(null);

  //declare page title
  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  // fetch accounts
  const fetchData = async () => {
    setLoadingTransactions(true);
    setLoadingAccounts(true);
    setLoading(true);

    try {
      const [accountsResult, transactionResult] = await Promise.all([
        FetchAccounts(currentPage, 4),
        FetchTransaction(currentPage, 9),
      ]);

      if (!accountsResult.success) {
        setAccountError(accountsResult.error);
        setLoading(false);
        return;
      } else {
        setAccounts(accountsResult.accountsData);
        setAccountCategoriesData(accountsResult.accountCategoriesData);
        setTotalNumberOfItems(accountsResult.totalItems);
        setLoading(false);
      }

      // --- transactions handling ---
      if (!transactionResult.success) {
        setTransactionError(transactionResult.error);
        setLoading(false);
        return;
      } else {
        const sortedTransactions = [...(transactionResult.data ?? [])].sort(
          (a, b) =>
            new Date(b.date_time).getTime() - new Date(a.date_time).getTime(),
        );
        setTransactionData(sortedTransactions);
        setLoading(false);
      }

      // --- retrieve total count ---
      const result = await CalculateTotalEarnings();
      if (!result.success) {
        setCalculateError(result.error ?? "Fetching total earnings failed");
        setLoading(false);
        return;
      } else {
        const row = result.data?.[0];
        const total = (
          Number(row?.total_income ?? 0.0) - Number(row?.total_expense ?? 0.0)
        ).toFixed(2);
        setTotal(Number(total));
        setLoading(false);
        return;
      }
    } catch (err) {
    } finally {
      setLoading(false);
      setLoadingAccounts(false);
      setLoadingTransactions(false);
    }
  };

  // call fetchData()
  useEffect(() => {
    fetchData();
  }, [currentPage]);

  // inflows and outflows
  useEffect(() => {
    getMonthlyInflowOutflow().then(
      ({ xAxisLabels, inflowData, outflowData }) => {
        setXAxisLabels(xAxisLabels);
        setInflowData(inflowData);
        setOutflowData(outflowData);
      },
    );
  }, []);

  return (
    <div className="flex flex-col w-full h-full gap-5 overflow-x-hidden">
      {toggle === "add-transaction" && (
        <div className="fixed z-50 inset-0 bg-black/50 flex w-full h-full items-center justify-center">
          <TransactionModal
            modalType="add"
            open
            onOpen={() => setToggle(null)}
            onCancel={() => setToggle(null)}
            fetch={fetchData}
          />
        </div>
      )}
      {toggle === "add-account" && (
        <AddAccountModal
          open
          onOpen={() => setToggle(null)}
          accountCategoriesData={accountCategoriesData}
          refresh={fetchData}
        />
      )}

      {/* Header */}
      <OverviewHeader />

      {/* Main Content */}
      <div className="flex flex-col 2xl:flex-row w-full md:h-full gap-5">
        {/* Left side */}
        <div className="flex flex-1 flex-col w-full h-full gap-5">
          <div className="flex w-full flex-col gap-1">
            <p className="text-[0.8rem]">Total earnings</p>
            {loading ? (
              <div className="flex gap-3 w-fit h-13">
                <Skeleton className="flex w-10 h-full" />
                <Skeleton className="flex w-50 h-full" />
              </div>
            ) : (
              <p className="flex text-5xl font-display tracking-tight">
                <span className="text-3xl self-end mr-2 font-display">₱</span>
                {total?.toLocaleString("en-us", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="flex flex-col md:flex-row w-full h-fit gap-5">
            <Snippet type="income" />
            <Snippet type="expense" />

            {/* Quick actions */}
            <div className="flex flex-col flex-2 border border-(--color-border-default) rounded-lg shadow-md w-full h-full p-5 gap-2">
              <p className="text-xl font-semibold">Quick Actions</p>
              <div className="flex w-full h-full gap-5 flex-col md:flex-row">
                <div
                  className="flex flex-1 bg-(--color-brand-green) text-white rounded-lg shadow-md items-center justify-center text-[0.9rem] gap-1 py-2 cursor-pointer hover:bg-(--color-brand-green-accent) duration-100 transition-all active:bg-emerald-600"
                  onClick={() => setToggle("add-transaction")}
                >
                  <Plus size={20} />
                  <p className="hidden lg:block whitespace-nowrap">
                    Add a transaction
                  </p>
                </div>

                <div
                  className="flex flex-1 ring ring-inset ring-(--color-brand-green) hover:bg-(--color-brand-green) hover:text-white rounded-lg shadow-md items-center justify-center text-[0.9rem] gap-1 py-2 cursor-pointer duration-100 transition-all active:bg-emerald-600"
                  onClick={() => setToggle("add-account")}
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
          <div className="flex flex-col md:flex-row w-full h-full gap-5">
            {/* Pie chart */}
            <div className="flex flex-col w-full h-75 md:h-full border border-(--color-border-default) rounded-lg px-5 py-3 gap-2 shadow-md">
              <div className="flex w-full h-fit justify-between">
                <p className="text-sm text-(--color-text-secondary) font-mono">
                  Transfers are not included.
                </p>

                <div className="flex w-fit h-fit gap-4">
                  {labels.map((item) => (
                    <div
                      className={`flex w-fit h-full px-5 py-1 border border-(--color-border-default) text-[0.8rem] rounded-lg items-center cursor-pointer hover:bg-(--color-bg-subtle)${chosenPage === item.key ? "active:bg-(--color-border-strong)" : ""} duration-100 transition-all`}
                      key={item.key}
                      onClick={() => setChosenPage(item.key)}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-3 w-full">
                {chosenPage === "income" ? (
                  <IncomeBreakdownPage />
                ) : (
                  <ExpenseBreakdownPage />
                )}
              </div>
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
              subheader="Most recent transactions"
              linkText="View transactions"
            >
              {transactionError ? (
                <div className="flex w-full h-full items-center justify-center text-[0.9rem]">
                  <p>{transactionError}</p>
                </div>
              ) : (
                <TransactionList
                  transactionData={transactionData}
                  transactionError={transactionError}
                  loading={loadingTransactions}
                />
              )}
            </Card>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-1 w-full flex-col gap-5">
          {/* Stacked bar chart */}
          <div className="flex flex-0 flex-col w-full h-100 md:h-full border border-(--color-border-default) rounded-lg px-5 py-3 shadow-md">
            {/* Header */}
            <div className="flex w-full h-fit items-center">
              <p className="font-display text-xl font-semibold">
                Inflows and outflows{" "}
                <span className="text-[0.9rem] font-light">
                  ( general, all accounts )
                </span>
              </p>
            </div>

            <SixMonthsRef
              inflowData={inflowData}
              outflowData={outflowData}
              xAxisLabels={xAxisLabels}
            />

            {/* Footer */}
            <div className="flex w-full h-fit gap-10 justify-center">
              <div className="flex h-fit gap-2">
                <div className="flex rounded-md bg-[#4ECDC4] px-4" />
                <p className="font-display text-[0.9rem]">Inflows</p>
              </div>

              <div className="flex h-fit gap-2">
                <div className="flex rounded-md bg-[#FF6B6B] px-4" />
                <p className="font-display text-[0.9rem]">Outflows</p>
              </div>
            </div>
          </div>

          {/* Accounts list */}
          <Card
            className="flex flex-2 shrink-0 h-100 lg:flex-2 flex-col w-full"
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
                <p>Category</p>
                <p>Balance</p>
              </div>
            </div>

            <AccountsPartialList
              accountsData={accounts}
              accountsError={accountError}
              totalNumberOfItems={totalNumberOfItems}
              pressedCurrentPage={(page) => setCurrentPage(page)}
              loading={loadingAccounts}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
