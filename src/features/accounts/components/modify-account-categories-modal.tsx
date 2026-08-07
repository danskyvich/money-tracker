import ErrorModal from "@/components/layout/error-modal";
import {
  DeleteAccountCategoryName,
  UpdateAccountCategoryName,
} from "@/lib/supabase/actions/database";
import { BookImage, X } from "lucide-react";
import { Dispatch, useActionState } from "react";

interface ModifyAccountCategoriesModal {
  fetch: () => void;
  isOpen: boolean;
  accountCategoryName: string;
  uuid: string;
  setAccountCategoryName: Dispatch<React.SetStateAction<string>>;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
}

export default function ModifyAccountCategoriesModal({
  isOpen,
  setIsOpen,
  uuid,
  setAccountCategoryName,
  fetch,
  accountCategoryName,
}: ModifyAccountCategoriesModal) {
  // client-side update category form action
  const [updateState, updateFormAction, updatePending] = useActionState(
    async (_prevState: any, formData: FormData) => {
      const newName = formData.get("category_name") as string;

      if (newName?.trim() === "") return { error: "Field must not be empty" };

      const result = await UpdateAccountCategoryName(newName, uuid);

      if (!result.success) return { error: result?.error};

      setIsOpen(false);
      fetch();
    },
    null,
  );

  //client-side account category deletion form action
  const [deleteState, deleteFormAction, deletePending] = useActionState(
    async (_prevState: any) => {
      const result = await DeleteAccountCategoryName(uuid);

      if (!result.success) return { error: result?.error };

      setIsOpen(false);
      fetch();
    },
    null,
  );

  return (
    <>
      {(updateState?.error || deleteState?.error) && (
        <ErrorModal message={updateState?.error || deleteState?.error}/>
      )}
      {isOpen && (
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
                onClick={() => setIsOpen(false)}
              />
            </div>
            <form className="flex flex-col w-full gap-2">
              <input
                className="flex border rounded-md border-(--color-border-default) px-5 py-1 mb-5 placeholder:text-[0.9rem] text-[0.9rem] outline-none focus:border-(--color-border-strong)"
                value={accountCategoryName}
                onChange={(e) => setAccountCategoryName(e.target.value)}
                name="category_name"
              />

              <button
                formAction={updateFormAction}
                type="submit"
                className={`${deletePending || (updatePending && "pointer-events-none border-(--color-border-subtle) bg-(--color-border-subtle)")} flex px-5 py-1 border border-(--color-brand-green) bg-(--color-brand-green) rounded-lg shadow-md items-center justify-center text-[0.9rem] text-white cursor-pointer hover:bg-emerald-700 hover:border-emerald-700 active:bg-emerald-800 active:border-emerald-800 duration-100 transition-all`}
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
                className={`${deletePending || (updatePending && "pointer-events-none border-(--color-border-subtle) bg-(--color-border-subtle)")} flex px-5 py-1 border border-(--color-brand-green) hover:text-white rounded-lg shadow-md items-center justify-center text-[0.9rem] cursor-pointer hover:bg-(--color-brand-green) active:bg-emerald-700 active:border-emerald-800 duration-100 transition-all`}
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
    </>
  );
}
