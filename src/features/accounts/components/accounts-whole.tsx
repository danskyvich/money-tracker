import AddAccountModal from "@/features/accounts/components/add-account-modal";
import {  
  ChevronLeft,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import AccountDetailsModal from "./accounts-details-modal";
import { FetchAccounts, SearchAccounts } from "@/lib/supabase/actions/database";
import { useDebouncedValue } from "@/hooks/useDebounceValue";
import Spinner from "@/components/layout/spinner";
import { AccountCategories, AccountsWithBalance } from "@/lib/types/derived";

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
      const { accountsData, accountCategoriesData, totalItems, error } = await FetchAccounts(currentPage, numberOfItemsToBeDisplayed);
      if (error) {
        setFetchAccountError(error)
        return;
      }
      setUnchangedAccounts(accountsData ?? null);
      setChangedAccounts(accountsData ?? null);
      setAccountCategories(accountCategoriesData);
      setTotalNumberOfItems(totalItems);
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
    <div className="flex flex-1 relative w-full h-full border border-(--color-border-default) rounded-lg">
      {toggle === "add-account" && (
        <AddAccountModal
          accountCategoriesData={accountCategories}
          open
          onOpen={() => setToggle(null)}
          refresh={fetchAccounts}
        />
      )}
      {toggle === "account-details" && (
        <AccountDetailsModal
          accountData={chosenAccount}
          open
          onOpen={() => setToggle(null)}
          refresh={fetchAccounts}
        />
      )}
      <div className="flex flex-col min-h-[50dvh] w-full h-full items-center">
        <div className="flex flex-col flex-0 w-full h-fit">
          {/* Accounts header */}
          <div className="flex flex-0 w-full min-h-fit py-2 px-2 gap-3">

            {/* Add account */}
            <div
              className="flex w-fit h-fit xl:h-fit gap-2 border border-(--color-brand-green) rounded-md px-5 py-1.5 items-center bg-transparent text-(--color-text-primary) hover:text-white hover:bg-emerald-600 cursor-pointer transition-all duration-200 active:bg-emerald-700"
              onClick={() => setToggle("add-account")}
            >
              <Plus size={15} />
              <p className="text-[0.8rem] hidden lg:block whitespace-nowrap">
                Add an account
              </p>
            </div>

            {/* Search field */}
            <div className="flex h-full xl:h-fit px-5 py-1 w-75 border border-(--color-border-default) rounded-md items-center gap-2">
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

          <div className="grid grid-cols-[repeat(4,1fr)] w-full h-full px-5 py-1 text-[0.9rem] border-b border-(--color-border-default) items-end">
            <div>Account</div>
            <div>Category</div>
            <div>Description</div>
            <div>Balance</div>
          </div>
        </div>

        {/* Accounts table */}
        <div className="flex flex-col w-full h-full overflow-hidden">

          {/* Content */}
          <div className="flex flex-1 flex-col w-full h-full">
            {loading ? (
              <div className="flex w-full h-full items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="flex flex-col relative w-full h-[85%] overflow-hidden">
                {changedAccounts?.length === 0 && (
                  <div className="flex w-full h-full items-center justify-center text-[0.9rem]">
                    <p className="self-center font-mono">
                      No accounts found for <br />"{searchTerm}"
                    </p>
                  </div>
                )}
                {unchangedAccounts ? (
                  <div className="flex relative w-full overflow-hidden">
                    <div className="flex flex-col w-full">
                      {changedAccounts?.map((account, id) => (
                        <div
                          className="grid grid-cols-[repeat(4,1fr)] w-full h-12 px-5 py-3 border-b border-(--color-border-subtle) text-[0.9rem] gap-x-2 hover:bg-(--color-bg-subtle) cursor-pointer"
                          onClick={() => {
                            setToggle("account-details");
                            setChosenAccount(account);
                          }}
                          key={id}
                        >
                          <div className="line-clamp-1">{account.name}</div>
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
                          <div className="line-clamp-1 text-(--color-text-secondary) whitespace-nowrap">
                            {account.description === ""
                              ? "-"
                              : account.description}
                          </div>
                          <div className="line-clamp-1 font-mono">
                            {account.balance}
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
        </div>

        {/* Footer */}
        <div className="flex flex-0 h-fit justify-between w-full px-5 py-2">
          <div
            className={`${unchangedAccounts?.length === 0 || (fetchAccountError && "hidden")} flex w-full text-[0.9rem] text-(--color-text-secondary) items-center gap-2`}
          >
            <p>Show data</p>
            <div className="flex py-2 px-3 border border-(--color-border-default) rounded-md">
              <p>{unchangedAccounts?.length === 0 ? "0" : totalPages}</p>
            </div>
            <p>of {totalNumberOfItems === 0 ? 0 : totalNumberOfItems}</p>
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
                className={`border border-(--color-border-default) rounded-lg px-3 py-2 hover:cursor-pointer ${currentPage === item ? "bg-(--color-brand-green) text-white hover:bg-(--color-brand-green)" : null}`}
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
                <ChevronLeft size={15} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
