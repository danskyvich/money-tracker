"use client";

import WholeAccountsList from "@/feature/accounts/components/accounts-whole";
import {DeleteAccountCategoryName, InsertAccountCategoryName, UpdateAccountCategoryName} from "@/supabase/dbActions";
import { createClient } from "@/supabase/client";
import {
  BookImage,
  CircleAlert,
  File,
  Pencil,
  PiggyBank,
  Plus,
  X,
} from "lucide-react";
import { useActionState, useEffect, useState } from "react";

export default function Accounts() {
  useEffect(() => {
    document.title = "Your accounts";
  }, []);

  // for fetching data from db
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [fetchCategoriesError, setFetchCategoriesError] = useState<
    string | null
  >(null);
  const [totalNumberOfCategories, setTotalNumberOfCategories] = useState<
    number | null
  >(0);
  const [categories, setCategories] = useState<any[] | null>(null);

  //for UI changes
  const [isCategoryAccountOpen, setIsCategoryAccountOpen] = useState(false);

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

  // fetch account_categories data
  useEffect(() => {
    fetchCategories();
  }, []);

  
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

              <button
                type="submit"
                formAction={insertFormAction}
                className="flex px-5 py-1 border border-(--color-brand-green) bg-(--color-brand-green) rounded-lg shadow-md items-center justify-center text-[0.9rem] text-white cursor-pointer hover:bg-emerald-700 hover:border-emerald-700 active:bg-emerald-800 active:border-emerald-800 duration-100 transition-all"
              >
                {insertPending ? (
                  <p>Adding category...</p>
                ) : (
                  <p>Add new category</p>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <p className="text-3xl font-semibold">Accounts</p>

      {/* Main content */}
      <div className="flex flex-col xl:flex-row w-full h-full gap-5">
        <WholeAccountsList />

        {/* Account categories */}
        <div className="flex xl:flex-1 flex-col w-full xl:h-full border border-(--color-border-default) rounded-lg shadow-md">
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
          <div className="flex relative flex-col w-full h-110 xl:h-full overflow-y-auto overflow-x-hidden">
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

