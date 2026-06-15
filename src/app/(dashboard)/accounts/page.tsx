'use client'

import Card from "@/components/ui/Card";
import { accountCategories, accounts } from "@/lib/mocks/mockAccounts";
import { ArrowBigDown, ArrowDown, ArrowUp, ArrowUpDown, Banknote, Calendar, Calendar1, Check, ChevronDown, ChevronUp, DollarSign, ListFilter, PencilIcon, Plus, Search, Wallet2Icon, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Accounts({}: {}) {

    useEffect(() => {
        document.title = "Your accounts"
    })

    //date
    const currentMonth = (new Date).toLocaleString('default', {month: "long"});

    //static categories
    const [categories, setCategories] = useState(accountCategories);

    //for UI changes
    const [filter, setFilter] = useState(false);
    const [filterList, setFilterList] = useState(false)
    const [isCategoryAccountOpen, setIsCategoryAccountOpen] = useState(false);

    //for UI states
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [editedCategoryName, setEditedCategoryName] = useState("");

    const handleEditCategory = (categoryName: string) => {
      setSelectedCategory(categoryName);
      setEditedCategoryName(categoryName);
      setIsCategoryAccountOpen(true);
    }

    const handleSaveCategory = () => {
      if (selectedCategory) {
        const updatedCategories = categories.map((cat) => cat === selectedCategory ? editedCategoryName: cat);
        setCategories(updatedCategories);
      };
      handleCloseModal();
    }

    const handleCloseModal = () => {
      setIsCategoryAccountOpen(false)
      setSelectedCategory(null);
      setEditedCategoryName("");
    }

  return (
    <div className="flex flex-col w-full h-full gap-5">
      {/* Account summary */}
      <div className="flex w-full flex-1 gap-5">
        {/* Total assets */}
        <div className="flex flex-1 w-fit h-full border border-(--color-border-default) rounded-xl shadow-md px-5 py-2 items-center gap-3">
          <div className="flex rounded-[50%] w-fit h-fit p-2 bg-transparent border-2 border-(--color-brand-gold) ">
            <Banknote size={30} className="text-(--color-brand-gold)" />
          </div>

          <div className="flex flex-col w-full h-full justify-center">
            <p className="whitespace-nowrap text-[0.9rem] text-(--color-text-secondary)">
              Total assets:
            </p>
            <p className="text-[1.2rem] font-mono">5,314.00</p>
          </div>
        </div>
        {/* Total liabilities */}
        <div className="flex flex-1 w-fit h-full border border-(--color-border-default) rounded-xl shadow-md px-5 py-2 items-center gap-3">
          <div className="flex rounded-[50%] w-fit h-fit p-2 bg-transparent border border-(--color-brand-gold) ">
            <Wallet2Icon size={30} className="text-(--color-brand-gold)" />
          </div>

          <div className="flex flex-col w-full h-full justify-center">
            <p className="whitespace-nowrap text-[0.9rem] text-(--color-text-secondary)">
              Total liabilities:
            </p>
            <p className="text-[1.2rem] font-mono">234.00</p>
          </div>
        </div>
        {/* Assets - liabilities = total */}
        <div className="flex flex-1 w-fit h-full border border-(--color-border-default) rounded-xl shadow-md px-5 py-2 items-center gap-3">
          <div className="flex rounded-[50%] w-fit h-fit p-2 bg-transparent border border-(--color-brand-gold) ">
            <DollarSign size={30} className="text-(--color-brand-gold)" />
          </div>

          <div className="flex flex-col w-full h-full justify-center">
            <p className="whitespace-nowrap text-[0.9rem] text-(--color-text-secondary)">
              In total:
            </p>
            <p className="text-[1.2rem] font-mono">80.00</p>
          </div>
        </div>

        {/* Money inflow for current month */}
        <div className="flex flex-1 w-fit h-full border border-(--color-border-default) rounded-xl shadow-md px-5 py-2 items-center gap-3">
          <div className="flex rounded-[50%] w-fit h-fit p-2 bg-transparent border border-(--color-brand-green) ">
            <ArrowDown size={30} className="text-(--color-brand-green)" />
          </div>

          <div className="flex flex-col w-full h-full justify-center">
            <p className="whitespace-nowrap text-[0.9rem] text-(--color-text-secondary)">
              Money inflow ({currentMonth})
            </p>
            <p className="text-[1.2rem] font-mono">1,000.00</p>
          </div>
        </div>

        {/* Money inflow for current month */}
        <div className="flex flex-1 w-fit h-full border border-(--color-border-default) rounded-xl shadow-md px-5 py-2 items-center gap-3">
          <div className="flex rounded-[50%] w-fit h-fit p-2 bg-transparent border border-(--color-brand-green) ">
            <ArrowUp size={30} className="text-(--color-brand-green)" />
          </div>

          <div className="flex flex-col w-full h-full justify-center">
            <p className="whitespace-nowrap text-[0.9rem] text-(--color-text-secondary)">
              Money outflow ({currentMonth})
            </p>
            <p className="text-[1.2rem] font-mono">250.00</p>
          </div>
        </div>

        {/* Money difference */}
        <div className="flex flex-1 w-fit h-full border border-(--color-border-default) rounded-xl shadow-md px-5 py-2 items-center gap-3">
          <div className="flex rounded-[50%] w-fit h-fit p-2 bg-transparent border border-(--color-brand-green) ">
            <ArrowUpDown size={30} className="text-(--color-brand-green)" />
          </div>

          <div className="flex flex-col w-full h-full justify-center">
            <p className="whitespace-nowrap text-[0.9rem] text-(--color-text-secondary)">
              Monthly flow difference ({currentMonth})
            </p>
            <p className="text-[1.2rem] font-mono">750.00</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full h-full gap-5 lg:flex-row">
        {/* Account table */}
        <Card
          className="flex flex-1 flex-col w-full h-full flex-3"
          header="Accounts"
        >
          <div className="flex w-full px-5 py-2 border-b border-(--color-border-subtle) gap-2">
            <div className="flex w-fit h-full border border-(--color-brand-green-accent) rounded-md px-5 py-2 items-center gap-2 bg-transparent text-(--color-text-primary) hover:text-white hover:bg-emerald-600 cursor-pointer transition-all duration-200 active:bg-emerald-700">
              <Plus size={15} />
              <p className="text-[0.8rem]">Add an account</p>
            </div>

            {/* Filter by */}
            <div
              className="flex w-fit h-full items-center border border-(--color-border-default) rounded-lg px-3 py-1 gap-2 cursor-pointer hover:bg-(--color-bg-subtle) transition-all duration-100"
              onClick={() => setFilter((prev) => !prev)}
            >
              <ListFilter size={15} className="flex" />
              <p className="text-[0.8rem] text-(--color-text-primary)">
                Filter
              </p>
              {filter ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>

            {/* Date range */}
            <div className="flex w-fit h-full items-center border border-(--color-border-default) rounded-md px-3 py-1 cursor-pointer hover:bg-(--color-bg-subtle) gap-2 transition-all duration-100">
              <Calendar size={15} />
              <p className="font-display text-[0.8rem] text-(--color-text-primary)">
                Date range
              </p>
              <ChevronDown size={15} />
            </div>

            {/* Search field */}
            <div className="px-3 py-1 flex w-75 h-full border border-(--color-border-default) rounded-md items-center gap-2">
              <Search size={15} className="flex" />
              <input
                placeholder="Search..."
                className="flex flex-3 decorations-none placeholder:text-[0.8rem] focus:outline-none focus:ring-0 focus:border-transparent text-[0.8rem]"
              />
            </div>
          </div>

          {/** Transaction headers */}
          <div className="overflow-auto flex-auto h-full">
            <div className="grid grid-cols-[200px_200px_1fr_200px_200px] gap-4 font-mono text-[0.9rem] text-(--color-text-secondary) py-2 px-5 pt-1 font-display w-full">
              <div>Name</div>
              <div>Type</div>
              <div>Amount</div>
              <div>Description</div>
            </div>

            {accounts.map((account, index) => (
              <div
                className="grid grid-cols-[200px_200px_1fr_200px_200px] gap-4 px-5 py-2 border-b border-(--color-border-subtle) text-[0.9rem] hover:bg-(--color-bg-subtle) cursor-pointer"
                key={index}
              >
                <div className="text-(--color-text-secondary)">
                  {account.name}
                </div>
                <div className="text-(--color-text-secondary)">
                  {account.type}
                </div>
                <div className="font-mono">{account.amount}</div>
                <div className="text-(--color-text-secondary)">
                  {account.description === null ? "-" : account.description}
                </div>
              </div>
            ))}
          </div>

          <div className="flex h-full w-full flex-1 px-5 py-2">
            <div className="flex w-full text-[0.9rem] text-(--color-text-secondary) items-center gap-2">
              <p>Show data</p>
              <div className="flex py-2 px-3 border border-(--color-border-default) rounded-md shadow-sm">
                <p>10</p>
              </div>
              <p>of 200</p>
            </div>

            <div className="flex flex-auto w-auto" />
          </div>
        </Card>

        {/* Account categories */}
        <Card
          header="Account types"
          className="flex flex-col flex-1 h-full w-full"
        >
          {/* List account types */}
          <div className="flex flex-col flex-3 h-auto">
            {accountCategories.map((item, index) => (
              <div
                className="flex px-5 py-1 border-b border-(--color-border-subtle) text-(--color-primary) text-[0.9rem] cursor-pointer items-center"
                key={index}
              >
                {item}
                <div className="flex flex-auto w-auto h-full" />

                <div className="flex rounded-[50%] hover:bg-(--color-border-subtle) p-2">
                  <PencilIcon
                    size={15}
                    onClick={() => handleEditCategory(item)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add account type */}
          <div className="flex flex flex-0 w-full h-auto">
            <div className="flex w-full px-5 py-3 text-[0.9rem] text-(--color-text-primary) font-mono items-center border-t border-(--color-border-default) cursor-pointer hover:bg-(--color-bg-subtle) active:bg-(--color-border-subtle)">
              <p>Add account type</p>
              <div className="flex flex-auto w-auto h-fit" />
              <Plus size={15} />
            </div>
          </div>
        </Card>
      </div>

      {isCategoryAccountOpen && (
        <div className="fixed flex-col p-5 border border-(--color-border-default) rounded-lg z-50 top-[50%] left-[50%] bg-(--color-bg-secondary) shadow-md">
          <p className="mb-2">Edit details</p>
          <div className="flex w-full gap-2">
            {/* Input new category name */}
            <input
              value={editedCategoryName}
              onChange={(e) => setEditedCategoryName(e.target.value)}
              placeholder="Enter a new name..."
              className="flex border rounded-md border-(--color-border-default) px-5 py-1 placeholder:text-[0.9rem] text-[0.9rem] outline-none focus:border-(--color-border-strong)"
            />

            {/* Accept */}
            <div
              className="px-2 py-2 items-center justify-center rounded-[50%] border-2 border-(--color-brand-green) bg-transparent hover:bg-(--color-brand-green) cursor-pointer active:bg-emerald-700"
              onClick={() => handleSaveCategory()}
            >
              <Check size={15} className="text-(--color-text-primary)" />
            </div>

            {/* Cancel */}
            <div
              className="px-2 py-2 items-center justify-center rounded-[50%] border-2 border-(--color-brand-red) bg-transparent hover:bg-(--color-brand-red) cursor-pointer active:bg-red-900"
              onClick={() => handleCloseModal()}
            >
              <X size={15} className="text-(--color-text-primary)" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
