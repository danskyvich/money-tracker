"use client";

import { getCurrentDate, getCurrentTime } from "@/utils/getDateTime";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  TransactionData,
  TransactionSchema,
} from "@/utils/schemas/TransactionSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export function TransactionContent({
  transactionType,
}: {
  transactionType: string;
}) {
  

  // category dropdown
  const [chosenCategory, setChosenCategory] = useState();
  const [categoryDropdownClicked, setCategoryDropdownClicked] = useState(false);

  // account dropdown
  const [chosenAccount, setChosenAccount] = useState();
  const [accountDropdownClicked, setAccountDropdownClicked] = useState(false);

  // AccountFrom   & AccountTo
  const [chosenAccountFrom, setChosenAccountFrom] = useState();
  const [accountFromDropdown, setAccountFromDropdown] = useState(false);

  const [chosenAccountTo, setChosenAccountTo] = useState();
  const [accountToDropdown, setAccountToDropdown] = useState(false);

  // function to close dropdown of any field
  const handleCloseDropdown = <T,>(
    chosen: T,
    setChosenValueToBeDisplayed: React.Dispatch<React.SetStateAction<T>>,
    setDropdownToBeClosed: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setDropdownToBeClosed(false);
    setChosenValueToBeDisplayed(chosen);
  };

  // zod
  const {
    register,
    formState: { errors },
  } = useForm<TransactionData>({
    resolver: zodResolver(TransactionSchema),
    mode: "onChange",
  });

  return (
    <form className="grid grid-cols-[1fr_2fr] gap-y-2 w-full py-2 text-[0.9rem] items-center">
      {/* Date */}
      <p>Date</p>
      <div className="inline-flex w-full gap-5">
        <div className="border border-(--color-border-default) rounded-lg px-5 py-1 cursor-pointer hover:bg-(--color-bg-subtle) w-full">
          <p>{getCurrentDate()}</p>
        </div>
        <div className="border border-(--color-border-default) rounded-lg px-5 py-1 cursor-pointer hover:bg-(--color-bg-subtle) w-full">
          <p>{getCurrentTime()}</p>
        </div>
      </div>

      {/* Category */}
      <p>Category</p>
      <div
        className="inline-flex relative justify-between items-center border border-(--color-border-default) rounded-lg px-5 py-1 cursor-pointer hover:bg-(--color-bg-subtle)"
        onClick={() => setCategoryDropdownClicked((prev) => !prev)}
      >
        <p>{chosenCategory}</p>
        {categoryDropdownClicked ? (
          <ChevronUp size={15} />
        ) : (
          <ChevronDown size={15} />
        )}

        {/* Dropdown */}
        {categoryDropdownClicked && (
          <div className="flex flex-col top-10 right-17 z-50 absolute w-fit border border-(--color-border-subtle) bg-(--color-bg-base) rounded-lg shadow-md">
            
          </div>
        )}
      </div>

      {/* Account */}
      {transactionType !== "Transfer" ? (
        <>
          <p>Account</p>
          <div>
            <div
              className="flex relative border justify-between items-center border-(--color-border-default) rounded-lg text-[0.9rem] px-5 py-1 cursor-pointer hover:bg-(--color-bg-subtle)"
              onClick={() => setAccountDropdownClicked((prev) => !prev)}
            >
              <p>{chosenAccount}</p>
              {accountDropdownClicked ? (
                <ChevronUp size={15} />
              ) : (
                <ChevronDown size={15} />
              )}
            </div>

            {/* Dropdown */}
            {accountDropdownClicked && (
              <div className="flex flex-col mt-2 rounded-lg absolute border border-(--color-border-default) bg-(--color-bg-base)">
                
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <p>From</p>
          <div>
            <div
              className="flex border justify-between items-center border-(--color-border-default) rounded-lg text-[0.9rem] px-5 py-1 cursor-pointer hover:bg-(--color-bg-subtle)"
              onClick={() => setAccountFromDropdown((prev) => !prev)}
            >
              <p>{chosenAccountFrom}</p>
              <ChevronDown size={15} />
            </div>

            {/* Dropdown */}
            {accountFromDropdown && (
              <div className="flex flex-col mt-2 rounded-lg absolute border border-(--color-border-default) bg-(--color-bg-base)">
                
              </div>
            )}
          </div>

          <p>To</p>
          <div>
            <div
              className="flex border justify-between items-center border-(--color-border-default) rounded-lg text-[0.9rem] px-5 py-1 cursor-pointer hover:bg-(--color-bg-subtle)"
              onClick={() => setAccountToDropdown((prev) => !prev)}
            >
              <p>{chosenAccountTo}</p>
              <ChevronDown size={15} />
            </div>

            {/* Dropdown */}
            {accountToDropdown && (
              <div className="flex flex-col mt-2 rounded-lg absolute border border-(--color-border-default) bg-(--color-bg-base)">
                
              </div>
            )}
          </div>
        </>
      )}

      <p>Amount</p>
      <div>
        <input
          placeholder="0.00"
          className="focus:outline-none  border border-(--color-border-default) rounded-lg w-full px-5 py-1"
        />
      </div>

      <label htmlFor="note">Note</label>
      <div>
        <textarea
          id="note"
          rows={4}
          className="w-full border border-(--color-border-default) rounded-lg focus:outline-none resize-none px-5"
        ></textarea>
      </div>
    </form>
  );
}
