import AddAccountModal from "@/feature/accounts/components/add-account-modal";
import { AccountCategories } from "@/lib/types/database";
import { createClient } from "@/supabase/client";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  CircleAlert,
  ListFilter,
  PiggyBank,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import AccountDetailsModal from "./accounts-details-modal";
import AccountListSkeleton from "@/feature/accounts/components/account-list-skeleton";

export default function WholeAccountsList() {
  // general states
  const [filter, setFilter] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("Filter");
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [fetchAccountError, setFetchAccountError] = useState<string | null>(
    null,
  );
  const [accounts, setAccounts] = useState<any[] | null>(null); // for accounts
  const [accountCategories, setAccountCategories] = useState<
    AccountCategories[] | null
  >(null);
  const [totalNumberOfItems, setTotalNumberOfItems] = useState<number | null>(
    null,
  );

  // for modals
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [chosenAccount, setChosenAccount] = useState<any | null>(null);
  const [addAccountModalOpen, setAddAccountModalOpen] =
    useState<boolean>(false);

  // for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = totalNumberOfItems ? Math.ceil(totalNumberOfItems / 9) : 0;
  const paginationArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  const [windowStart, setWindowStart] = useState(0);
  const visiblePages = paginationArray.slice(windowStart, windowStart + 5);

  // fetch accounts data
  useEffect(() => {
    fetchAccounts();
  }, [currentPage]);

  const fetchAccounts = async () => {
    setAccountsLoading(true);

    const [accountsResult, balancesResult, accountCategoriesResult] =
      await Promise.all([
        // use Promise.all to merge both fetches
        await (
          await createClient()
        )
          .from("accounts")
          .select(
            `id, name, account_categories!category_id(name), description`,
            {
              count: "exact",
            },
          )
          .range((currentPage - 1) * 9, (currentPage - 1) * 9 + 9 - 1),
        await (await createClient())
          .from("accounts_balances")
          .select(`account_id, balance::text`),
        await (await createClient())
          .from("account_categories")
          .select(`id, name`),
      ]);

    // deconstruct into two sets of variables
    const { data: accountsData, count, error: accountsError } = accountsResult;
    const { data: balancesData, error: balancesError } = balancesResult;
    const { data: accountCategoriesData, error: accountCategoriesError } =
      accountCategoriesResult;

    if (accountsError || balancesError || accountCategoriesError) {
      setFetchAccountError(
        accountsError?.message +
          ", " +
          balancesError?.message +
          ", " +
          accountCategoriesError?.message,
      );
      setAccounts(null);
      setAccountsLoading(false);
      setAccountCategories(null);
    }

    let merged: any[] = [];

    if (accountsData && balancesData) {
      const balancesMap = new Map(
        balancesData.map((b) => [b.account_id, b.balance]),
      );

      merged = accountsData.map((a) => ({
        ...a,
        balance: balancesMap.get(a.id) ?? 0,
      }));
    }

    if (merged.length > 0) {
      setAccounts(merged);
      setFetchAccountError(null);
      setTotalNumberOfItems(count);
      setAccountsLoading(false);
      setAccountCategories(accountCategoriesData);
    }

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

  return (
    <>
      {accountsLoading ? (
        <div className="flex w-full h-full">
          <AccountListSkeleton />
        </div>
      ) : (
        <div className="xl:flex-2 h-80dvh xl:h-full border border-(--color-border-default) rounded-lg">
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
            <div className="flex flex-1 w-full h-fit">
              <div className="flex w-full h-fit px-5 py-2 gap-2 whitespace-nowrap">
                <div
                  className="flex w-fit h-full border border-(--color-brand-green) rounded-md px-5 py-1 items-center gap-2 bg-transparent text-(--color-text-primary) hover:text-white hover:bg-emerald-600 cursor-pointer transition-all duration-200 active:bg-emerald-700"
                  onClick={() => setAddAccountModalOpen(true)}
                >
                  <Plus size={15} />
                  <p className="text-[0.8rem] hidden lg:block">
                    Add an account
                  </p>
                </div>

                {/* Filter by */}
                <div className="relative flex flex-col">
                  <div
                    className={`flex w-fit items-center border border-(--color-border-default) ${filter ? "rounded-t-lg rounded-tr-lg" : "rounded-lg"} px-5 py-1 gap-2 cursor-pointer hover:bg-(--color-bg-subtle) transition-all duration-100`}
                    onClick={() => setFilter((prev) => !prev)}
                  >
                    <ListFilter size={15} className="flex" />
                    <p className="text-[0.8rem] hidden lg:block">
                      {selectedType}
                    </p>
                    {filter ? (
                      <ChevronUp size={15} />
                    ) : (
                      <ChevronDown size={15} />
                    )}
                  </div>

                  {filter && (
                    <div className="absolute w-full z-50 top-[2.3rem] bg-(--color-bg-secondary) border border-(--color-border-default) rounded-b-lg rounded-bl-lg"></div>
                  )}
                </div>

                {/* Date range */}
                <div className="flex w-fit h-full items-center border border-(--color-border-default) rounded-md px-5 py-1 cursor-pointer hover:bg-(--color-bg-subtle) gap-2 transition-all duration-100">
                  <Calendar size={15} />
                  <p className="font-display text-[0.8rem] hidden lg:block text-(--color-text-primary)">
                    Date range
                  </p>
                  <ChevronDown size={15} />
                </div>

                {/* Search field */}
                <div className="px-5 flex w-75 border border-(--color-border-default) rounded-md items-center gap-2">
                  <Search size={15} className="flex" />
                  <input
                    placeholder="Search..."
                    className="flex flex-3 decorations-none placeholder:text-[0.8rem] focus:outline-none focus:ring-0 focus:border-transparent text-[0.8rem]"
                  />
                </div>
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
        </div>
      )}
    </>
  );
}
