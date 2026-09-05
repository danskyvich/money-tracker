import AccountListSkeleton from "@/features/accounts/components/skeleton/account-list-modal-skeleton";
import {
  DeleteAccount,
  SelectTransactionsFromChosenAccount,
} from "@/lib/supabase/actions/database";
import ConvertTimestampToDateTime from "@/utils/convertToDateTime";
import { ChevronLeft, ChevronRight, Filter, Luggage, Pencil, PiggyBank, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import ErrorModal from "@/components/layout/error-modal";
import Spinner from "@/components/layout/spinner";
import { Transactions } from "@/lib/types/derived";

interface AccountDetailsModalProps {
  open: boolean;
  onOpen: () => void;
  accountData: any | null;
  refresh: () => void;
  openInfo: () => void;
}

export default function AccountDetailsModal({
  open,
  onOpen,
  openInfo,
  accountData,
  refresh,
}: AccountDetailsModalProps) {

  // modals
  const [loading, setLoading] = useState<boolean>(false);

  // fetch data and errors
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>("");
  const [accountTransactions, setAccountTransactions] = useState<Transactions[] | null>(null);
  const [accountTransactionsError, setAccountTransactionsError] = useState<string | null>(null);
  
  //pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [windowStart, setWindowStart] = useState(0);
  const [totalNumberOfItems, setTotalNumberOfItems] = useState<number>(0);
  const totalPages = totalNumberOfItems ? Math.ceil(totalNumberOfItems / 9) : 0;
  const paginationArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = paginationArray.slice(windowStart, windowStart + 5);

  // fetch transactions of the account
  const fetchTransactionsOfAccount = async (id: string) => {
    setLoading(true);
    const { data, error, count } = await SelectTransactionsFromChosenAccount(
      id,
      currentPage,
      10,
    );

    if (!data) {
      setAccountTransactionsError(error);
      setLoading(false);
      return;
    };

    setAccountTransactions(data);
    setTotalNumberOfItems(count ?? 0);
    setLoading(false);
  };

  useEffect(() => {
    if (!accountData?.id) return;
    fetchTransactionsOfAccount(accountData?.id);
  }, [accountData?.id, currentPage]);

  // handle account deletion
  const handleAccountDeletion = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await DeleteAccount(id);
      if (!data || error ) {
        setDeleteAccountError(error);
        return;
      }
    } catch (err) {
      setDeleteAccountError("Account deletion failed.");
    } finally {
      setLoading(false);
      refresh();
      onOpen();
    }
  }

  if (!open) return null;

  return (
    <>
      {(accountTransactionsError || deleteAccountError) && (
        <ErrorModal message={accountTransactionsError || deleteAccountError} />
      )}
      {open && (
        <div className="fixed flex inset-0 z-50 bg-black/50 w-full h-full items-center justify-center">
          <div className="flex flex-col w-75 sm:w-140 md:w-185 lg:w-200 xl:w-225 md:mx-0 h-165 bg-(--color-bg-secondary) border border-(--color-border-default) rounded-lg shadow-md justify-between">
            {/* Header */}
            <div className="flex w-full h-fit items-center justify-between px-5 py-2">
              <PiggyBank size={20} />
              <p className="text-2xl font-semibold">{accountData?.name}</p>
              <X
                onClick={() => onOpen()}
                size={20}
                className="cursor-pointer"
              />
            </div>

            {/* Filter bar */}
            <div className="flex w-full h-fit px-5 pt-3 pb-1">
              <div
                className="flex border border-(--color-border-default) hover:text-white active:text-white rounded-lg px-3 py-2 gap-2 w-fit h-full cursor-pointer hover:bg-(--color-brand-green) duration-100 transition-all active:bg-emerald-700"
                onClick={(e) => {
                  e.stopPropagation();
                  openInfo();
                }}
              >
                <Pencil size={15} className="min-w-3 h-auto" />
                <p className="hidden xl:block text-[0.9rem]">
                  Edit account details
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col w-full h-full min-h-0">
              <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] gap-x-3 md:gap-x-5 h-fit text-[0.9rem] px-5 pb-1 pt-4 border-b border-(--color-border-subtle)">
                <p className="linear-clamp-1">Date & time</p>
                <p className="linear-clamp-1">Type</p>
                <p className="linear-clamp-1">Description</p>
                <p className="linear-clamp-1">Category</p>
                <p className="linear-clamp-1">Account</p>
                <p className="linear-clamp-1">Amount</p>
              </div>

              {loading ? (
                <div className="flex w-full h-full">
                  <AccountListSkeleton />
                </div>
              ) : (
                <div className="felx w-full h-full overflow-x-scroll">
                  {accountTransactions?.length === 0 ? (
                    <div className="flex w-full h-full items-center justify-center">
                      <p className="text-[0.8rem] md:text-[0.9rem]">
                        No transactions found
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col w-full h-full overflow-y-auto">
                      {accountTransactions?.map((item, key) => (
                        <div
                          className="flex flex-col gap-1 md:grid md:grid-cols-[repeat(6,1fr)] md:gap-x-3 md:gap-x-5 md:items-center border-b border-(--color-border-subtle) text-[0.9rem] px-5 py-3 md:py-2"
                          key={key}
                        >
                          <div className="flex items-center justify-between md:contents">
                            <p className="line-clamp-1 text-(--color-text-secondary) text-xs md:text-[0.9rem] md:text-(--color-text-primary)">
                              {ConvertTimestampToDateTime(item?.date_time)}
                            </p>
                            <p className="hidden md:block line-clamp-1 capitalize text-(--color-text-secondary)">
                              {item?.type}
                            </p>
                          </div>

                          <p className="line-clamp-1 md:contents">
                            {item.description}
                          </p>

                          <p className="hidden md:block line-clamp-1">
                            {item?.category_name}
                          </p>

                          <p className="hidden md:block line-clamp-1">
                            {item?.account_to_name
                              ? `${item?.account_from_name} to ${item?.account_to_name}`
                              : item.account_from_name}
                          </p>

                          <div className="flex items-center justify-between md:contents">
                            <div className="flex items-center gap-2 text-xs text-(--color-text-secondary) md:hidden">
                              <span className="capitalize">{item?.type}</span>
                              <span>·</span>
                              <span>{item?.category_name}</span>
                              <span>·</span>
                              <span className="line-clamp-1">
                                {item?.account_to_name
                                  ? `${item?.account_from_name} to ${item?.account_to_name}`
                                  : item.account_from_name}
                              </span>
                            </div>
                            <p className={`line-clamp-1 font-mono ${item.type === "income" ? "text-emerald-400" : item.type === "expense" ? "text-red-500" : "text-white"}`}>
                              {item?.amount}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex flex-0 w-full h-full justify-between px-5 py-1 text-[0.9rem] gap-3 items-center">
              <div className="flex w-full h-fit">
                <p>
                  Show{" "}
                  <span className="border border-(--color-border-subtle) px-3 py-2 rounded-lg">
                    {accountTransactions?.length}
                  </span>{" "}
                  of <span>{totalNumberOfItems}</span>
                </p>
              </div>

              <div className="flex w-full h-fit justify-end gap-3 ">
                {windowStart > 0 && (
                  <div
                    className="px-3 py-2 border border-(--color-border-default) rounded-lg shadow-md cursor-pointer hover:bg-(--color-bg-subtle)"
                    onClick={() =>
                      setWindowStart((prev) => Math.max(0, prev - 5))
                    }
                  >
                    <ChevronLeft size={15} />
                  </div>
                )}

                {/* window slice (-5, windowStart, +5) */}
                {visiblePages.map((item, key) => (
                  <div
                    className={`px-3 py-2 border border-(--color-border-default) rounded-lg shadow-md hover:bg-(--color-bg-subtle) cursor-pointer ${currentPage === item ? "bg-(--color-brand-green) text-white hover:bg-(--color-brand-green)" : null}`}
                    key={key}
                    onClick={() => setCurrentPage(item)}
                  >
                    <p>{item}</p>
                  </div>
                ))}

                {/* Right */}
                {windowStart + 5 < paginationArray.length && (
                  <div
                    className="px-3 py-2 border border-(--color-border-default) rounded-lg shadow-md"
                    onClick={() =>
                      setWindowStart((prev) =>
                        Math.min(paginationArray.length - 5, prev + 5),
                      )
                    }
                  >
                    <ChevronRight size={15} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col w-full h-fit px-5 pb-5 pt-2">
              <button
                type="button"
                className="flex cursor-pointer border border-(--color-border-default) rounded-lg bg-transparent text-[0.9rem] hover:bg-(--color-brand-green) active:bg-emerald-600 w-full items-center justify-center py-1 duration-100 transition-all"
                onClick={() => handleAccountDeletion(accountData?.id)}
              >
                {loading ? <Spinner /> : "Delete account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
