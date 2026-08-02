import AccountListSkeleton from "@/feature/accounts/components/account-list-modal";
import { Transaction } from "@/lib/types/database";
import {
  DeleteAccount,
  SelectAccountTransactions,
} from "@/supabase/dbActions";
import { createClient } from "@/supabase/client";
import ConvertTimestampToDateTime from "@/utils/convertToDateTime";
import { ChevronLeft, ChevronRight, Filter, PiggyBank, X } from "lucide-react";
import { useEffect, useState } from "react";

interface AccountDetailsModalProps {
  toggle: boolean;
  accountData: any | null;
  onClose: () => void;
  refresh: () => void;
}

export default function AccountDetailsModal({
  toggle,
  accountData,
  onClose,
  refresh,
}: AccountDetailsModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(
    "",
  );
  const [accountTransactions, setAccountTransactions] = useState<
    Transaction[] | null
  >(null);
  const [accountTransactionsError, setAccountTransactionsError] = useState<
    string | null
  >(null);
  const [openFilter, setOpenFilter] = useState<boolean>(false);

  //pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [windowStart, setWindowStart] = useState(0);
  const [totalNumberOfItems, setTotalNumberOfItems] = useState<number>(0);
  const totalPages = totalNumberOfItems ? Math.ceil(totalNumberOfItems / 9) : 0;
  const paginationArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = paginationArray.slice(windowStart, windowStart + 5);

  const handleAccountDeletion = async (id: string) => {
    setLoading(true);
    const { error } = await DeleteAccount(id);

    setDeleteAccountError(error);
    setLoading(false);
    onClose();
    refresh();
  };

  const fetchTransactionsOfAccount = async (id: string) => {
    setListLoading(true);
    const { data, error, count } = await SelectAccountTransactions(
      id,
      currentPage,
      10,
    );

    if (!data) setAccountTransactionsError(error);
    setAccountTransactions(data);
    setTotalNumberOfItems(count ?? 0);
    setListLoading(false);
  };

  useEffect(() => {
    if (!accountData?.id) return;
    fetchTransactionsOfAccount(accountData?.id);
    setLoading(false);
  }, [accountData?.id, currentPage]);

  return (
    <>
      {toggle && (
        <div className="fixed flex inset-0 z-50 bg-black/50 w-full h-full items-center justify-center">
          {listLoading ? (
            <div className="flex xl:w-275 md:w-250 w-150 h-165">
              <AccountListSkeleton/>
            </div>
          ) : (
            <div className="flex flex-col xl:w-275 md:w-250 w-150 h-165 bg-(--color-bg-secondary) border border-(--color-border-default) rounded-lg shadow-md justify-between">
              {/* Header */}
              <div className="flex w-full h-fit items-center justify-between px-5 py-2">
                <PiggyBank size={20} />
                <p className="text-2xl font-semibold">{accountData?.name}</p>
                <X onClick={onClose} size={20} className="cursor-pointer" />
              </div>

              {/* Filter bar */}
              <div className="flex w-full h-fit px-5 pt-3 pb-1">
                <div className="flex w-full h-fit mt-2 gap-3">
                  <input
                    type="datetime-local"
                    name="accountTransactionDateTimeLocalInput"
                    className="px-3 py-1 flex border border-(--color-border-default) rounded-lg text-[0.9rem]"
                  />
                  <div className="flex w-fit h-fit border border-(--color-border-default) rounded-lg px-3 py-1 gap-2 text-[0.9rem] items-center">
                    <Filter size={15} />
                    <p>Filter</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-col w-full h-full">
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] h-fit text-[0.9rem] px-5 pb-1 pt-4 border-b border-(--color-border-subtle)">
                  <p className="linear-clamp-1">Date & time</p>
                  <p className="linear-clamp-1">Type</p>
                  <p className="linear-clamp-1">Description</p>
                  <p className="linear-clamp-1">Category</p>
                  <p className="linear-clamp-1">Account</p>
                  <p className="linear-clamp-1">Amount</p>
                </div>

                <div className="flex flex-col w-full h-full">
                  {accountTransactions?.map((item, key) => (
                    <div
                      className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] border-b border-(--color-border-subtle) text-[0.9rem] px-5 py-2"
                      key={key}
                    >
                      <div className="line-clamp-1">
                        {ConvertTimestampToDateTime(item?.date_time)}
                      </div>
                      <div className="line-clamp-1 capitalize text-(--color-text-secondary)">
                        {item?.type}
                      </div>
                      <div className="line-clamp-1">{item.description}</div>
                      <div className="line-clamp-1">
                        {item.categories?.name}
                      </div>
                      <div className="line-clamp-1">
                        {item.toAccount?.name ? (
                          <p className="line-clamp-1">
                            {item.fromAccount?.name} to {item.toAccount?.name}
                          </p>
                        ) : (
                          <p>{item.fromAccount?.name}</p>
                        )}
                      </div>
                      <div className="line-clamp-1 font-mono">
                        {item?.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              <div className="flex w-full h-fit justify-between px-5 py-1 text-[0.9rem]">
                <div className="flex w-full h-fit">
                  <p>
                    Show{" "}
                    <span className="border border-(--color-border-subtle) px-3 py-2 rounded-lg">
                      {accountTransactions?.length}
                    </span>{" "}
                    of <span>{totalNumberOfItems}</span>
                  </p>
                </div>

                <div className="flex w-full h-fit justify-end">
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
                      className={`px-3 py-2 border border-(--color-border-default) rounded-lg shadow-md hover:bg-(--color-bg-subtle) cursor-pointer ${currentPage === item ? "bg-(--color-brand-green) text-black hover:bg-(--color-brand-green)" : null}`}
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
                <p className="text-red-500 text-[0.9rem]">
                  {deleteAccountError} {accountTransactionsError}
                </p>
                <button
                  type="button"
                  className="flex cursor-pointer border border-(--color-border-default) rounded-lg bg-transparent hover:bg-(--color-brand-green) active:bg-emerald-600 w-full items-center justify-center py-1 duration-100 transition-all"
                  onClick={() => handleAccountDeletion(accountData?.id)}
                >
                  <p className="text-[0.9rem]">
                    {loading ? "Deleting account..." : "Delete account"}
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
