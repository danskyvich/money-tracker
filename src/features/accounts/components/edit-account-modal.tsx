import Spinner from "@/components/layout/spinner";
import { FetchAccountCategories, FetchAccounts, UpdateAccount } from "@/lib/supabase/actions/database";
import { AccountCategories } from "@/lib/types/derived";
import { X } from "lucide-react";
import { useEffect, useReducer, useState } from "react";
import EditAccountModalSkeleton from "./skeleton/account-edit-accounts-modal-skeleton";
import ErrorModal from "@/components/layout/error-modal";

interface EditAccountModalProps {
  icon: React.ReactNode;
  onOpen: (value: boolean) => void;
  onCancel: () => void;
  chosenAccount: any | null;
}

export default function EditAccountModal({
  icon,
  onCancel,
  chosenAccount,
}: EditAccountModalProps) {
  const [accountDetailsError, setAccountDetailsError] = useState<string | null>(
    null,
  );
  const [accountCategories, setAccountCategories] = useState<
    AccountCategories[] | null
  >(null);

  // modals
  const [loading, setLoading] = useState<boolean>(false);
  const [process, setProcess] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);

    const result = await FetchAccountCategories();
    if (!result.success) {
      setAccountDetailsError(result.error);
      setLoading(false);
      return;
    }
    setAccountCategories(result.data);
    console.log(accountCategories);
    setLoading(false);
    return;
  };

  useEffect(() => {
    fetchData();
  }, []);

  //handle account change
  interface AccountsPayload {
    name: string;
    description: string;
    category: string;
  }

  //set initial values
  const initialValues: AccountsPayload = {
    name: chosenAccount?.name,
    category: chosenAccount?.category_id?.id,
    description:
      chosenAccount?.description === "" ? "-" : chosenAccount?.description,
  };

  const [formValues, setFormValues] = useReducer(
    (currentValues, nextValues) => ({ ...currentValues, ...nextValues }),
    initialValues,
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormValues({ [name]: value });
  };

  // update account
  const handleUpdateAccountChanges = async () => {
    setProcess(true);

    try {
      const payload = {
        id: chosenAccount?.id,
        name: formValues?.name,
        description: formValues?.description === "" ? "-" : formValues?.description,
        category_id: formValues.category,
      };
      if (
        !payload.id ||
        !payload.name ||
        !payload.category_id
      ) {
        setAccountDetailsError("Missing fields");
        setProcess(false);
        return;
      }

      const result = await UpdateAccount(chosenAccount.id, payload);
      if (!result.success) {
        setAccountDetailsError(result.error);
        setLoading(false);
        return;
      }
    } catch (err) {
      setAccountDetailsError("Something went wrong.");
    } finally {
      setProcess(false);
      onCancel();
      return;
    }
  };

  return (
    <div className="flex flex-col w-100 mx-5 sm:mx-0 sm:w-110 md:w-125 lg:w-140 xl:w-160 border border-(--color-border-default) rounded-lg bg-(--color-bg-secondary) justify-between p-5">
      {accountDetailsError && <ErrorModal message={accountDetailsError} />}
      {loading ? (
        <EditAccountModalSkeleton />
      ) : (
        <>
          {/* Header */}
          <div className="flex w-full h-fit items-center justify-between mb-3">
            {icon}
            <p className="font-semibold text-xl">Edit account details</p>
            <X
              size={15}
              className="cursor-pointer"
              onClick={() => onCancel()}
            />
          </div>

          {/* Content */}
          <div className="grid grid-cols-[repeat(2,1fr)] gap-y-2 text-[0.9rem] my-2">
            <label htmlFor="name" className="flex items-center">
              Name
            </label>
            <input
              id="name"
              name="name"
              className="flex border border-(--color-border-strong) w-full h-fit py-1 px-3 rounded-lg"
              value={formValues?.name}
              onChange={handleChange}
            />
            <label htmlFor="category_id" className="flex items-center">
              Category
            </label>
            <select
              className="flex border border-(--color-border-strong) w-full h-fit py-1 px-3 rounded-lg"
              id="category_id"
              name="category"
              onChange={handleChange}
              value={formValues.category ?? ""}
            >
              {accountCategories?.map((item, id) => (
                <option
                  key={id}
                  value={item.id}
                  className="bg-(--color-bg-secondary) text-(--color-text-primary)"
                >
                  {item.name}
                </option>
              ))}
            </select>
            <label htmlFor="description" className="flex items-center">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="flex w-full h-full border border-(--color-border-strong) rounded-lg px-3 py-1"
              value={formValues.description ?? ""}
              onChange={handleChange}
            />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-[1fr_1fr] gap-x-3 mt-3 w-full h-fit">
            <button
              className="flex w-full border border-(--color-border-default) rounded-lg hover:bg-(--color-brand-green) active:bg-emerald-600 items-center justify-center py-1 text-[0.9rem] cursor-pointer transition-all duration-100"
              onClick={() => onCancel()}
            >
              <p>No, go back</p>
            </button>
            <button
              className={`${process && "bg-slate-500 hover:bg-slate-500 active:bg-slate-500"} flex w-full rounded-lg bg-(--color-brand-green) hover:bg-emerald-600 active:bg-emerald-700 items-center justify-center py-1 text-[0.9rem] cursor-pointer transition-all duration-100`}
              onClick={handleUpdateAccountChanges}
              disabled={process}
            >
              {process ? <Spinner /> : <p>Save changes</p>}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
