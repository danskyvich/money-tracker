import ErrorModal from "@/components/layout/error-modal";
import { InsertAccountCategoryName } from "@/lib/supabase/actions/database";
import { BookImage, X } from "lucide-react";
import React, {
  Dispatch,
  SetStateAction,
  useActionState,
} from "react";

interface AddAccountCategoryModalProps {
  fetch: () => void;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AddAccountCategoryModal({
  fetch,
  isOpen,
  setIsOpen,
}: AddAccountCategoryModalProps) {
  // client-side account category insert form action
  const [insertState, insertFormAction, insertPending] = useActionState(
    async (_prevState: any, formData: FormData) => {
      const nameOfInsertedCategory = formData.get(
        "new_category_name",
      ) as string;

      if (!nameOfInsertedCategory?.trim())
        return { error: "Field must not be empty"};

      const result = await InsertAccountCategoryName(nameOfInsertedCategory);

      if (!result.success) return { error: result?.error};

      setIsOpen(false);

      fetch();
    },
    null,
  );
  return (
    <>
    {
      insertState && <ErrorModal message={insertState?.error}/>
    }
      {isOpen && (
        <div className="fixed inset-0 z-50 flex w-full h-full bg-black/50 items-center justify-center">
          <div className="flex flex-col w-75 lg:w-100 h-fit p-5 border border-(--color-border-default) rounded-lg bg-(--color-bg-secondary) shadow-md">
            <div className="flex w-full h-fit justify-between items-center pb-5">
              <BookImage size={20} />
              <p className="font-semibold text-xl whitespace-nowrap">
                Add new category
              </p>
              <X
                size={20}
                className="cursor-pointer"
                onClick={() => setIsOpen(false)}
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
    </>
  );
}
