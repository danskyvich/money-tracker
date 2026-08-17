import ErrorModal from "@/components/layout/error-modal";
import Modal from "@/components/layout/modal";
import Spinner from "@/components/layout/spinner";
import { AddIncomeCategory, DeleteIncomeCategory, FetchIncomeCategories } from "@/lib/supabase/actions/database";
import { Categories } from "@/lib/types/derived";
import { Coins, Pencil, Plus, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";

interface IncomeCategoriesProps {
    open: boolean;
    onOpen: () => void;
}

export function IncomeCategories({open, onOpen}: IncomeCategoriesProps) {

    const [fetchError, setFetchError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [process, setProcess] = useState<boolean>(false);
    const [incomeCategoriesData, setIncomeCategoriesData] = useState<Categories[] | undefined>(undefined);
    const [toggle, setToggle] = useState<string | null>(null);

    // for db modification
    const [name, setName] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);

    const fetchIncomeCategories = async () => {
        setLoading(true);

        const result = await FetchIncomeCategories();
        if (!result.success) {
            setFetchError(result?.error ?? "Fetching income categories failed.");
            setLoading(false);
            return;
        }
        setIncomeCategoriesData(result?.data);
        setLoading(false);
        return;
    }

    // for adding and moifying categories
    const handleAddUpdateIncomeCategory = async () => {
        const trimmedName = name?.trim();

        if (!trimmedName) {
          setFetchError("Field empty");
          return;
        }

        setFetchError(null);
        setProcess(true);

        const result = id
          ? await AddIncomeCategory(trimmedName, id)
          : await AddIncomeCategory(trimmedName);

        if (!result.success) {
            setFetchError(result.error);
            setProcess(false);
            return;
        }
        setProcess(false)
        setName("");
        setId(null);
        fetchIncomeCategories();
        onOpen();
    }

    // for deleting categories
    const handleDeleteIncomeCategory = async () => {
        if (!id) {
            setFetchError("No fetched category");
            return;
        }

        setFetchError(null);
        setProcess(true);

        const result = await DeleteIncomeCategory(id);
        if (!result.success) {
            setFetchError(result.error);
            setProcess(false);
            return;
        }

        setProcess(false);
        setName("");
        setId(null);
        fetchIncomeCategories();
        onOpen();
    }

    useEffect(() => {
        fetchIncomeCategories();
    }, []);

    if (!open) return null;
    return (
      <>
        {toggle === "name-category" && (
          <div className="flex w-full h-full inset-0 z-50 fixed items-center justify-center bg-black/50">
            <Modal
              open
              onOpen={() => setToggle(null)}
              loading={process}
              header="Name the income category"
              icon={<Coins size={18} className="min-w-3 h-auto" />}
              onConfirm={handleAddUpdateIncomeCategory}
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
                placeholder="eg. Savings"
                className="flex w-full p-3 py-1 border border-(--color-border-default) rounded-lg focus:outline focus:outline-(--color-border-strong)"
              />
            </Modal>
          </div>
        )}
        {toggle === "delete-category" && (
          <div className="flex w-full h-full inset-0 z-50 fixed items-center justify-center bg-black/50">
            <Modal
              open
              onOpen={() => setToggle(null)}
              loading={process}
              header="Delete the category"
              icon={<Trash size={18} className="min-w-3 h-auto" />}
              onConfirm={handleDeleteIncomeCategory}
              noButtonText="Return"
              yesButtonText="Delete category"
              message={`Do you want to delete the category "${name}"?`}
              onCancel={() => setToggle(null)}
            />
          </div>
        )}
        <div className="flex flex-col w-100 xl:w-125 h-100 bg-(--color-bg-secondary) border border-(--color-border-default) rounded-lg">
          {fetchError && <ErrorModal message={fetchError} />}
          {/* header */}
          <div className="flex flex-0 w-full h-fit justify-between px-5 pt-5 pb-2">
            <Coins size={20} className="min-w-5" />
            <p className="text-xl font-semibold">Income categories</p>
            <X onClick={() => onOpen()} className="cursor-pointer" />
          </div>

          {/* content */}
          <div className="flex flex-2 flex-col w-full h-full overflow-y-auto">
            {loading && (
              <div className="flex w-full h-full items-center justify-center">
                <Spinner />
              </div>
            )}
            {loading ? (
              <div className=""></div>
            ) : (
              <>
                {incomeCategoriesData?.map((item, id) => (
                  <div
                    className="flex w-full h-full border-y border-(--color-border-subtle) px-5 py-3 items-center justify-between"
                    key={id}
                  >
                    <p className="text-[0.9rem] ">{item.name}</p>
                    <div className="flex w-fit h-fit gap-2">
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
                          setId(item.id);
                          setName(item.name);
                          setToggle("delete-category");
                        }}
                      />
                    </div>
                  </div>
                ))}
                {incomeCategoriesData?.length === 0 && (
                  <div className="flex w-full h-full items-center font-mono justify-center text-[0.9rem]">
                    <p>You don't have any income categories</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-0 w-full h-fit px-5 py-3">
            <div
              className="flex w-full border border-(--color-border-default) rounded-lg py-1 items-center justify-center gap-1 text-[0.9rem] hover:bg-(--color-brand-green) active:bg-emerald-700 transition-all duration-100 cursor-pointer"
              onClick={() => setToggle("name-category")}
            >
              {process ? (
                <Spinner />
              ) : (
                <>
                  <Plus size={18} className="min-w-5 h-auto" />
                  <p>Add an income category</p>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
}