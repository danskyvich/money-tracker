import AddAccountModal from "@/features/accounts/components/add-account-modal";
import {  
  ChevronLeft,
  ChevronRight,
  Loader,
  PiggyBank,
  Plus,
  RotateCw,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import AccountDetailsModal from "./accounts-details-modal";
import { FetchAccounts, SearchAccounts } from "@/lib/supabase/actions/database";
import { useDebouncedValue } from "@/hooks/useDebounceValue";
import Spinner from "@/components/layout/spinner";
import { AccountCategories, AccountsWithBalance } from "@/lib/types/derived";
import EditAccountModal from "./edit-account-modal";
import AccountListModalSkeleton from "./skeleton/account-list-modal-skeleton";
import ErrorModal from "@/components/layout/error-modal";

const numberOfItemsToBeDisplayed = 9;

export default function WholeAccountsList() {
  // general states
  const [loading, setLoading] = useState<boolean>(false)
  const [fetchAccountError, setFetchAccountError] = useState<string | null>(
    null,
  );
  const [accountCategories, setAccountCategories] = useState<Pick<AccountCategories, "id" | "name">[] | undefined>(undefined);
  const [totalNumberOfItems, setTotalNumberOfItems] = useState<number | null | undefined>(undefined,);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(searchTerm, 400);
  const isSearching = debouncedSearch.trim().length > 0;

  // for modals
  const [chosenAccount, setChosenAccount] =
    useState<AccountsWithBalance | null>(null);
  const [toggle, setToggle] = useState<string | null>(null);

  // for pagination only
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = totalNumberOfItems ? Math.ceil(totalNumberOfItems / numberOfItemsToBeDisplayed) : 0;
  const paginationArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  const [windowStart, setWindowStart] = useState(0);
  const visiblePages = paginationArray.slice(windowStart, windowStart + 5);

  //search
  const [unchangedAccounts, setUnchangedAccounts] = useState<AccountsWithBalance[] | null>(null);
  const [changedAccounts, setChangedAccounts] = useState<
    AccountsWithBalance[] | null
  >(null);

  // run fetch when this component mounts
  useEffect(() => {
    fetchAccounts();
  }, [currentPage, numberOfItemsToBeDisplayed]);

  useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch])

  // fetch accounts & account categories
  const fetchAccounts = async () => {
    setLoading(true);

    try {
      const result = await FetchAccounts(currentPage, numberOfItemsToBeDisplayed);
      if (!result.success) {
        setFetchAccountError(result.error);
        setLoading(false);
        return;
      }
      setUnchangedAccounts(result.accountsData ?? null);
      setChangedAccounts(result.accountsData ?? null);
      setAccountCategories(result.accountCategoriesData);
      setTotalNumberOfItems(result.totalItems);
    } catch (err) {
      setFetchAccountError("Something went wrong while fetching your accounts");
    } finally {
      setLoading(false);
    }
  }

  // handle accounts search
  const handleSearch = async (term: string) => {
    setLoading(true);
    if (!term.trim()) {
      setChangedAccounts(unchangedAccounts);
      setLoading(false);
      return;
    }

    const result = await SearchAccounts(term);

    if (!result.success) {
      setSearchError(result.error);
      setLoading(false)
      return;
    }

    setChangedAccounts(result.data);
    setLoading(false);
  }

  return (
    <div className="flex flex-1 relative w-full min-h-195 sm:min-h-180 md:min-h-145 md:h-full border border-(--color-border-default) rounded-lg">
      {toggle === "add-account" && (
        <AddAccountModal
          accountCategoriesData={accountCategories}
          open
          onOpen={() => setToggle(null)}
          refresh={fetchAccounts}
        />
      )}
      {toggle === "edit-accounts" && (
        <div className="fixed z-50 inset-0 flex w-full h-full items-center justify-center bg-black/50">
          <EditAccountModal
            onOpen={() => setToggle("account-details")}
            onCancel={() => setToggle("account-details")}
            icon={<PiggyBank size={20} className="min-w-3 h-auto" />}
            chosenAccount={chosenAccount}
          />
        </div>
      )}
      {toggle === "account-details" && (
        <AccountDetailsModal
          accountData={chosenAccount}
          open
          openInfo={() => setToggle("edit-accounts")}
          onOpen={() => setToggle(null)}
          refresh={fetchAccounts}
        />
      )}
      {searchError && <ErrorModal message={searchError} />}
      <div className="flex flex-col w-full items-center shadow-lg">
        <div className="flex flex-col flex-0 w-full h-fit">
          {/* Accounts header */}
          <div className="flex flex-0 w-full min-h-fit px-2 md:px-5 py-2 justify-between items-center">
            <div className="flex w-full gap-1 sm:gap-2 items-center">
              {/* Add account */}
              <div
                className="flex w-fit h-fit xl:h-fit gap-2 bg-(--color-brand-green) hover:bg-emerald-600 rounded-md px-3 md:px-5 py-1.5 text-white items-center hover:text-white cursor-pointer transition-all duration-200 active:bg-emerald-700"
                onClick={() => setToggle("add-account")}
              >
                <Plus size={15} />
                <p className="text-[0.8rem] hidden lg:block whitespace-nowrap">
                  Add an account
                </p>
              </div>

              {/* Search field */}
              <div className="flex h-full xl:h-fit w-full px-3 py-1 border border-(--color-border-default) rounded-md items-center gap-2">
                <Search size={15} className="flex" />
                <input
                  type="text"
                  value={searchTerm ?? ""}
                  placeholder="Search..."
                  className="flex flex-3 decorations-none placeholder:text-[0.8rem] focus:outline-none focus:ring-0 focus:border-transparent text-[0.8rem]"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
              </div>
            </div>
            {loading ? (
              <Spinner />
            ) : (
              <RotateCw
                size={18}
                className="min-w-4 h-auto cursor-pointer ml-2"
                onClick={() => fetchAccounts()}
              />
            )}
          </div>

          <div className="hidden md:grid grid-cols-[repeat(4,1fr)] w-full h-full px-5 py-1 text-[0.9rem] border-b border-(--color-border-default) items-end">
            <div>Account</div>
            <div>Category</div>
            <div>Description</div>
            <div>Balance</div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col w-full h-full">
          {loading ? (
            <AccountListModalSkeleton />
          ) : (
            <div className="flex flex-col relative w-full">
              {changedAccounts?.length === 0 && (
                <div className="flex w-full h-full items-center justify-center text-[0.9rem]">
                  <p className="self-center font-mono">You have no accounts.</p>
                </div>
              )}
              {unchangedAccounts ? (
                <div className="flex relative w-full">
                  <div className="flex flex-col w-full">
                    {changedAccounts?.map((account, id) => (
                      <div
                        className="flex flex-col gap-1 md:grid md:grid-cols-[repeat(4,1fr)] md:items-center w-full h-fit md:h-12 px-5 py-3 border-b border-(--color-border-subtle) text-[0.9rem] md:gap-x-2 hover:bg-(--color-bg-subtle) cursor-pointer"
                        onClick={() => {
                          setToggle("account-details");
                          setChosenAccount(account);
                        }}
                        key={id}
                      >
                        {/* Row 1 (mobile): name + balance */}
                        <div className="flex items-center justify-between md:contents">
                          <div className="line-clamp-1 font-medium md:font-normal">
                            {account.name}
                          </div>
                          <div className="line-clamp-1 font-mono md:order-last">
                            {account.balance}
                          </div>
                        </div>

                        {/* Row 2 (mobile): category · description */}
                        <div className="flex items-center gap-2 text-xs text-(--color-text-secondary) md:contents md:text-[0.9rem]">
                          <div className="line-clamp-1">
                            {
                              (
                                account.category_id as {
                                  id: string;
                                  name: string;
                                } | null
                              )?.name
                            }
                          </div>
                          <span className="md:hidden">·</span>
                          <div className="line-clamp-1 whitespace-nowrap">
                            {account.description === ""
                              ? "-"
                              : account.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex w-full h-full items-center justify-center">
                  <p className="text-[0.9rem]">{fetchAccountError}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-0 h-fit justify-between flex-col sm:flex-row w-full px-5 py-2 items-center gap-2 md:gap-0">
          <div
            className={`${unchangedAccounts?.length === 0 || (fetchAccountError && "hidden")} flex w-full text-[0.9rem] text-(--color-text-secondary) items-center gap-2`}
          >
            <div className="flex w-full sm:w-fit h-full items-center justify-center sm:justify-start">
              <p>{isSearching ? "Found" : "Show data"}</p>
              <div className="flex border border-(--color-border-default) text-(--color-text-secondary) px-3 py-2 mx-2 rounded-lg">
                <p>{changedAccounts?.length}</p>
              </div>
              <p>{!isSearching && `of ${totalNumberOfItems}`}</p>
            </div>
          </div>

          <div className="flex w-fit h-full gap-2 items-center">
            {windowStart > 0 && (
              <div
                className="flex border border-(--color-border-default) hover:bg-(--color-bg-subtle) cursor-pointer rounded-lg shadow-md"
                onClick={() => setWindowStart((prev) => Math.max(0, prev - 5))}
              >
                <ChevronLeft size={15} />
              </div>
            )}
            {visiblePages.map((item, index) => (
              <div
                className={`border border-(--color-border-default) rounded-lg px-3 py-1 md:py-2 hover:cursor-pointer ${currentPage === item ? "bg-(--color-brand-green) text-white hover:bg-(--color-brand-green)" : null}`}
                key={index}
                onClick={() => setCurrentPage(item)}
              >
                <p>{item}</p>
              </div>
            ))}
            {windowStart + 5 < paginationArray.length && (
              <div
                className="flex border border-(--color-border-default) hover:bg-(--color-bg-subtle) cursor-pointer rounded-lg shadow-md"
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
      </div>
    </div>
  );
}
