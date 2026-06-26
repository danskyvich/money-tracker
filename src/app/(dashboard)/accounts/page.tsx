"use client";

import Card from "@/components/ui/Card";
import { accountCategories, accounts } from "@/lib/mocks/mockAccounts";
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  File,
  ListFilter,
  Pencil,
  PiggyBank,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Accounts({}: {}) {

  useEffect(() => {
    document.title = "Your accounts";
  }, []);

  const pagination = [1, 2, 3];

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

  // for seeing transactions of that specific account
  const [seeAccountTransactions, setSeeAccountTransactions] = useState(false);
  const [chosenAccount, setChosenAccount] = useState('');

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
      {
        seeAccountTransactions && (
          <div className="fixed inset-0 z-50 w-full h-full bg-black/50">
            <div className="flex flex-col transform:translate(-50%, -50%) w-50 md:w-150 w-full border border-(--color-border-default) bg-(--color-bg-secondary) rounded-lg shadow-lg p-5">
              <div className="flex w-full justify-between items-center">
                <PiggyBank size={20}/>
                <p className="text-xl font-semibold">{chosenAccount}</p>
                <X size={20} onClick={() => setSeeAccountTransactions(false)} className="cursor-pointer"/>
              </div>

              <div className="">
              </div>
            </div>
          </div>
        )
      }
      <div className="flex w-full items-center">
        <p className="text-3xl font-semibold">Accounts</p>

        <div className="flex w-auto flex-auto" />

        <div className="flex w-fit h-fit ring ring-inset ring-(--color-brand-green) hover:bg-(--color-brand-green) transition-all duration-100 rounded-lg items-center text-[0.8rem] gap-1 px-5 py-1 cursor-pointer">
          <File size={15} />
          <p>Export report</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col xl:flex-row w-full h-full gap-5">
        {/* Accounts */}
        <div className="flex flex-col w-full h-auto justify-between flex-2 border border-(--color-border-default) rounded-lg shadow-md">
          {/** Transaction headers */}
          <div className="overflow-auto flex-auto w-full h-full">
            {/** Top Bar */}
            <div className="flex flex-1 w-full h-fit px-5 py-2 gap-2 whitespace-nowrap">
              <div className="flex w-fit h-full border border-(--color-brand-green) rounded-md px-5 py-1 items-center gap-2 bg-transparent text-(--color-text-primary) hover:text-white hover:bg-emerald-600 cursor-pointer transition-all duration-200 active:bg-emerald-700">
                <Plus size={15} />
                <p className="text-[0.8rem] hidden lg:block">Add an account</p>
              </div>

              {/* Filter by */}
              <div className="relative flex flex-col">
                <div
                  className={`flex w-fit items-center border border-(--color-border-default) ${filter ? "rounded-t-lg rounded-tr-lg" : "rounded-lg"} px-5 py-1 gap-2 cursor-pointer hover:bg-(--color-bg-subtle) transition-all duration-100`}
                  onClick={() => setFilter((prev) => !prev)}
                >
                  <ListFilter size={15} className="flex" />
                  <p className="text-[0.8rem] hidden lg:block">
                    {selectedType}
                  </p>
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
              <div className="flex w-fit h-full items-center border border-(--color-border-default) rounded-md px-5 py-1 cursor-pointer hover:bg-(--color-bg-subtle) gap-2 transition-all duration-100">
                <Calendar size={15} />
                <p className="font-display text-[0.8rem] hidden lg:block text-(--color-text-primary)">
                  Date range
                </p>
                <ChevronDown size={15} />
              </div>

              {/* Search field */}
              <div className="px-5 flex w-75 border border-(--color-border-default) rounded-md items-center gap-2">
                <Search size={15} className="flex" />
                <input
                  placeholder="Search..."
                  className="flex flex-3 decorations-none placeholder:text-[0.8rem] focus:outline-none focus:ring-0 focus:border-transparent text-[0.8rem]"
                />
              </div>
            </div>
            <div className="h-auto grid grid-cols-[100px_100px_100px_100px] lg:grid-cols-[200px_200px_1fr_1fr] xl:grid-cols-[300px_1fr_1fr_1fr] border-b border-(--color-border-default) gap-4 font-mono text-[0.9rem] text-(--color-text-primary) py-2 px-5 pt-1 font-display w-full">
              <div>Name</div>
              <div>Type</div>
              <div>Amount</div>
              <div>Description</div>
            </div>

            {accounts.map((account, index) => (
              <div
                className="flex-col md:grid md:grid-cols-[100px_100px_100px_100px] lg:grid-cols-[200px_200px_1fr_1fr] xl:grid-cols-[300px_1fr_1fr_1fr] gap-4 px-5 py-2 border-b border-(--color-border-subtle) text-[0.9rem] hover:bg-(--color-bg-subtle) cursor-pointer"
                key={index}
                onClick={() => {setSeeAccountTransactions(prev => !prev); setChosenAccount(account.name)}}
              >
                <div className="text-(--color-text-secondary)">
                  {account.name}
                </div>
                <div className="text-(--color-text-secondary)">
                  {account.type}
                </div>
                <div className="font-mono">
                  <span className="text-[0.8rem] mr-1">₱</span>
                  {account.amount}
                </div>
                <div className="text-(--color-text-secondary) whitespace-nowrap">
                  {account.description === null ? "-" : account.description}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex h-fit w-full px-5 py-2">
            <div className="flex w-full text-[0.9rem] text-(--color-text-secondary) items-center gap-2">
              <p>Show data</p>
              <div className="flex py-2 px-3 border border-(--color-border-default) rounded-md">
                <p>10</p>
              </div>
              <p>of 200</p>
            </div>

            <div className="flex flex-auto w-auto" />

            <div className="flex w-fit h-full gap-2">
              {pagination.map((item, index) => (
                <div
                  className={`border border-(--color-border-default) rounded-lg px-3 py-2 hover:cursor-pointer ${currentPage === item ? "bg-(--color-border-strong) text-white" : null}`}
                  key={index}
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

        {/* Account categories */}
        <div
          className="flex flex-1 flex-col w-full h-200px border border-(--color-border-default) rounded-lg shadow-md"
        >
          <p className="text-xl font-semibold px-5 py-3">Categories</p>
          <div className="overflow-auto">
            {accountCategories.map((item, index) => (
              <div
                className="flex w-full px-5 py-2 cursor-pointer items-center hover:bg-(--color-bg-subtle) border-b border-(--color-border-subtle) px-5 py-1 text-[0.9rem]"
                key={index}
              >
                <p>{item}</p>
                <div className="flex flex-auto w-full" />
                <Pencil size={15} />
              </div>
            ))}
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
