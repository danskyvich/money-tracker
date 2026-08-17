import ErrorModal from "@/components/layout/error-modal";
import Modal from "@/components/layout/modal";
import Spinner from "@/components/layout/spinner";
import {
  AddExpenseCategory,
  DeleteExpenseCategory,
  FetchExpenseCategories,
} from "@/lib/supabase/actions/database";
import { Categories } from "@/lib/types/derived";
import { Coins, Pencil, Plus, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ExpenseCategoriesProps {
  open: boolean;
  onOpen: () => void;
}

export default function ExpenseCategories({
  open,
  onOpen,
}: ExpenseCategoriesProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [process, setProcess] = useState<boolean>(false);
  const [expenseCategoriesData, setExpenseCategoriesData] = useState<
    Categories[] | null
  >(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [toggle, setToggle] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);

    const result = await FetchExpenseCategories();

    if (!result.success) {
      setFetchError(result.error);
      setLoading(false);
      return;
    }

    setExpenseCategoriesData(result.data);
    setLoading(false);
    return;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddExpenseCategory = async () => {
    const trimmedName = name?.trim();

    if (!trimmedName) {
      setFetchError("Field empty");
      return;
    }

    setFetchError(null);
    setProcess(true);

    const result = id
      ? await AddExpenseCategory(trimmedName, id)
      : await AddExpenseCategory(trimmedName);

    if (!result.success) {
      setFetchError(result.error);
      setProcess(false);
      return;
    }

    setProcess(false);
    setId(null);
    setName("");
    fetchData();
    onOpen();
  };

  const handleDeleteExpenseCategory = async () => {
    if (!id) {
      setFetchError("No chosen category");
      return;
    }
    setFetchError(null);
    setProcess(true);

    const result = await DeleteExpenseCategory(id);
    if (!result.success) {
      setFetchError(result.error);
      setProcess(false);
      return;
    }

    setProcess(false);
    setName("");
    setId(null);
    fetchData();
    onOpen();
  };

  if (!open) return null;
  return (
    <div className="flex flex-col w-100 xl:w-125 min-h-100 bg-(--color-bg-secondary) border border-(--color-border-default) rounded-lg">
      {fetchError && <ErrorModal message={fetchError} />}
      {toggle === "delete-category" && (
        <div className="fixed z-50 inset-0 bg-black/50 flex w-full h-full items-center justify-center">
          <Modal
            open
            onOpen={() => setToggle(null)}
            loading={process}
            onCancel={() => setToggle(null)}
            icon={<Trash size={18} className="min-w-3 h-auto" />}
            noButtonText="No"
            yesButtonText="Delete category"
            header="Delete expense category"
            message={`Are you sure you want to delete the "${name}" category?`}
            onConfirm={handleDeleteExpenseCategory}
          />
        </div>
      )}
      {toggle === "name-category" && (
        <div className="fixed z-50 inset-0 bg-black/50 flex w-full h-full items-center justify-center">
          <Modal
            open
            onOpen={() => setToggle(null)}
            loading={process}
            header="Name the expense category"
            icon={<Coins size={18} className="min-w-3 h-auto" />}
            onConfirm={handleAddExpenseCategory}
            noButtonText="Return"
            yesButtonText="Add the category"
            onCancel={() => setToggle(null)}
          >
            <label className="text-[0.9rem]" htmlFor="name-input" />
            <input
              type="text"
              id="name-input"
              value={name ?? ""}
              onChange={(e) => setName(e.target.value)}
              placeholder="eg. Entertainment"
              className="flex w-full p-3 py-1 border border-(--color-border-default) rounded-lg focus:outline focus:outline-(--color-border-strong)"
            />
          </Modal>
        </div>
      )}
      {/* header */}
      <div className="flex flex-0 w-full h-fit justify-between px-5 pt-5 pb-2">
        <Coins size={20} className="min-w-5" />
        <p className="text-xl font-semibold">Expense categories</p>
        <X onClick={() => onOpen()} className="cursor-pointer" />
      </div>

      <div className="flex flex-1 w-full h-full">
        {loading ? (
          <div className="fixed z-50 inset-0 flex w-full h-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col w-full h-full">
            {expenseCategoriesData?.map((item, id) => (
              <div
                className="flex w-full h-full border-y border-(--color-border-subtle) px-5 py-3 items-center justify-between"
                key={id}
              >
                <p className="text-[0.9rem] ">{item.name}</p>
                <div className="flex w-fit gap-2">
                  <Pencil
                    size={15}
                    className="min-w-3 h-auto cursor-pointer"
                    onClick={() => {
                      setName(item.name);
                      setId(item.id);
                      setToggle("name-category");
                    }}
                  />
                  <Trash
                    size={18}
                    className="min-w-3 h-auto text-red-400 cursor-pointer"
                    onClick={() => {
                      setToggle("delete-category");
                      setId(item.id);
                      setName(item.name);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-0 w-full h-fit px-5 py-3">
        <div
          className="flex w-full border border-(--color-border-default) rounded-lg py-1 items-center justify-center gap-1 text-[0.9rem] hover:bg-(--color-brand-green) active:bg-emerald-700 transition-all duration-100 cursor-pointer"
          onClick={() => {
            setToggle("name-category");
          }}
        >
          {process ? (
            <Spinner />
          ) : (
            <>
              <Plus size={18} className="min-w-5 h-auto" />
              <p>Add an expense category</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
