"use client";

import WholeAccountsList from "@/features/accounts/components/accounts-whole";
import { createClient } from "@/lib/supabase/clients/client";
import { Book, Pencil, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AccountCategoryListSkeleton from "./components/skeleton/account-categories-list-skeleton";
import Modal from "@/components/layout/modal";
import {
  InsertAccountCategoryName,
  UpdateAccountCategoryName,
} from "@/lib/supabase/actions/database";
import ErrorModal from "@/components/layout/error-modal";
import AccountsPageSkeleton from "./components/skeleton/accounts-page-skeleton";

export default function Accounts() {
  useEffect(() => {
    document.title = "Your accounts";
  }, []);

  // data
  const [accountCategories, setAccountCategories] = useState<any[] | null>(
    null,
  );

  // modals
  const [loading, setLoading] = useState(false);
  const [process, setProcess] = useState(false); // separated from general loading state
  const [accountCategoriesError, setAccountCategoriesError] = useState<
    string | null
  >(null);
  const [totalNumberOfCategories, setTotalNumberOfCategories] = useState<
    number | null
  >(0); // use totalNumber if needed

  const [toggle, setToggle] = useState<string | null>(null);
  const [accountCategoryToBeUpdated, setAccountCategoryToBeUpdated] = useState<
    string | null
  >(null);
  const [newAccountCategoryName, setNewAccountCategoryName] = useState<
    string | null
  >(null);
  const [uuidToBeTargeted, setUuidToBeTargeted] = useState<string | null>(null);

  // fetch account_categories data
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("account_categories")
      .select(`id, name`);

    if (error) {
      setAccountCategoriesError("Error: " + error.message);
      setLoading(false);
      return;
    }
    setAccountCategories(data);
    setLoading(false);
  };

  // handle adding a new account category
  const handleAddAccountCategory = async (name: string) => {
    setProcess(true);

    const result = await InsertAccountCategoryName(name);
    if (result.error || !result.success) {
      setAccountCategoriesError("Error: " + result.error);
      setToggle(null);
      setProcess(false);
      return;
    }
    setToggle(null);
    fetchCategories();
    setProcess(false);
  };

  // handle updating account categories
  const handleModifyAccountCategory = async (name: string) => {
    if (uuidToBeTargeted === null) {
      setAccountCategoriesError("You haven't picked a category. Try again");
      return;
    }
    setProcess(true);

    const result = await UpdateAccountCategoryName(name, uuidToBeTargeted);
    if (!result.success || result.error) {
      setAccountCategoriesError("Error: " + result?.error);
      setAccountCategoryToBeUpdated(null);
      setUuidToBeTargeted(null);
      setToggle(null);
      setProcess(false);
      return;
    }
    setUuidToBeTargeted(null);
    setToggle(null);
    fetchCategories();
    setProcess(false);
  };

  return (
    <>
      {loading ? (
        <AccountsPageSkeleton/>
      ) : (
        <div className="flex flex-col w-full h-full gap-5">
          {accountCategoriesError && (
            <ErrorModal message={accountCategoriesError} />
          )}
          {toggle === "add-account-category" && (
            <div className="absolute z-50 inset-0 flex w-full h-full bg-black/50 items-center justify-center">
              <Modal
                open
                onOpen={() => setToggle(null)}
                onCancel={() => setToggle(null)}
                onConfirm={() =>
                  handleAddAccountCategory(newAccountCategoryName ?? "")
                }
                loading={process}
                icon={<Book size={20} />}
                header="Add an account category"
                noButtonText="No"
                yesButtonText="Add account category"
              >
                <div className="flex w-full h-full flex-col gap-2">
                  <label htmlFor="account_category" className="text-[1rem]">
                    Enter a new name:
                  </label>
                  <input
                    className="flex border rounded-md border-(--color-border-default) px-5 py-1 mb-5 placeholder:text-[0.9rem] text-[0.9rem] outline-none focus:border-(--color-border-strong)"
                    type="text"
                    id="account_category"
                    placeholder="ex. Investments"
                    onChange={(e) => setNewAccountCategoryName(e.target.value)}
                  />
                </div>
              </Modal>
            </div>
          )}
          {toggle === "modify-account-category" && (
            <div className="absolute z-50 inset-0 flex w-dvw h-dvh bg-black/50 items-center justify-center">
              <Modal
                open
                onOpen={() => setToggle(null)}
                onCancel={() => setToggle(null)}
                onConfirm={() =>
                  handleModifyAccountCategory(accountCategoryToBeUpdated ?? "")
                }
                loading={process}
                icon={<Book size={20} />}
                header="Modify an account category"
                noButtonText="No"
                yesButtonText="Apply changes"
              >
                <div className="flex w-full h-full flex-col gap-2">
                  <label htmlFor="account_category" className="text-[1rem]">
                    Enter a new name:
                  </label>
                  <input
                    className="flex border rounded-md border-(--color-border-default) px-5 py-1 mb-5 placeholder:text-[0.9rem] text-[0.9rem] outline-none focus:border-(--color-border-strong)"
                    type="text"
                    value={accountCategoryToBeUpdated ?? ""}
                    id="account_category"
                    placeholder="ex. Investments"
                    onChange={(e) =>
                      setAccountCategoryToBeUpdated(e.target.value)
                    }
                  />
                </div>
              </Modal>
            </div>
          )}

          <p className="text-3xl font-semibold">Accounts</p>

          {/* Main content */}
          <div className="flex flex-col xl:flex-row w-full h-full gap-5">
            <WholeAccountsList />

            {/* Account categories */}
            <div className="flex flex-1 xl:w-full flex-col w-full xl:h-full border border-(--color-border-default) rounded-lg shadow-lg">
              {loading ? (
                <AccountCategoryListSkeleton />
              ) : (
                <>
                  <div className="flex w-full items-center justify-between h-fit border-b border-(--color-border-subtle) px-5 py-3">
                    <p className="text-xl font-semibold">Categories</p>

                    <div
                      className="flex w-fit h-fit items-center gap-1 cursor-pointer text-white px-3 py-2 text-[0.9rem] font-display bg-(--color-brand-gold) rounded-lg shadow-md hover:bg-yellow-600 duration-100 transition-all"
                      onClick={() => setToggle("add-account-category")}
                    >
                      <Plus size={20} />
                      <p className="text-[0.9rem]">Add a category</p>
                    </div>
                  </div>

                  {/* Category tables */}
                  <div className="flex relative flex-col w-full h-110 xl:h-full overflow-y-auto overflow-x-hidden">
                    {accountCategories && accountCategories.length > 0 ? (
                      accountCategories?.map((category, key) => (
                        <div
                          className="flex w-full h-fit px-5 py-2 border-(--color-border-subtle) border-b items-center justify-between hover:bg-(--color-bg-subtle) active:bg-(--color-bg-secondary) cursor-pointer"
                          key={key}
                          onClick={() => {
                            setToggle("modify-account-category");
                            setUuidToBeTargeted(category.id);
                            setAccountCategoryToBeUpdated(category.name);
                          }}
                        >
                          <p className="text-[0.9rem] font-display">
                            {category.name}
                          </p>
                          <Pencil size={15} />
                        </div>
                      ))
                    ) : (
                      <div className="flex w-full h-full items-center justify-center">
                        <p className="text-[0.9rem] font-mono">You have no categories.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
