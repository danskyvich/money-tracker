"use client";

import {DeleteAccountCategoryName, InsertAccountCategoryName, UpdateAccountCategoryName} from "@/services/supabase/actions/databaseActions";
import { createClient } from "@/services/supabase/client";
import {
  BookImage,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  CircleAlert,
  File,
  ListFilter,
  Pencil,
  PiggyBank,
  Plus,
  Search,
  X,
} from "lucide-react";
import { error } from "node:console";
import { useActionState, useEffect, useState } from "react";

export default function Accounts({}: {}) {
  useEffect(() => {
    document.title = "Your accounts";
  }, []);

  // for fetching data from db
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [fetchAccountError, setFetchAccountError] = useState<string | null>(
    null,
  );
  const [fetchCategoriesError, setFetchCategoriesError] = useState<
    string | null
  >(null);
  const [totalNumberOfCategories, setTotalNumberOfCategories] = useState<
    number | null
  >(0);
  const [accounts, setAccounts] = useState<any[] | null>(null);
  const [categories, setCategories] = useState<any[] | null>(null);
  const [totalNumberOfItems, setTotalNumberOfItems] = useState<number | null>(
    null,
  );

  //for UI changes
  const [filter, setFilter] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("Filter");
  const [isCategoryAccountOpen, setIsCategoryAccountOpen] = useState(false);

  // for seeing transactions of that specific account
  const [seeAccountTransactions, setSeeAccountTransactions] = useState(false);
  const [chosenAccount, setChosenAccount] = useState("");

  // for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = totalNumberOfItems ? Math.ceil(totalNumberOfItems / 9) : 0;
  const paginationArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  const [windowStart, setWindowStart] = useState(0);
  const visiblePages = paginationArray.slice(windowStart, windowStart + 5);

  // update account_category
  const [accountCategoryToBeUpdated, setAccountCategoryToBeUpdated] =
    useState<string>("");
  const [uuidToBeTargeted, setUuidToBeTargeted] = useState<string>("");
  const [updateAccountNameError, setUpdateAccountCategoryError] = useState("");

  // delete account_category
  const [deleteAccountCategoryError, setDeleteAccountCategoryError] =
    useState("");

  // insert account_category
  const [isInsertAccountCategoryOpen, setIsInsertAccountCategoryOpen] = useState<boolean>(false);
  const [insertAccountCategoryError, setInsertAccountCategoryError] = useState("");

  // fetch accounts data
  useEffect(() => {
    const fetchAccounts = async () => {
      setAccountsLoading(true);

      const [accountsResult, balancesResult] = await Promise.all([
        // use Promise.all to merge both fetches
        await (
          await createClient()
        )
          .from("accounts")
          .select(
            `id, name, account_categories!category_id(name), description`,
            { count: "exact" },
          )
          .range((currentPage - 1) * 9, (currentPage - 1) * 9 + 9 - 1),
        await (await createClient())
          .from("accounts_balances")
          .select(`account_id, balance`),
      ]);

      // deconstruct into two sets of variables
      const {
        data: accountsData,
        count,
        error: accountsError,
      } = accountsResult;
      const { data: balancesData, error: balancesError } = balancesResult;

      if (accountsError || balancesError) {
        setFetchAccountError(
          accountsError?.message + ", " + balancesError?.message,
        );
        console.log(accountsError, balancesError);
        setAccounts(null);
        setAccountsLoading(false);
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
      }
    };

    setAccountsLoading(false);
    fetchAccounts();
  }, [currentPage]);

  // fetch account_categories data
  useEffect(() => {
    fetchCategories();
  }, []);

  // fetch accounts & accounts_balances data
  const fetchCategories = async () => {
    setCategoriesLoading(true);
    const { data, count, error } = await (await createClient())
      .from("account_categories")
      .select(`id, name`, { count: "exact" }); // select columns to be query, count # of rows

    if (error) {
      setFetchCategoriesError("Error: " + error.message);
      setCategories(null);
      setCategoriesLoading(false);
    }

    if (data) {
      setCategories(data);
      setFetchCategoriesError(null);
      setTotalNumberOfCategories(count);
      setCategoriesLoading(false);
    }

    setCategoriesLoading(false);
  };

  // client-side update form action
  const [updateState, updateFormAction, updatePending] = useActionState(
    async (_prevState: any, formData: FormData) => {
      const newName = formData.get("category_name") as string;

      if (!newName?.trim())
        return setUpdateAccountCategoryError("Error: empty fields");

      const result = await UpdateAccountCategoryName(newName, uuidToBeTargeted);

      if (!result.success)
        return setUpdateAccountCategoryError("Error: " + result.error);

      setIsCategoryAccountOpen(false);
      fetchCategories();
    },
    null,
  );

  //client-side delete form action
  const [deleteState, deleteFormAction, deletePending] = useActionState(
    async (_prevState: any) => {
      const result = await DeleteAccountCategoryName(uuidToBeTargeted);

      if (!result.success)
        return setDeleteAccountCategoryError("Error: " + result.error);

      setIsCategoryAccountOpen(false);
      fetchCategories();
    },
    null,
  );

  // client-side insert form action
  const [insertState, insertFormAction, insertPending] = useActionState(
    async (_prevState: any, formData: FormData) => {
      const nameOfInsertedCategory = formData.get("new_category_name") as string;

      if (!nameOfInsertedCategory?.trim()) return setInsertAccountCategoryError("Error: empty fields");

      const result = await InsertAccountCategoryName(nameOfInsertedCategory);

      if (!result.success) return setInsertAccountCategoryError("Error: " + result.error)

      setIsCategoryAccountOpen(false)
      fetchCategories();
    },
    null
  )

  const handleAccountCategoryNameUpdateOpenModal = (
    name: string,
    uuid: string,
  ) => {
    setIsCategoryAccountOpen(true);
    setAccountCategoryToBeUpdated(name);
    setUuidToBeTargeted(uuid);
  };

  return (
    <div className="flex relative flex-col w-full h-full gap-5">
      {/* Account transactions modal */}
      {seeAccountTransactions && (
        <div className="fixed flex inset-0 z-50 w-full h-full bg-black/50 items-center justify-center">
          <div className="flex flex-col w-115 md:w-150 lg:w-200 xl:w-300 2xl:w-300 h-150 border border-(--color-border-default) bg-(--color-bg-secondary) rounded-lg shadow-lg p-5">
            <div className="flex w-full justify-between items-center">
              <PiggyBank size={20} />
              <p className="text-xl font-semibold">{chosenAccount}</p>
              <X
                size={20}
                onClick={() => setSeeAccountTransactions(false)}
                className="cursor-pointer"
              />
            </div>

            <div className="flex flex-col w-full h-full items-center justify-center"></div>
          </div>
        </div>
      )}

      {/* Category modification modal */}
      {isCategoryAccountOpen && (
        <div className="fixed flex z-50 inset-0 bg-black/50 w-full h-full items-center justify-center">
          <div className="flex flex-col w-75 lg:w-100 h-fit p-5 border border-(--color-border-default) rounded-lg bg-(--color-bg-secondary) shadow-md">
            <div className="flex w-full h-fit justify-between items-center pb-5">
              <BookImage size={20} />
              <p className="font-semibold text-xl whitespace-nowrap">
                Edit Category Name
              </p>
              <X
                size={20}
                className="cursor-pointer"
                onClick={() => setIsCategoryAccountOpen(false)}
              />
            </div>
            <form className="flex flex-col w-full gap-2">
              {/* Input new category name */}
              <input
                placeholder="Enter a new name..."
                className="flex border rounded-md border-(--color-border-default) px-5 py-1 mb-5 placeholder:text-[0.9rem] text-[0.9rem] outline-none focus:border-(--color-border-strong)"
                value={accountCategoryToBeUpdated}
                onChange={(e) => setAccountCategoryToBeUpdated(e.target.value)}
                name="category_name"
              />

              <button
                formAction={updateFormAction}
                type="submit"
                className="flex px-5 py-1 border border-(--color-brand-green) bg-(--color-brand-green) rounded-lg shadow-md items-center justify-center text-[0.9rem] text-white cursor-pointer hover:bg-emerald-700 hover:border-emerald-700 active:bg-emerald-800 active:border-emerald-800 duration-100 transition-all"
              >
                {updatePending ? (
                  <p>Updating name...</p>
                ) : (
                  <p>Accept changes</p>
                )}
              </button>

              <button
                formAction={deleteFormAction}
                type="submit"
                className="flex px-5 py-1 border border-(--color-brand-green) hover:text-white rounded-lg shadow-md items-center justify-center text-[0.9rem] cursor-pointer hover:bg-(--color-brand-green) active:bg-emerald-700 active:border-emerald-800 duration-100 transition-all"
              >
                {deletePending ? (
                  <p>Deleting category...</p>
                ) : (
                  <p>Delete category</p>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Insert new account_category */}
      {isInsertAccountCategoryOpen && (
        <div className="fixed inset-0 z-50 flex w-full h-full bg-black/50 items-center justify-center">
          <div className="flex flex-col w-75 lg:w-100 h-fit p-5 border border-(--color-border-default) rounded-lg bg-(--color-bg-secondary) shadow-md">
            <div className="flex w-full h-fit justify-between items-center pb-5">
              <BookImage size={20} />
              <p className="font-semibold text-xl whitespace-nowrap">
                Edit Category Name
              </p>
              <X
                size={20}
                className="cursor-pointer"
                onClick={() => setIsInsertAccountCategoryOpen(false)}
              />
            </div>

            <form className="flex flex-col w-full gap-2">
              <input
                placeholder="Enter a new name..."
                className="flex border rounded-md border-(--color-border-default) px-5 py-1 mb-5 placeholder:text-[0.9rem] text-[0.9rem] outline-none focus:border-(--color-border-strong)"
                name="new_category_name"
              />

              <button type="submit" formAction={insertFormAction} className="flex px-5 py-1 border border-(--color-brand-green) bg-(--color-brand-green) rounded-lg shadow-md items-center justify-center text-[0.9rem] text-white cursor-pointer hover:bg-emerald-700 hover:border-emerald-700 active:bg-emerald-800 active:border-emerald-800 duration-100 transition-all">
                {
                  insertPending ? <p>Adding category...</p> : <p>Add new category</p>
                }
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex w-full items-center">
        <p className="text-3xl font-semibold">Accounts</p>

        <div className="flex w-auto flex-auto" />

        <div className="flex w-fit h-fit ring ring-inset ring-(--color-brand-green) hover:bg-(--color-brand-green) transition-all duration-100 rounded-lg items-center text-[0.8rem] gap-1 px-5 py-1 cursor-pointer">
          <File size={15} />
          <p>Export report</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col xl:flex-row w-full h-full gap-5">
        {/* Accounts */}
        <div className="xl:flex-2 h-80dvh xl:h-full grid grid-cols-1 grid-rows-[auto_1fr_auto] h-100dvh border border-(--color-border-default) rounded-lg">
          {/** Transaction headers */}
          <div className="flex w-full h-fit">
            {/** Top Bar */}
            <div className="flex w-full h-fit px-5 py-2 gap-2 whitespace-nowrap">
              <div className="flex w-fit h-full border border-(--color-brand-green) rounded-md px-5 py-1 items-center gap-2 bg-transparent text-(--color-text-primary) hover:text-white hover:bg-emerald-600 cursor-pointer transition-all duration-200 active:bg-emerald-700">
                <Plus size={15} />
                <p className="text-[0.8rem] hidden lg:block">Add an account</p>
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
                  {filter ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
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
          <div className="flex flex-col w-full h-full overflow-hidden">
            <div className="grid grid-cols-[repeat(4,1fr)] w-full h-fit px-5 py-1 text-[0.9rem] border-b border-(--color-border-default)">
              <div>Account</div>
              <div>Category</div>
              <div>Description</div>
              <div>Balance</div>
            </div>

            <div className="flex relative w-full h-full overflow-hidden">
              {accounts ? (
                <div className="flex relative w-full h-full overflow-hidden">
                  <div className="flex flex-col w-full h-fit">
                    {accounts?.map((account) => (
                      <div className="grid grid-cols-[repeat(4,1fr)] w-full px-5 py-3 border-b border-(--color-border-subtle) text-[0.9rem] hover:bg-(--color-bg-subtle) cursor-pointer">
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
                      <div className="flex w-full items-center gap-4">
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
          <div className="flex h-fit justify-between w-full px-5 py-2">
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

        {/* Account categories */}
        <div className="flex xl:flex-1 flex-col w-full h-50dvh xl:h-full border border-(--color-border-default) rounded-lg shadow-md">
          <div className="flex w-full items-center justify-between h-fit border-b border-(--color-border-subtle) px-5 py-3">
            <p className="text-xl font-semibold">Categories</p>

            <div
              className="flex w-fit h-fit items-center gap-1 cursor-pointer text-white px-3 py-2 text-[0.9rem] font-display bg-(--color-brand-gold) rounded-lg shadow-md hover:bg-yellow-600 duration-100 transition-all"
              onClick={() => setIsInsertAccountCategoryOpen(true)}
            >
              <Plus size={20} />
              <p className="text-[0.9rem]">Add a category</p>
            </div>
          </div>

          {/* Category tables */}
          <div className="flex relative flex-col w-full h-full overflow-y-auto overflow-x-hidden">
            {categories ? (
              categories?.map((category, key) => (
                <div
                  className="flex w-full h-fit px-5 py-2 border-(--color-border-subtle) border-b items-center justify-between hover:bg-(--color-bg-subtle) active:bg-(--color-bg-secondary) cursor-pointer"
                  key={key}
                  onClick={() =>
                    handleAccountCategoryNameUpdateOpenModal(
                      category.item,
                      category.id,
                    )
                  }
                >
                  <p className="text-[0.9rem] font-display">{category.name}</p>
                  <Pencil size={15} />
                </div>
              ))
            ) : (
              <div className="absolute z-50 bg-black/20 flex w-full h-full inset-0 items-center justify-center">
                <div className="flex border border-(--color-border-default) bg-(--color-bg-secondary) rounded-lg shadow-md px-5 py-2">
                  {categoriesLoading ? (
                    <div className="flex w-full items-center gap-4">
                      <p className="text-[0.9rem] font-mono">
                        Loading categories...
                      </p>
                    </div>
                  ) : (
                    <div className="flex w-full items-center gap-4">
                      <CircleAlert size={15} />
                      <p className="text-[0.9rem]">{fetchCategoriesError}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

