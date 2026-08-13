"use client";

import ErrorModal from "@/components/layout/error-modal";
import Modal from "@/components/layout/modal";
import { getUser } from "@/lib/supabase/actions/auth";
import { InsertTransaction, UpdateTransaction } from "@/lib/supabase/actions/database";
import { createClient } from "@/lib/supabase/clients/client";
import { Transaction } from "@/lib/types/database";
import { Coins } from "lucide-react";
import { useEffect, useReducer, useState } from "react";
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
  const [transactionError, setTransactionError] = useState<string | null>(
    null,
  );
  const transactionTypes: string[] = ["income", "expense", "transfer"];

  // fetch accounts and categories
  const fetchData = async () => {
    setLoading(true);

    try {
      const [accountsResult, categoriesResult] = await Promise.all([
      (await createClient()).from("accounts").select(`id, name`),
      (await createClient()).from("categories").select(`id, name`),
    ]);

    const { data: accountsData, error: accountsError } = accountsResult;
    const { data: categoriesData, error: categoriesError } = categoriesResult;

    setAccounts(accountsData);
    setCategories(categoriesData);

    if (accountsError || categoriesError) {
      setTransactionError("Fetching data failed");
      setLoading(false);
      return;
    }
    } catch (err) {
      setTransactionError("Fetching transaction failed");
    } finally {
      setLoading(false);
    }
  };

  // set data to all fields
  useEffect(() => {
    fetchData();
  }, []);

  // interface for submitting the form
  interface TransactionPayload {
    type: string;
    date_time: string;
    amount: number;
    category_id: string;
    account_id: string;
    to_account_id: string | null;
    description: string;
  }

  // set the initial values of all fields
  const initialValues: TransactionPayload = {
    type:
      modalType === "modify"
        ? (transaction?.type ?? transactionTypes[0])
        : transactionTypes[0],
    date_time:
      modalType === "modify"
        ? (transaction?.date_time ?? "")
        : new Date().toISOString().slice(0, 16),
    amount: modalType === "modify" ? Number(transaction?.amount) ?? 0.00 : 0.00,
    category_id:
      modalType === "modify" ? (transaction?.categories?.id ?? "") : "",
    account_id:
      modalType === "modify" ? (transaction?.fromAccount?.id ?? "") : "",
    to_account_id:
      modalType === "modify" ? (transaction?.toAccount?.id ?? "") : "",
    description: modalType === "modify" ? (transaction?.description ?? "") : "",
  };

  const [formValues, setFormValues] = useReducer(
    (currentValues, nextValues) => ({...currentValues, ...nextValues}), initialValues
  )

  // handle changes to useReducer
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value} = e.target;
    setFormValues({ [name]: value});
  }

  // submit
  const handleSubmit = async () => {
    setLoading(true);
    if (!transaction) return;

    const user = await getUser();
    if (!user) {
      setTransactionError("User not authenticated.");
      return;
    }

    //congregate all inputs
    try {
      const payload = {
        type: formValues.type,
        date_time: formValues.date_time,
        amount: formValues.amount,
        category_id: formValues.category_id,
        account_id: formValues.account_id,
        to_account_id: formValues.type === "transfer" ? formValues.to_account_id : null,
        description: formValues.description ?? null,
        user_id: user.id,
      };

      const { data, error } = 
        modalType === "modify"
        ? await UpdateTransaction(transaction.id, [payload])
        : await InsertTransaction([payload])

      if (!data || error ) {
        setTransactionError("Error: " + error);
        setLoading(false);
      }

      setLoading(false);
      fetch();
      onOpen();

    } catch (err) {
      setTransactionError("Fetching transaction failed")
      return;
    } finally {
      setLoading(false);
    }
  };

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
          loading={loading}
          onCancel={onCancel}
          onConfirm={handleSubmit}
          icon={<Coins size={20} />}
          header={
            modalType === "add" ? "Add a transaction" : "Modify the transaction"
          }
          noButtonText="Go back"
          yesButtonText="Add transaction"
        >
          <div className="flex w-full h-fit gap-5 mb-3" role="group">
            {transactionTypes.map((item, key) => (
              <div
                className={`flex ${formValues.type === item && "bg-(--color-brand-green) hover:bg-emerald-600"} flex-1 w-full h-fit border border-(--color-border-default) rounded-lg items-center justify-center py-1 hover:bg-(--color-border-subtle) cursor-pointer active:bg-(--color-brand-green-accent)`}
                key={key}
                onClick={(e) => setFormValues({ type: item})}
              >
                <p className="line-clamp-1 text-[0.9rem] font-mono">{item}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[1fr_1fr] w-full h-full gap-y-3 items-center py-1">
            <label htmlFor="date-time">Date and time</label>
            <input
              id="date-time"
              value={formValues.date_time}
              name="dateTime"
              type="datetime-local"
              className="border border-(--color-border-default) rounded-lg px-3 py-1"
              onChange={handleChange}
            />
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              name="amount"
              value={formValues.amount}
              type="text"
              onChange={handleChange}
              className="border border-(--color-border-default) rounded-lg px-3 py-1"
              placeholder="50.00"
            />
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formValues.category_id}
              onChange={handleChange}
              className="border border-(--color-border-default) rounded-lg px-3 py-1"
            >
              {categories?.map((c, id) => (
                <option
                  key={id}
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
              name="accountFrom"
              value={formValues.account_id ?? ""}
              onChange={handleChange}
              className="border border-(--color-border-default) rounded-lg px-3 py-1"
            >
              {accounts?.map((a, id) => (
                <option
                  key={id}
                  value={a.id}
                  className="bg-(--color-bg-secondary)"
                >
                  {a.name}
                </option>
              ))}
            </select>
            {formValues.type === "transfer" && (
              <>
                <label htmlFor="account-to">Destination account</label>
                <select
                  id="account-to"
                  name="accountTo"
                  value={formValues.to_account_id ?? ""}
                  onChange={handleChange}
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
              name="description"
              value={formValues.description}
              onChange={handleChange}
              className="border border-(--color-border-default) rounded-lg px-3 py-1 resize-none"
              placeholder="e.g Transferred 50.00..."
            />
          </div>
        </Modal>
      )}
    </>
  );
}
