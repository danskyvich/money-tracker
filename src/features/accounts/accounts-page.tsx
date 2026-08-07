"use client";

import WholeAccountsList from "@/features/accounts/components/accounts-whole";
import { createClient } from "@/lib/supabase/clients/client";
import {
  CircleAlert,
  Pencil,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import AddAccountCategoryModal from "./components/account-category-add";
import ModifyAccountCategoriesModal from "./components/modify-account-categories-modal";

export default function Accounts() {
  useEffect(() => {
    document.title = "Your accounts";
  }, []);

  // data
  const [categories, setCategories] = useState<any[] | null>(null);

  // modals
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [fetchCategoriesError, setFetchCategoriesError] = useState<
    string | null
  >(null);
  const [totalNumberOfCategories, setTotalNumberOfCategories] = useState<
    number | null
  >(0);
  const [isCategoryAccountOpen, setIsCategoryAccountOpen] = useState(false);
  const [accountCategoryToBeUpdated, setAccountCategoryToBeUpdated] =
    useState<string>("");
  const [uuidToBeTargeted, setUuidToBeTargeted] = useState<string>("");
  const [isInsertAccountCategoryOpen, setIsInsertAccountCategoryOpen] =
    useState<boolean>(false);

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

  // handles the fetch of the category name to be updated
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
      
      {/* Modify existing account category */}
      <ModifyAccountCategoriesModal
       fetch={fetchCategories} 
       setIsOpen={setIsCategoryAccountOpen}
       isOpen={isCategoryAccountOpen}
       setAccountCategoryName={setAccountCategoryToBeUpdated}
       accountCategoryName={accountCategoryToBeUpdated}
       uuid={uuidToBeTargeted}
       />

      {/* Insert new account_category */}
      <AddAccountCategoryModal
        fetch={fetchCategories}
        isOpen={isInsertAccountCategoryOpen}
        setIsOpen={setIsInsertAccountCategoryOpen}
      />

      <p className="text-3xl font-semibold">Accounts</p>

      {/* Main content */}
      <div className="flex flex-col xl:flex-row w-full h-full gap-5">
        <WholeAccountsList />

        {/* Account categories */}
        <div className="flex xl:w-full flex-col w-full xl:h-full border border-(--color-border-default) rounded-lg shadow-md">
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
                      category.name,
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

