"use client";

import { useEffect, useRef, useState } from "react";
import Card from "@/components/layout/Card";
import {
  BaggageClaim,
  CircleDollarSign,
  PiggyBank,
  Plus,
  X,
} from "lucide-react";
import IncomeBreakdownPage from "@/feature/overview/components/brakdown-income";
import ExpenseBreakdownPage from "@/feature/overview/components/breakdown-expense";
import { getOverviewData } from "@/lib/data/overview";
import SixMonthsRef from "../../components/charts/BarChart";
import { getMonthlyInflowOutflow } from "@/lib/data/fetchChartData";
import Snippet from "../../components/ui/parts/Snippet";
import TransactionWrapper from "./components/transaction-wrapper";
import TransactionList from "../transactions/components/transactions-list";
import AccountsList from "./components/accounts-partial";
import OverviewHeader from "./components/icon-and-name";
import AddAccountModal from "../accounts/components/add-account-modal";

export default function OverviewPage() {
  // variables - general
  const [isAccountModal, setIsAccountModal] = useState(false);
  const [chosenAccountType, setChosenAccountType] = useState<string | null | undefined>(null);
  const [accountDropdownClicked, setAccountDropdownClicked] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] =
    useState<boolean>(false);
  const [totalNumberOfItems, setTotalNumberOfItems] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // for doughnut charts (income and expense)
  const labels = [
    { name: "Income", key: "income" as const },
    { name: "Expenses", key: "expense" as const },
  ];
  const [chosenPage, setChosenPage] = useState<"income" | "expense">("income")

  // fetch data
  const [transactData, setTransactData] = useState<any[] | null>(null);
  const [mergedAccountsData, setMergedAccountsData] = useState<any[] | null | undefined>(null)
  const [categoryData, setCategoryData] = useState<any[] | null>(null);
  const [transactError, setTransactError] = useState<string | null>(null)
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountCategoriesData, setAccountCategoriesData] = useState<any[] | null>(null); 
  const [accountCategoriesError, setAccountCategoriesError] = useState<string | null>(null);
  const [loadingTransactions, setLoadingTransactions] = useState(false); 
  const [loadingAccounts, setLoadingAccounts] = useState(false); 

  // sixmonthsbarchart
  const [xAxisLabels, setXAxisLabels] = useState<string[] | never[]>();
  const [inflowData, setInflowData] = useState<number[] | never[]>();
  const [outflowData, setOutflowData] = useState<number[] | never[]>();

  // main fetchData() function
  const fetchData = async () => {
    setLoadingAccounts(true)
    setLoadingTransactions(true)

    const { transactionData, transactionError, accountsData, accountsError, accountsCount, balancesData, balancesError, categoryData, categoryError, accountCategoriesData, accountCategoriesError } = await getOverviewData(currentPage);
    setTransactError(
      !transactionData ? "Error: " + transactionError?.message : null,
    );
    setAccountError(!accountsData ? "Error: " + accountsError?.message : null);
    setBalanceError(!balancesData ? "Error: " + balancesError?.message : null);
    setCategoryError(!categoryData ? "Error: " + categoryError?.message : null);
    setAccountCategoriesError(!accountCategoriesData ? "Error: " + accountCategoriesError?.message : null);

    const sortedTransactions = [...(transactionData ?? [])].sort((a, b) => b.date_time.localeCompare(a.date_time)); // sorts transaction to most recent using localeCompare()
    setTransactData(sortedTransactions);
    setTotalNumberOfItems(accountsCount);
    setCategoryData(categoryData);
    setAccountCategoriesData(accountCategoriesData);

    setChosenAccountType(
      !chosenAccountType ? accountCategoriesData?.[0].name : chosenAccountType,
    );

    // merge accountsData and balancesData
    const balanceMap = new Map(
      balancesData?.map((b) => [b.account_id, b.balance]) ?? []
    );

    const mergedAccounts = accountsData?.map((account) => ({
      ...account,
      balance: balanceMap.get(account.id) ?? null,
    }));

    setMergedAccountsData(mergedAccounts);
    setLoadingAccounts(false);
    setLoadingTransactions(false);
  };

  // call fetchData()
  useEffect(() => {
    fetchData();
  }, [currentPage]);

  // handle currentPage from AccountsList.tsx
  const handleChildCurrentPage = (page: number) => {
    setCurrentPage(page)
  }

  // inflows and outflows
  useEffect(() => {
    getMonthlyInflowOutflow().then(({ xAxisLabels, inflowData, outflowData}) => {
      setXAxisLabels(xAxisLabels);
      setInflowData(inflowData);
      setOutflowData(outflowData);
    })
  }, [])

  //declare page title
  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  // open modal
  const handleOpenModal = (toggle: boolean) => {
    setIsTransactionModalOpen(toggle)
  }

  // handle submit

  return (
    <div className="flex flex-col w-full h-full gap-5">
      <TransactionWrapper
        toggle={isTransactionModalOpen}
        currentPage={currentPage}
        selectedTransaction={null}
        onClose={() => handleOpenModal(false)}
        accountsData={mergedAccountsData}
        categoryData={categoryData}
        onTransactionSaved={fetchData}
      />

      {/* Create an account */}
      <AddAccountModal
        toggle={isAccountModal}
        accountCategoriesData={accountCategoriesData}
        onClose={() => setIsAccountModal(false)}
        refresh={() => fetchData()}
      />

      {/* Header */}
      <OverviewHeader />

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
            <Snippet type="income" />
            <Snippet type="expense" />

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
                  className="flex flex-1 ring ring-inset ring-(--color-brand-green) hover:bg-(--color-brand-green) hover:text-white rounded-lg shadow-md items-center justify-center text-[0.9rem] gap-1 py-2 cursor-pointer duration-100 transition-all active:bg-emerald-600"
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
              <TransactionList
                transactionData={transactData}
                transactionError={transactError}
                loading={loadingTransactions}
              />
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
                <div className="flex rounded-md bg-[#FF6B6B] px-4" />
                <p className="font-mono text-[0.7rem]">Inflows</p>
              </div>

              <div className="flex h-fit gap-2">
                <div className="flex rounded-md bg-[#4ECDC4] px-4" />
                <p className="font-mono text-[0.7rem]">Outflows</p>
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

            <AccountsList
              accountsData={mergedAccountsData}
              accountsError={accountError}
              balanceError={balanceError}
              loading={loadingAccounts}
              totalNumberOfItems={totalNumberOfItems}
              pressedCurrentPage={(page) => handleChildCurrentPage(page)}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
