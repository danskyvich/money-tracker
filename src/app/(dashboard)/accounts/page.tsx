"use client";

import Card from "@/components/ui/Card";
import { accountCategories, accounts } from "@/lib/mocks/mockAccounts";
import {
  ArrowBigDown,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Banknote,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  DollarSign,
  File,
  ListFilter,
  PencilIcon,
  Plus,
  Search,
  Wallet2Icon,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Accounts({}: {}) {

  useEffect(() => {
    document.title = "Your accounts";
  }, []);

  const pagination = [1, 2, 3];

  //date
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  //static categories
  const [categories, setCategories] = useState(accountCategories);

  //for UI changes
  const [filter, setFilter] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("Filter");
  const [isCategoryAccountOpen, setIsCategoryAccountOpen] = useState(false);

  //for UI states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleEditCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setEditedCategoryName(categoryName);
    setIsCategoryAccountOpen(true);
  };

  const handleSaveCategory = () => {
    if (selectedCategory) {
      const updatedCategories = categories.map((cat) =>
        cat === selectedCategory ? editedCategoryName : cat,
      );
      setCategories(updatedCategories);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsCategoryAccountOpen(false);
    setSelectedCategory(null);
    setEditedCategoryName("");
  };

  const handleFilterTypeChoice = (item: string) => {
    setSelectedType(item);
    setFilter(false);
  };

  return (
    <div className="flex flex-col w-full h-full gap-5">

      <div className="flex w-full items-center">
        <p className="text-3xl font-semibold">Accounts</p>

        <div className="flex w-auto flex-auto"/>

        <div className="flex w-fit h-fit ring ring-inset ring-(--color-brand-green) hover:bg-(--color-brand-green) transition-all duration-100 rounded-lg items-center text-[0.8rem] gap-1 px-5 py-1 cursor-pointer">
          <File size={15}/>
          <p>Export report</p>
        </div>
      </div>

      <div className="flex min-[1550px]:flex-row flex-col w-full h-full gap-5">
        {/* Accounts */}
        <div
          className="flex flex-col w-full h-full flex-2 border border-(--color-border-default) rounded-lg shadow-md"
        >
          {/** Top Bar */}
          <div className="flex w-full px-5 py-2 gap-2">
            <div className="flex w-fit h-full border border-(--color-brand-green) rounded-md px-5 items-center gap-2 bg-transparent text-(--color-text-primary) hover:text-white hover:bg-emerald-600 cursor-pointer transition-all duration-200 active:bg-emerald-700">
              <Plus size={15} />
              <p className="text-[0.8rem] hidden lg:block">Add an account</p>
            </div>

            {/* Filter by */}
            <div className="relative flex flex-col">
              <div
                className={`flex w-fit h-full items-center border border-(--color-border-default) ${filter ? "rounded-t-lg rounded-tr-lg" : "rounded-lg"} px-5 py-1 gap-2 cursor-pointer hover:bg-(--color-bg-subtle) transition-all duration-100`}
                onClick={() => setFilter((prev) => !prev)}
              >
                <ListFilter size={15} className="flex" />
                <p className="text-[0.8rem] hidden lg:block">{selectedType}</p>
                {filter ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </div>

              {filter && (
                <div className="absolute w-full z-50 top-[2.3rem] bg-(--color-bg-secondary) border border-(--color-border-default) rounded-b-lg rounded-bl-lg">
                  {accountCategories.map((item, index) => (
                    <div
                      className="flex w-full flex-col text-[0.8rem] py-2 hover:bg-(--color-bg-subtle) px-5 cursor-pointer"
                      onClick={() => handleFilterTypeChoice(item)}
                      key={index}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date range */}
            <div className="flex w-fit h-full items-center border border-(--color-border-default) rounded-md px-3 py-1 cursor-pointer hover:bg-(--color-bg-subtle) gap-2 transition-all duration-100">
              <Calendar size={15} />
              <p className="font-display text-[0.8rem] hidden lg:block text-(--color-text-primary)">
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
          <div className="overflow-auto flex-auto w-full h-full">
            <div className="grid grid-cols-[100px_100px_100px_100px] lg:grid-cols-[200px_200px_1fr_1fr] xl:grid-cols-[300px_1fr_1fr_1fr] border-b border-(--color-border-default) gap-4 font-mono text-[0.9rem] text-(--color-text-primary) py-2 px-5 pt-1 font-display w-full">
              <div>Name</div>
              <div>Type</div>
              <div>Amount</div>
              <div>Description</div>
            </div>

            {accounts.map((account, index) => (
              <div
                className="grid grid-cols-[100px_100px_100px_100px] lg:grid-cols-[200px_200px_1fr_1fr] xl:grid-cols-[300px_1fr_1fr_1fr] gap-4 px-5 py-2 border-b border-(--color-border-subtle) text-[0.9rem] hover:bg-(--color-bg-subtle) cursor-pointer"
                key={index}
              >
                <div className="text-(--color-text-secondary)">
                  {account.name}
                </div>
                <div className="text-(--color-text-secondary)">
                  {account.type}
                </div>
                <div className="font-mono">{account.amount}</div>
                <div className="text-(--color-text-secondary) whitespace-nowrap">
                  {account.description === null ? "-" : account.description}
                </div>
              </div>
            ))}
          </div>

          <div className="flex h-full w-full flex-1 px-5 py-2">
            <div className="flex w-full text-[0.9rem] text-(--color-text-secondary) items-center gap-2">
              <p>Show data</p>
              <div className="flex py-2 px-3 border border-(--color-border-default) rounded-md">
                <p>10</p>
              </div>
              <p>of 200</p>
            </div>

            <div className="flex flex-auto w-auto" />

            <div className="flex w-fit h-full gap-2">
              {pagination.map((item) => (
                <div
                  className={`border border-(--color-border-default) rounded-lg px-3 py-2 hover:cursor-pointer ${currentPage === item ? "bg-(--color-border-strong) text-white" : null}`}
                >
                  <p>{item}</p>
                </div>
              ))}

              <div className="flex w-fit px-3 py-2 font display items-center border border-(--color-border-default) rounded-lg hover:cursor-pointer hover:bg-(--color-border-subtle)">
                <p>Next</p>
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col w-full h-full">
              {/* Account categories */}
        <Card
          header="Categories"
          subheader="View all account categories"
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

        <div className="flex flex-2 flex-col w-full h-full">

        </div>
        </div>
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
