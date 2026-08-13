"use client";

import ErrorModal from "@/components/layout/error-modal";
import Modal from "@/components/layout/modal";
import { getUser } from "@/lib/supabase/actions/auth";
import { InsertTransaction, UpdateTransaction } from "@/lib/supabase/actions/database";
import { createClient } from "@/lib/supabase/clients/client";
import { Transaction } from "@/lib/types/database";
import { Coins } from "lucide-react";
import { useEffect, useState } from "react";
import TransactionModalSkeleton from "./skeleton/transaction-modal-skeleton";

interface AddTransactionModalProps {
  transaction?: Transaction;
  modalType: string;
  open: boolean;
  onOpen: () => void;
  onCancel: () => void;
  fetch: () => void;
}

export default function TransactionModal({
  transaction,
  modalType,
  open,
  onOpen,
  onCancel,
  fetch,
}: AddTransactionModalProps) {
  const [accounts, setAccounts] = useState<any[] | null>(null);
  const [categories, setCategories] = useState<any[] | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [process, setProcess] = useState<boolean>(false);
  const [account, setAccount] = useState<string>("");
  const [accountTo, setAccountTo] = useState<string | null>("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string | null>(null);
  const [dateTime, setDateTime] = useState<string>("");

  const [transactionError, setTransactionError] = useState<string | null>(
    null,
  );
  const [chosenTransaction, setChosenTransaction] = useState<string>("");

  // fetch accounts and categories
  const fetchData = async () => {
    setLoading(true);
    setAmount(0.00);
    setChosenTransaction(transaction?.id ?? "");
    const [accountsResult, categoriesResult] = await Promise.all([
      (await createClient()).from("accounts").select(`id, name`),
      (await createClient()).from("categories").select(`id, name`),
    ]);

    const { data: accountsData, error: accountsError } = accountsResult;
    const { data: categoriesData, error: categoriesError } = categoriesResult;

    if (accountsError || categoriesError) {
      setTransactionError("Fetching data failed");
      setLoading(false);
      return;
    }
    setAccounts(accountsData);
    setCategories(categoriesData);
    setAccount(transaction?.fromAccount?.id ?? accountsData?.[0]?.id ?? null);
    setAccountTo(transaction?.toAccount?.id ?? accountsData?.[0]?.id ?? null);
    setCategory(transaction?.categories?.id ?? categoriesData?.[0]?.id ?? null);
    {
      modalType === "modify"
        ? setType(transaction?.type ?? "")
        : setType(transactionTypes[0]);
    }
    setAmount(Number(transaction?.amount) ?? 0);
    setDescription(transaction?.description ?? "");
    setDateTime(transaction?.date_time ?? "");

    setLoading(false);
  };

  // set data to all fields
  useEffect(() => {
    fetchData();
  }, []);

  interface TransactionParams {
    account: string;
    amount: number;
    type: string;
    category: string;
    dateTime: string;
    description: string | null;
    accountTo: string | null;
  }

  // add transaction
  const handleAddTransaction = async ({
    account,
    amount,
    type,
    category,
    dateTime,
    description,
    accountTo,
  }: TransactionParams) => {
    setProcess(true);

    // check in fields are populated
    if (!account || !amount || !type || !category || !dateTime) {
      setTransactionError("Form error: fill up all required fields");
      setProcess(false);
      return;
    }

    if (type === "income" || type === "expense") {
      setAccountTo(null);
    }

    if (accounts?.length === 0 || categories?.length === 0) {
      setTransactionError(
        "You need either a single account or transaction category to begin.",
      );
      setProcess(false);
      return;
    }

    // get user_id
    const user = await getUser();
    if (!user) {
      setTransactionError("User is not authenticated");
      setProcess(false);
      return;
    }
    const user_id = user?.id;

    // insert transaction to db
    const { data, error } = await InsertTransaction([
      {
        account_id: account,
        amount,
        category_id: category,
        description: description ?? null,
        user_id,
        to_account_id: accountTo ?? null,
        date_time: dateTime,
        type,
      },
    ]);

    // error checks
    if (error) {
      setTransactionError(error.message);
      setProcess(false);
      return;
    }

    onOpen();
    fetch();
    setProcess(false);
  };

  // modify transaction
  const handleModifyTransaction = async ({
    account,
    amount,
    type,
    category,
    dateTime,
    description,
    accountTo,
  }: TransactionParams) => {
    setProcess(true);

    if (!account || !amount || !type || !category || !dateTime) {
      setTransactionError("Form error: fill up all required fields");
      setProcess(false);
      return;
    }

    const user = await getUser();
    if (!user) {
      setTransactionError("User is not authenticated");
      setProcess(false);
      return;
    }
    const user_id = user.id;

    const { data, error } = await UpdateTransaction(chosenTransaction, [
      {
        account_id: account,
        amount,
        category_id: category,
        description: description ?? null,
        user_id,
        to_account_id: accountTo ?? null,
        date_time: dateTime,
        type,
      },
    ]);

    // error checks
    if (error) {
      setTransactionError(String(error));
      setProcess(false);
      return;
    }

    onOpen();
    fetch();
    setProcess(false);
  };;

  const transactionTypes: string[] = ["income", "expense", "transfer"];

  if (!open) return null;

  return (
    <>
      {transactionError && <ErrorModal message={transactionError} />}
      {loading ? (
        <TransactionModalSkeleton />
      ) : (
        <Modal
          open
          onOpen={onOpen}
          loading={process}
          onCancel={onCancel}
          icon={<Coins size={20} />}
          onConfirm={() => {
            modalType === "add"
              ? handleAddTransaction({
                  account,
                  amount,
                  type,
                  category,
                  dateTime,
                  description,
                  accountTo,
                })
              : handleModifyTransaction({
                  account,
                  amount,
                  type,
                  category,
                  dateTime,
                  description,
                  accountTo,
                });
          }}
          header={
            modalType === "add" ? "Add a transaction" : "Modify the transaction"
          }
          noButtonText="Go back"
          yesButtonText="Add transaction"
        >
          <div className="flex w-full h-fit gap-5 mb-3" role="group">
            {transactionTypes.map((item, key) => (
              <div
                className={`flex ${type === item && "bg-(--color-brand-green) hover:bg-emerald-600"} flex-1 w-full h-fit border border-(--color-border-default) rounded-lg items-center justify-center py-1 hover:bg-(--color-border-subtle) cursor-pointer active:bg-(--color-brand-green-accent)`}
                onClick={() => setType(item)}
                key={key}
              >
                <p className="line-clamp-1 text-[0.9rem] font-mono">{item}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[1fr_1fr] w-full h-full gap-y-3 items-center py-1">
            <label htmlFor="date-time">Date and time</label>
            <input
              id="date-time"
              value={dateTime}
              type="datetime-local"
              className="border border-(--color-border-default) rounded-lg px-3 py-1"
              onChange={(e) => setDateTime(e.target.value)}
            />
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              value={amount ?? 0.00}
              type="text"
              onChange={(e) => setAmount(Number(e.target.value))}
              className="border border-(--color-border-default) rounded-lg px-3 py-1"
              placeholder="50.00"
            />
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-(--color-border-default) rounded-lg px-3 py-1"
            >
              {categories?.map((c) => (
                <option
                  key={c.id}
                  value={c.id}
                  className="bg-(--color-bg-secondary)"
                >
                  {c.name}
                </option>
              ))}
            </select>
            <label htmlFor="account-from">Source account</label>
            <select
              id="account-from"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="border border-(--color-border-default) rounded-lg px-3 py-1"
            >
              {accounts?.map((a) => (
                <option
                  key={a.id}
                  value={a.id}
                  className="bg-(--color-bg-secondary)"
                >
                  {a.name}
                </option>
              ))}
            </select>
            {type === "transfer" && (
              <>
                <label htmlFor="account-to">Destination account</label>
                <select
                  id="account-to"
                  value={accountTo ?? undefined}
                  onChange={(e) => setAccountTo(e.target.value)}
                  className="border border-(--color-border-default) rounded-lg px-3 py-1"
                >
                  {accounts?.map((a) => (
                    <option
                      key={a.id}
                      value={a.id}
                      className="bg-(--color-bg-secondary)"
                    >
                      {a.name}
                    </option>
                  ))}
                </select>
              </>
            )}
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-(--color-border-default) rounded-lg px-3 py-1 resize-none"
              placeholder="e.g Transferred 50.00..."
            />
          </div>
        </Modal>
      )}
    </>
  );
}
