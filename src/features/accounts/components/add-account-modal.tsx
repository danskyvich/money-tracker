import { InsertAccount } from "@/lib/supabase/actions/database";
import { PiggyBank, X } from "lucide-react";
import React, { useReducer, useState } from "react";
import Spinner from "@/components/layout/spinner";
import ErrorModal from "@/components/layout/error-modal";
import { AccountCategories } from "@/lib/types/derived";

interface AddAccountProps {
  open: boolean;
  accountCategoriesData: Pick<AccountCategories, "id"|"name">[] | undefined;
  onOpen: () => void;
  refresh: () => void;
}

export default function AddAccountModal({
  open,
  onOpen,
  accountCategoriesData,
  refresh,
}: AddAccountProps) {

  const [loading, setLoading ] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initialValues = {
    accountName: '',
    accountType: accountCategoriesData?.[0]?.id,
    description: '',
  }

  const [formValues, setFormValues] = useReducer(
    (currentValues, newValues) => ({...currentValues, ...newValues}), initialValues
  )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ [name]: value});
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await InsertAccount(
      formValues.accountName,
      formValues.description,
      formValues.accountType
    )

    if (!data || error ) {
      setError(error);
      setLoading(false);
      return;
    }

    refresh();
    setLoading(false);
    onOpen();
  }
  
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center shadow-md bg-black/50">
      {error !== null && <ErrorModal message={error} />}
      <form
        className="p-5 w-50 transform:translate(-50, -50%) bg-(--color-bg-secondary) md:w-100 border border-(--color-border-default) rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        {/* Header */}
        <div className="flex w-full justify-between items-center">
          <PiggyBank size={20} />
          <p className="font-semibold text-xl whitespace-nowrap">
            Add an account
          </p>
          <X size={20} onClick={() => onOpen()} className="cursor-pointer" />
        </div>

        {/* Content */}
        <div className="flex-col relative flex w-full h-full my-5">
          <div className="grid grid-cols-[1fr_2fr] w-full h-full text-[0.9rem] gap-y-3 gap-2 items-center">
            <label htmlFor="nameInput">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              id="nameInput"
              name="accountName"
              value={formValues.accountName}
              onChange={handleChange}
              className="focus:outline-(--color-brand-green) focus:outline-1 border border-(--color-border-default) rounded-lg px-3 py-1"
              placeholder="Enter acccount name..."
              aria-placeholder="Enter account name..."
            />

            <label htmlFor="accountType">
              Type<span className="text-red-500">*</span>
            </label>
            <select
              id="accountType"
              name="accountType"
              value={formValues.accountType}
              onChange={handleChange}
              className="flex focus:outline-(--color-brand-green) focus:outline-1 w-full border border-(--color-border-default) rounded-lg px-3 py-1"
            >
              {accountCategoriesData?.map((item, id) => (
                <option
                  className="bg-(--color-bg-secondary)"
                  value={item?.id}
                  key={id}
                >
                  {item.name}
                </option>
              ))}
            </select>

            <p>Description</p>
            <textarea
              rows={4}
              name="description"
              value={formValues.description}
              onChange={handleChange}
              placeholder="Write something about your account."
              aria-placeholder="Write something about your account."
              className="flex w-full h-24 focus:outline-(--color-brand-green) focus:outline-1 border border-(--color-border-default) rounded-lg px-3 py-2 resize-none"
            />
          </div>
        </div>

        {/* Footer - button */}
        <div className="flex w-full pt-7">
          <button
            className="flex bg-(--color-brand-green) focus:outline-1 focus:outline-(--color-brand-green) rounded-lg shadow-md hover:bg-(--color-brand-green-accent) text-[0.9rem] active:bg-emerald-700 items-center justify-center px-5 py-1 w-full cursor-pointer"
            type="submit"
          >
            {loading ? <Spinner /> : "Add account"}
          </button>
        </div>
      </form>
    </div>
  );
}
