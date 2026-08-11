import { FilterField } from "@/features/accounts/types/types";
import { Filter, X } from "lucide-react";

interface FilterProps {
  open: boolean;
  onClose: () => void;
  fields: FilterField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onApply: () => void;
  onClear: () => void;
}

export default function FilterModal({open, onClose, fields, values, onChange, onApply, onClear}: FilterProps) {
  console.log(fields);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center w-full h-full">
      {/* Card */}
      <div className="flex flex-col w-100 xl:w-125 lg:w-115 h-fit bg-(--color-bg-secondary) border border-(--color-border-default) rounded-xl shadow-xl ">
        {/* Header */}
        <div className="flex items-center border-b border-(--color-border-default) mb-0 w-full h-fit justify-between px-5 py-2">
          <Filter size={15} />
          <p className="text-[1rem] font-display">Filter</p>
          <X size={15} onClick={onClose} className="cursor-pointer" />
        </div>

        {/* Content */}
        <div className="flex flex-col w-full h-full px-5 py-2">
          {fields.map((field) => (
            <div key={field.key} className="flex flex-col w-full h-full">
              <label className="text-[0.85rem] text-(--color-text-primary) mb-1">
                {field.label}
              </label>

              <div className="flex flex-col w-full h-fit gap-2">
                {field.type === "select" && (
                  <select
                    className="w-full border border-(--color-border-default) rounded-xl px-5 py-1 text-[0.9rem] focus:outline-emerald-500 cursor-pointer mb-2"
                    value={values[field.key] ?? ""}
                    onChange={(e) => onChange(field.key, e.target.value)}
                  >
                    <option
                      value={""}
                      className="text-[0.9rem] text-(--color-text-primary)"
                    >
                      Any
                    </option>
                  </select>
                )}
              </div>

              <div className="flex flex-col w-full h-full">
                {field.type === "date" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      className="border border-(--color-border-default) rounded-lg px-2 py-1 flex-1 text-[0.9rem]"
                      value={values[`${field.key}From`] ?? ""}
                      onChange={(e) =>
                        onChange(`${field.key}From`, e.target.value)
                      }
                    />
                    <span className="text-[0.9rem]">-</span>
                    <input
                      type="date"
                      className="border border-(--color-border-default) rounded-lg px-2 py-1 flex-1 text-[0.9rem]"
                      value={values[`${field.key}To`] ?? ""}
                      onChange={(e) =>
                        onChange(`${field.key}To`, e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Footer buttons */}
          <div className="flex w-full h-fit items-center justify-between mt-5">
            <button
              onClick={onClear}
              className="flex cursor-pointer text-[0.9rem] bg-transparent border border-(--color-border-default) px-3 py-2 gap-5 rounded-xl hover:bg-(--color-brand-green) active:bg-emerald-600 "
            >
              Clear
            </button>

            <button
              onClick={onApply}
              className="flex cursor-pointer text-[0.9rem] bg-(--color-brand-green) px-3 py-2 rounded-xl w-fit h-fit hover:bg-emerald-600 active:bg-emerald-700 transition-all duration-100"
            >
              Apply changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}