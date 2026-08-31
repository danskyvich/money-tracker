import ErrorModal from "@/components/layout/error-modal";
import Spinner from "@/components/layout/spinner";
import { DeleteTransaction } from "@/lib/supabase/actions/database";
import { Trash, X } from "lucide-react";
import { useState } from "react";

interface DeleteTransactionProps {
  open: boolean;
  onOpen: (value: boolean) => void;
  onCancel: () => void;
  refetch: () => void;
  id: string | undefined;
}

export default function DeleteTransactionModal({
  open,
  onOpen,
  onCancel,
  id,
  refetch,
}: DeleteTransactionProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [deletionError, setDeletionError] = useState<string | null>(null);

  // delete transaction
  const handleDeleteTransaction = async () => {
    setLoading(true);

    if (!id) {
      setDeletionError("Transaction not found");
      setLoading(false);
      return;
    }

    const result = await DeleteTransaction(id);
    if (!result.success) {
      setDeletionError(result.error);
      setLoading(false);
      return;
    }
    setLoading(false);
    onCancel();
    refetch();
    return;
  };

  if (!open) return null;
  return (
    <div className="flex flex-col w-100 mx-5 sm:mx-0 sm:w-110 md:w-125 lg:w-140 xl:w-160 border border-(--color-border-default) rounded-lg bg-(--color-bg-secondary) justify-between p-5">
      {deletionError && <ErrorModal message={deletionError} />}
      {/* Header */}
      <div className="flex w-full h-fit items-center justify-between mb-3">
        <Trash size={20} className="min-w-3 h-auto" />
        <p className="font-semibold text-xl">Delete transaction</p>
        <X
          size={15}
          className="cursor-pointer"
          onClick={() => {
            onOpen(false);
            onCancel();
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col w-full h-fit text-[0.9rem] font-display my-2 gap-2">
        <p>
          Are you sure you want to delete this transaction? This action is
          irreversible.
        </p>
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-x-3 mt-3 w-full h-fit">
        <button
          className={`whitespace-nowrap py-1 flex w-full items-center justify-center hover:text-white border border-(--color-brand-green) rounded-lg text-[0.9rem] hover:bg-(--color-brand-green) active:bg-emerald-600 cursor-pointer transition-all duration-100`}
          onClick={() => {
            onCancel();
          }}
        >
          <p>No</p>
        </button>

        <button
          className={`whitespace-nowrap text-white py-2 flex w-full items-center justify-center rounded-lg text-[0.9rem] bg-(--color-brand-green) hover:bg-emerald-600 active:bg-emerald-700 transition-all duration-100 cursor-pointer`}
          onClick={handleDeleteTransaction}
          disabled={loading}
        >
          {loading ? <Spinner /> : "Delete transaction"}
        </button>
      </div>
    </div>
  );
}
