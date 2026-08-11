import { AccountCategories } from "@/lib/types/database";
import { InsertAccount } from "@/lib/supabase/actions/database";
import { ChevronDown, ChevronUp, PiggyBank, X } from "lucide-react";
import { useEffect, useState } from "react";
import Spinner from "@/components/layout/spinner";

interface AddAccountProps {
  open: boolean;
  accountCategoriesData: AccountCategories[] | undefined;
  onOpen: () => void;
  onConfirm: (name: string, description: string, categoryId: string | undefined) => void;
  loading: React.ReactNode;
}

export default function AddAccountModal({
  open,
  onOpen,
  accountCategoriesData,
  onConfirm,
  loading,
}: AddAccountProps) {
  if (!open) return null;

  // states
  const [accountDropdownClicked, setAccountDropdownClicked] = useState(false);
  const [newAccountType, setNewAccountType] = useState<AccountCategories | null>(
    null,
  );
  const [newAccountName, setNewAccountName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // close dropdown and set values to states
  const handleCloseDropdown = (account: AccountCategories) => {
    setAccountDropdownClicked(false);
    setNewAccountType(account);
  };

  // populate account category dropdown
  useEffect(() => {
    if (!newAccountType && accountCategoriesData?.length) setNewAccountType(accountCategoriesData[0])
  }, [newAccountType, accountCategoriesData])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center shadow-md bg-black/50">
      <form className="p-5 w-50 transform:translate(-50, -50%) bg-(--color-bg-secondary) md:w-100 border border-(--color-border-default) rounded-lg shadow-md">
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
            <label htmlFor="nameInput">Name<span className="text-red-500">*</span></label>
            <input
              id="nameInput"
              className="focus:outline-none border border-(--color-border-default) rounded-lg px-3 py-1"
              placeholder="Enter acccount name..."
              aria-placeholder="Enter account name..."
              onChange={(e) => setNewAccountName(e.target.value)}
            />

            <p>Type<span className="text-red-500">*</span></p>
            <div
              className="relative flex w-full justify-between border border-(--color-border-default) items-center px-3 py-1 rounded-lg hover:bg-(--color-bg-subtle) cursor-pointer"
              onClick={() => setAccountDropdownClicked((prev) => !prev)}
            >
              <p>{newAccountType?.name}</p>
              {accountDropdownClicked ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>

            {accountDropdownClicked && (
              <div className="flex flex-col h-fit absolute top-21 z-50 left-32 w-40 border border-(--color-border-default) rounded-lg bg-(--color-bg-secondary)">
                {accountCategoriesData?.map((item) => (
                  <div
                    className="flex w-full text-[0.9rem] h-fit px-5 py-1 cursor-pointer border-b border-(--color-border-subtle) hover:bg-(--color-bg-subtle)"
                    key={item.id}
                    onClick={() => handleCloseDropdown(item)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}

            <p>Description</p>
            <textarea
              rows={4}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write something about your account."
              aria-placeholder="Write something about your account."
              className="flex w-full h-24 border border-(--color-border-default) rounded-lg px-3 py-2 resize-none"
            />
          </div>
        </div>

        {/* Footer - button */}
        <div className="flex w-full pt-7">
          <button
            className="flex bg-(--color-brand-green) rounded-lg shadow-md hover:bg-(--color-brand-green-accent) active:bg-emerald-700 items-center justify-center px-5 py-1 w-full cursor-pointer"
            onClick={() => onConfirm(newAccountName, description, newAccountType?.id)}
            type="submit"
          >
            <p className="text-[0.9rem]">
              {loading ? <Spinner/> : "Add account"}
            </p>
          </button>
        </div>
      </form>
    </div>
  );
}
