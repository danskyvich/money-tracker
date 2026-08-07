import AddAccountModal from "@/features/accounts/components/add-account-modal";
import { AccountCategories } from "@/lib/types/database";
import {  
  ChevronLeft,
  CircleAlert,
  Filter,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import AccountDetailsModal from "./accounts-details-modal";
import AccountListSkeleton from "@/features/accounts/components/skeleton/account-list-skeleton";
import FilterModal from "@/components/layout/filter-modal";
import { FetchAccounts } from "@/lib/supabase/actions/database";
import { FilterField } from "../types/types";
import { useFilterModal } from "@/hooks/useUrlFilters";

const numberOfItemsToBeDisplayed = 9;

export default function WholeAccountsList() {
  // general states
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [fetchAccountError, setFetchAccountError] = useState<string | null>(
    null,
  );
  const [accounts, setAccounts] = useState<any[] | undefined>(undefined); // for accounts
  const [accountCategories, setAccountCategories] = useState<AccountCategories[] | undefined>(undefined);
  const [totalNumberOfItems, setTotalNumberOfItems] = useState<number | null | undefined>(undefined,);

  // for modals
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [chosenAccount, setChosenAccount] = useState<any | null>(null);
  const [addAccountModalOpen, setAddAccountModalOpen] =
    useState<boolean>(false);

  // for pagination only
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = totalNumberOfItems ? Math.ceil(totalNumberOfItems / numberOfItemsToBeDisplayed) : 0;
  const paginationArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  const [windowStart, setWindowStart] = useState(0);
  const visiblePages = paginationArray.slice(windowStart, windowStart + 5);

  // run fetch when this component mounts
  useEffect(() => {
    fetchAccounts();
  }, [currentPage, numberOfItemsToBeDisplayed]);

  const [fields, setFields] = useState<FilterField[]>([
    {
      type: "select",
      key: "type",
      label: "Account Type",
      options: [],
    },
    {
      type: "select",
      key: "category",
      label: "Category",
      options: [],
    },
    {
      type: "date",
      key: "date",
      label: "Date range",
    },
  ]);

  type FetchAccountsResult = // structure of the results coming from fetchAccount[]
  | {
    success: true;
    accountsData: { id: string; name: string; description: string | null}[];
    totalitems: number;
    accountCategoriesData: { id: string, name: string }[];
  }
  | {
    success: false, error: string
  };

  // fetch accounts & account categories
  const fetchAccounts = async () => {
    setAccountsLoading(true);

    const result = await FetchAccounts(
      currentPage,
      numberOfItemsToBeDisplayed,
    );
    if (!result || !result.success) {
      setFetchAccountError(result?.error ?? "Something went wrong.")
      setAccountsLoading(false)
      return;
    }

    const accountTypeOptions = Array.from(
      new Set(result.accountsData?.map((a) => a.name))
    ).map((name) => ({label: name, value: name}))

    const accountCategoriesOptions = result.accountCategoriesData?.map((c) => ({
      label: c.name,
      value: c.id,
    }));


    setAccounts(result.accountsData)
    setAccountCategories(result.accountCategoriesData)
    setTotalNumberOfItems(result.totalItems)

    setAccountsLoading(false);
  };

  // open account details modal
  const handleOpenAccountDetailsModal = (account: any) => {
    setAccountModalOpen(true);
    setChosenAccount(account);
  };
  // handle close account modal
  const handleCloseAddAccountModal = () => {
    setAddAccountModalOpen(false);
  };
  // handle close account details modal
  const handleCloseAccountDetailsModal = () => {
    setAccountModalOpen(false);
  };

  const { open, openModal, closeModal, draft, setField, apply, clear, activeCount } = useFilterModal(fields);

  return (
    <div className="flex xl:w-full h-80dvh xl:h-full border border-(--color-border-default) rounded-lg">
      {accountsLoading ? (
        <AccountListSkeleton />
      ) : (
        <>
          <AddAccountModal
            accountCategoriesData={accountCategories}
            toggle={addAccountModalOpen}
            onClose={handleCloseAddAccountModal}
            refresh={fetchAccounts}
          />

          <AccountDetailsModal
            accountData={chosenAccount}
            toggle={accountModalOpen}
            onClose={handleCloseAccountDetailsModal}
            refresh={fetchAccounts}
          />

          <div className="flex flex-col w-full h-full">
            <div className="flex flex-1 w-full max-h-[10%] py-2 px-2 gap-3 mb-3">
              <div
                className="flex w-fit h-full gap-2 border border-(--color-brand-green) rounded-md px-5 py-2 items-center bg-transparent text-(--color-text-primary) hover:text-white hover:bg-emerald-600 cursor-pointer transition-all duration-200 active:bg-emerald-700"
                onClick={() => setAddAccountModalOpen(true)}
              >
                <Plus size={15} />
                <p className="text-[0.8rem] hidden lg:block">Add an account</p>
              </div>

              {/* Filter by */}
              <button onClick={openModal} className="flex w-fit h-full gap-2 border border-(--color-border-default) rounded-md px-5 py-2 items-center bg-transparent text-(--color-text-primary) cursor-pointer">
                <Filter size={15}/>
                <p className="text-[0.9rem] hidden lg:block">Filters{activeCount > 0 && ` (${activeCount})`}</p>
              </button>
              <FilterModal
                open={open}
                onClose={closeModal}
                fields={fields}
                values={draft}
                onChange={setField}
                onApply={apply}
                onClear={clear}
              />

              {/* Search field */}
              <div className="flex px-5 py-2 w-75 border border-(--color-border-default) rounded-md items-center gap-2">
                <Search size={15} className="flex" />
                <input
                  placeholder="Search..."
                  className="flex flex-3 decorations-none placeholder:text-[0.8rem] focus:outline-none focus:ring-0 focus:border-transparent text-[0.8rem]"
                />
              </div>
            </div>

            {/* Accounts table */}
            <div className="flex flex-auto flex-col w-full h-full overflow-hidden">
              <div className="grid grid-cols-[repeat(4,1fr)] w-full h-fit px-5 py-1 text-[0.9rem] border-b border-(--color-border-default)">
                <div>Account</div>
                <div>Category</div>
                <div>Description</div>
                <div>Balance</div>
              </div>

              <div className="flex relative w-full h-100 xl:h-full overflow-hidden">
                {accounts ? (
                  <div className="flex relative w-full overflow-hidden">
                    <div className="flex flex-col w-full">
                      {accounts?.map((account, id) => (
                        <div
                          className="grid grid-cols-[repeat(4,1fr)] w-full h-12 px-5 py-3 border-b border-(--color-border-subtle) text-[0.9rem] hover:bg-(--color-bg-subtle) cursor-pointer"
                          onClick={() => handleOpenAccountDetailsModal(account)}
                          key={id}
                        >
                          <div className="line-clamp-1">{account.name}</div>
                          <div className="line-clamp-1">
                            {account.account_categories?.name}
                          </div>
                          <div className="line-clamp-1">
                            {account.description}
                          </div>
                          <div className="line-clamp-1 font-mono">
                            {account.balance}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="absolute z-50 bg-black/20 flex w-full h-full inset-0 items-center justify-center">
                    <div className="flex border border-(--color-border-default) bg-(--color-bg-secondary) rounded-lg shadow-md px-5 py-2">
                      {accountsLoading ? (
                        <div className="flex w-full items-center gap-4">
                          <p className="text-[0.9rem] font-mono">
                            Loading accounts...
                          </p>
                        </div>
                      ) : (
                        <div className="flex w-full h-fit items-center gap-4">
                          <CircleAlert size={15} />
                          <p className="text-[0.9rem]">{fetchAccountError}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-1 h-fit justify-between w-full px-5 py-2">
              <div className="flex w-full text-[0.9rem] text-(--color-text-secondary) items-center gap-2">
                <p>Show data</p>
                <div className="flex py-2 px-3 border border-(--color-border-default) rounded-md">
                  <p>9</p>
                </div>
                <p>of {totalNumberOfItems}</p>
              </div>

              <div className="flex w-fit h-full gap-2 items-center">
                {windowStart > 0 && (
                  <div
                    className="flex border border-(--color-border-default) hover:bg-(--color-bg-subtle) cursor-pointer rounded-lg shadow-md"
                    onClick={() =>
                      setWindowStart((prev) => Math.max(0, prev - 5))
                    }
                  >
                    <ChevronLeft size={15} />
                  </div>
                )}
                {visiblePages.map((item, index) => (
                  <div
                    className={`border border-(--color-border-default) rounded-lg px-3 py-2 hover:cursor-pointer ${currentPage === item ? "bg-(--color-brand-green) text-white hover:bg-(--color-brand-green)" : null}`}
                    key={index}
                    onClick={() => setWindowStart(item)}
                  >
                    <p>{item}</p>
                  </div>
                ))}
                {windowStart + 5 < paginationArray.length && (
                  <div
                    className="flex border border-(--color-border-default) hover:bg-(--color-bg-subtle) cursor-pointer rounded-lg shadow-md"
                    onClick={() =>
                      setWindowStart((prev) => Math.min(0, prev + 5))
                    }
                  >
                    <ChevronLeft size={15} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
