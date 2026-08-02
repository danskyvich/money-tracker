import { Transaction } from "@/lib/types/database";
import { DeleteTransaction, InsertTransaction, UpdateTransaction } from "@/services/supabase/actions/databaseActions";
import { TransactionSchema } from "@/utils/schemas/TransactionSchema";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function TransactionContent({
  currentPage,
  selectedTransaction,
  categoriesData,
  accountiesData,
  onSaved,
}: {
  currentPage: number;
  selectedTransaction?: Transaction | null;
  categoriesData?: any[] | null;
  accountiesData?: any[] | null;
  onSaved: () => void,
}) {

  const [insertTransactionError, setInsertTransactionError] = useState<
    string | null
  >("");
  const [deleteTransactionError, setDeleteTransactionError] = useState<string | null>(null);
  const [chosenDateTime, setChosenDateTime] = useState<
    string | number | readonly string[] | undefined
  >(undefined);
  const [chosenType, setChosenType] = useState<string | null>(null);
  const [chosenCategory, setChosenCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [chosenAccount, setChosenAccount] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [chosenAccountTo, setChosenAccountTo] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [chosenDescription, setChosenDescription] = useState<
    string | number | readonly string[] | undefined
  >(undefined);
  const [chosenAmount, setChosenAmount] = useState<
    string | number | readonly string[] | undefined
  >(undefined);
  const [loadingDeletion, setLoadingDeletion] = useState<boolean>(false)
  const [loadingTransaction, setLoadingTransaction] = useState<boolean>(false)

  // rename page and initialize values to modal inputs/dropdowns
  // you can set default values here
  useEffect(() => {
    setChosenDateTime(selectedTransaction?.date_time ?? new Date().toISOString().slice(0,16));
    setChosenType(selectedTransaction?.type ?? "income");
    setChosenCategory(selectedTransaction?.categories ?? categoriesData?.[0] ?? null);
    setChosenAccount(selectedTransaction?.fromAccount ?? accountiesData?.[0] ?? null);
    setChosenAccountTo(
      selectedTransaction?.toAccount ?? null,
    );
    setChosenAmount(selectedTransaction?.amount.toString() ?? "");
    setChosenDescription(selectedTransaction?.description ?? "");
  }, [selectedTransaction, categoriesData, accountiesData]);

  // handle insert and update
  const handleInsertUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoadingTransaction(true);

    const formData = new FormData(e.currentTarget);

    // integrate TransactionSchema (zod) for form validation
    const parsed = TransactionSchema.safeParse({
      category_id: chosenCategory?.id ?? "", // if non-native UI is used, use state variables instead
      account_id: chosenAccount?.id ?? "",
      to_account_id: chosenAccountTo?.id ?? "",
      amount: formData.get("amountInput"), // check this
      description: formData.get("descriptionInput"),
      dateTime: formData.get("dateTimeInput"),
      type: chosenType,
    });

    if (!parsed.success) return setInsertTransactionError(parsed?.error.issues[0].message), setLoadingTransaction(false);

    // extract variables from above
    const {
      category_id,
      account_id,
      to_account_id,
      amount,
      description,
      dateTime,
      type,
    } = parsed.data;

    const payload = {
      dateTime,
      type,
      category_id,
      account_id,
      to_account_id: type === "transfer" ? to_account_id : null,
      amount: +amount,
      description,
    };

   const result = selectedTransaction ? await UpdateTransaction(selectedTransaction.id, payload) : await InsertTransaction(payload);
   if (result.error) return setInsertTransactionError(result.error.toString()), setLoadingTransaction(false);

   setLoadingTransaction(false);
   onSaved(); // refresh table + close modal
  };

  type DropdownName = "type" | "category" | "account" | "accountTo" | null;
  const types = ["income", "expense", "transfer"];
  const [openDropdown, setOpenDropdown] = useState<DropdownName>(null);

  // other functions
  const handleTypeChange = (newType: string) => {
    setChosenType(newType);
    if (newType !== "transfer") {
      setChosenAccountTo(null);
    }
  };

  // delete transaction
  const handleDeleteTransaction = async (id: string) => {
    setLoadingDeletion(true);

    const result = await DeleteTransaction(id);
    if (!result.data) return setDeleteTransactionError(result.error.toString())
    setLoadingDeletion(false);
    onSaved();
  }

  return (
    <form
      className="flex w-full h-full flex-col gap-2 px-5 py-3 text-[0.9rem]"
      onSubmit={handleInsertUpdate}
    >
      {/* Date & time */}
      <div className="grid grid-cols-[30%_70%] gap-4 items-center w-full">
        <p>Date and time</p>
        <input
          type="datetime-local"
          className="border border-(--color-border-default) px-5 py-1 rounded-lg"
          name="dateTimeInput"
          onChange={(e) => setChosenDateTime(e.target.value)}
          value={chosenDateTime}
        />
      </div>

      {/* Type */}
      <div className="relative grid grid-cols-[30%_70%] gap-4 items-center w-full">
        <p>Type</p>
        <div
          className="flex relative justify-between items-center h-fit border border-(--color-border-default) px-5 py-1 rounded-lg cursor-pointer hover:bg-(--color-bg-subtle)"
          onClick={() =>
            setOpenDropdown((prev) => (prev === "type" ? null : "type"))
          }
        >
          <p>{!chosenType ? types[0] : chosenType}</p>
          {openDropdown === "type" ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}

          {openDropdown === "type" && (
            <div className="flex flex-col top-10 -left-1 z-50 absolute w-fit min-h-fit max-h-50 overflow-y-auto border border-(--color-border-subtle) bg-(--color-bg-base) rounded-lg shadow-md">
              {types?.map((item, key) => (
                <div
                  className="flex w-full px-5 py-1 h-fit text-[0.9rem] text-(--color-text-primary) font-display hover:bg-(--color-bg-subtle)"
                  key={key}
                  onClick={() => {
                    (setOpenDropdown("type"), handleTypeChange(item));
                  }}
                >
                  <p>{item}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="grid grid-cols-[30%_70%] gap-4 items-center w-full">
        <p>Category</p>
        <div
          className="flex relative justify-between items-center h-fit border border-(--color-border-default) px-5 py-1 rounded-lg cursor-pointer hover:bg-(--color-bg-subtle)"
          onClick={() =>
            setOpenDropdown((prev) => (prev === "category" ? null : "category"))
          }
        >
          <p>{chosenCategory?.name || categoriesData?.[0]?.name}</p>
          {openDropdown === "category" ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}

          {openDropdown === "category" && (
            <div className="flex flex-col top-10 -left-1 z-50 absolute w-fit min-h-fit max-h-45 overflow-y-auto border border-(--color-border-subtle) bg-(--color-bg-base) rounded-lg shadow-md">
              {categoriesData?.map((item, key) => (
                <div
                  className="flex w-full px-5 py-1 h-fit text-[0.9rem] text-(--color-text-primary) font-display hover:bg-(--color-bg-subtle)"
                  key={key}
                  onClick={() => {
                    (setOpenDropdown("category"), setChosenCategory(item));
                  }}
                >
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {chosenType !== "transfer" ? (
        <div className="grid grid-cols-[30%_70%] gap-4 items-center w-full">
          <p>Account</p>
          <div
            className="flex relative justify-between items-center h-fit border border-(--color-border-default) px-5 py-1 rounded-lg cursor-pointer hover:bg-(--color-bg-subtle)"
            onClick={() =>
              setOpenDropdown((prev) => (prev === "account" ? null : "account"))
            }
          >
            <p>{chosenAccount?.name || accountiesData?.[0]?.name}</p>
            {openDropdown === "account" ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}

            {openDropdown === "account" && (
              <div className="flex flex-col top-10 -left-1 z-50 absolute w-fit min-h-fit max-h-45 overflow-y-auto border border-(--color-border-subtle) bg-(--color-bg-base) rounded-lg shadow-md">
                {accountiesData?.map((item, key) => (
                  <div
                    className="flex w-full px-5 py-1 h-fit text-[0.9rem] text-(--color-text-primary) font-display hover:bg-(--color-bg-subtle)"
                    key={key}
                    onClick={() => {
                      (setOpenDropdown("account"), setChosenAccount(item));
                    }}
                  >
                    <p>{item.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[30%_70%] gap-4 items-center w-full">
            <p>Account from</p>
            <div
              className="flex relative justify-between items-center h-fit border border-(--color-border-default) px-5 py-1 rounded-lg cursor-pointer hover:bg-(--color-bg-subtle)"
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "account" ? null : "account",
                )
              }
            >
              <p>{chosenAccount?.name}</p>
              {openDropdown === "account" ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}

              {openDropdown === "account" && (
                <div className="flex flex-col top-10 -left-1 z-50 absolute w-fit min-h-fit max-h-45 overflow-y-auto border border-(--color-border-subtle) bg-(--color-bg-base) rounded-lg shadow-md">
                  {accountiesData?.map((item, key) => (
                    <div
                      className="flex w-full px-5 py-1 h-fit text-[0.9rem] text-(--color-text-primary) font-display hover:bg-(--color-bg-subtle)"
                      key={key}
                      onClick={() => {
                        (setOpenDropdown("account"), setChosenAccount(item));
                      }}
                    >
                      <p>{item.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[30%_70%] gap-4 items-center w-full">
            <p>Account to</p>
            <div
              className="flex relative justify-between items-center h-fit border border-(--color-border-default) px-5 py-1 rounded-lg cursor-pointer hover:bg-(--color-bg-subtle)"
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "accountTo" ? null : "accountTo",
                )
              }
            >
              <p>{chosenAccountTo?.name}</p>
              {openDropdown === "accountTo" ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}

              {openDropdown === "accountTo" && (
                <div className="flex flex-col top-10 -left-1 z-50 absolute w-fit min-h-fit max-h-60 overflow-y-auto border border-(--color-border-subtle) bg-(--color-bg-base) rounded-lg shadow-md">
                  {accountiesData?.map((item, key) => (
                    <div
                      className="flex w-full px-5 py-1 h-fit text-[0.9rem] text-(--color-text-primary) font-display hover:bg-(--color-bg-subtle)"
                      key={key}
                      onClick={() => {
                        (setOpenDropdown("accountTo"),
                          setChosenAccountTo(item));
                      }}
                    >
                      <p>{item.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-[30%_70%] gap-4 items-center w-full">
        <p>Amount</p>
        <input
          className="w-full border border-(--color-border-default) rounded-lg focus:outline-none resize-none py-2 px-5 line-clamp-4"
          name="amountInput"
          value={chosenAmount}
          onChange={(e) => setChosenAmount(e.target.value)}
          placeholder="0.00"
        />
      </div>

      <div className="grid grid-cols-[30%_70%] gap-4 items-center w-full">
        <p>Description</p>
        <textarea
          rows={4}
          id="note"
          className="w-full border border-(--color-border-default) rounded-lg focus:outline-none resize-none py-2 px-5 line-clamp-4"
          name="descriptionInput"
          value={chosenDescription}
          onChange={(e) => setChosenDescription(e.target.value)}
          aria-placeholder="Note (optional)"
          placeholder="Note (optional)"
        />
      </div>

      <div className="flex flex-col w-full mt-5">
        <p className="text-[0.9rem] text-red-500 font-display">
          {insertTransactionError}
        </p>
        <p className="text-[0.9rem] text-red-500 font-display">
          {deleteTransactionError}
        </p>
        <button
          type="submit"
          className="flex w-full h-full py-1 text-[0.9rem] items-center justify-center border border-(--color-brand-green) hover:bg-(--color-brand-green) active:bg-emerald-700 rounded-lg cursor-pointer mt-2 duration-100 transition-all"
        >
          <p>{selectedTransaction ? "Save changes" : "Add"}</p>
        </button>

        {selectedTransaction ? (
          <button
            type="button"
            onClick={() => handleDeleteTransaction(selectedTransaction?.id)}
            className="flex w-full rounded-lg bg-transparent border border-(--color-brand-red) text-[0.9rem] hover:bg-(--color-brand-red) hover:text-white items-center justify-center py-1 mt-3 cursor-pointer transition-all duration-100 active:bg-red-600"
          >
            <p>{loadingDeletion ? "Deleting..." : "Delete transaction"}</p>
          </button>
        ) : null}
      </div>
    </form>
  );
}
