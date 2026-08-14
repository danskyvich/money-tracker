import {
  FilterOptions,
} from "@/features/accounts/types/types";
import { Filter, X } from "lucide-react";

interface FilterModalProps {
  open: boolean;
  onOpen: () => void;
  onConfirm: () => void;
  fields: any[];
}

export default function FilterModal({
  open,
  onOpen,
  onConfirm,
  fields,
}: FilterModalProps) {
  const activeFilters: string[] = [];

  if (!open) return null;
  return (
    <div className="fixed w-full h-full flex z-50 inset-0 bg-black/50 items-center justify-center">
      <div className="flex flex-col border border-(--color-border-default) bg-(--color-bg-secondary) w-115 xl:w-125 min-w-fit rounded-lg shadow-md p-5">
        {/* header */}
        <div className="flex w-full h-fit items-center justify-between">
          <Filter size={20} className="min-w-5 h-auto" />
          <p className="text-xl font-semibold font-sans">Filter</p>
          <X size={20} className="cursor-pointer" onClick={onOpen} />
        </div>

        {/* Content */}
        <div className="flex w-full flex-col h-fit my-5">
          <div className="grid grid-cols-[25%_1fr] gap-x-5 gap-y-3 w-full h-full items-center justify-center">
            {fields.map((item) => {
              const { key, label, type, options } = item;

              if (type === "select") {
                <>
                  <label htmlFor={key} className="text-[0.9rem]">
                    {label}
                  </label>
                  <select
                    id={key}
                    name={key}
                    className={`${options.length === 0 ? "hidden" : "block"} flex border border-(--color-border-default) hover:bg-(--color-border-subtle) `}
                  >
                    {options.map((opt: FilterOptions) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </>;
              }

              if (type === "text") {
                <>
                  <label htmlFor={key} className="text-[0.9rem]">Balance</label>
                  <input type="text" id={key} className="flex w-full border border-(--color-border-default) rounded-lg"/>
                </>
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
