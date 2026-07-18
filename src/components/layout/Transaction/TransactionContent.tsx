import { getCurrentDate, getCurrentTime } from "@/utils/getDateTime";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  TransactionData,
  TransactionSchema,
} from "@/utils/schemas/TransactionSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export function TransactionContent({
  transactionType,
  categoryData,
  accountsData,
  categoryError, 
  accountsError,
}: {
  transactionType: string;
  categoryData: any[] | null;
  accountsData: any[] | null;
  categoryError: string | undefined;
  accountsError: string | undefined;
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

  // zod
  const {
    register,
    formState: { errors },
  } = useForm<TransactionData>({
    resolver: zodResolver(TransactionSchema),
    mode: "onChange",
  });

  return (
    <form className="z-50 grid grid-cols-[1fr_2fr] gap-y-2 w-full py-2 text-[0.9rem] items-center">
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
        {!chosenCategory ? (
          <p>{categoryData?.map((item) => item.name)[0]}</p>
        ) : (
          chosenCategory
        )}
        {categoryDropdownClicked ? (
          <ChevronUp size={15} />
        ) : (
          <ChevronDown size={15} />
        )}

        {/* Dropdown */}
        {categoryDropdownClicked && (
          <div className="flex flex-col top-10 -left-1 z-50 absolute w-fit h-50 overflow-y-auto border border-(--color-border-subtle) bg-(--color-bg-base) rounded-lg shadow-md">
            {categoryData?.map((item, key) => (
              <div
                className="flex w-full px-5 py-1 h-fit text-[0.9rem] text-(--color-text-primary) font-display hover:bg-(--color-bg-subtle)"
                key={key}
                onClick={() => {
                  (setCategoryDropdownClicked(true),
                    setChosenCategory(item.name));
                }}
              >
                <p>{item.name}</p>
              </div>
            ))}
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
              {!chosenAccount ? (
                <p>{accountsData?.map((item) => item.name)[0]}</p>
              ) : (
                chosenAccount
              )}
              {accountDropdownClicked ? (
                <ChevronUp size={15} />
              ) : (
                <ChevronDown size={15} />
              )}
            </div>

            {/* Dropdown */}
            {accountDropdownClicked && (
              <div className="flex flex-col top-10 -left-1 z-50 absolute w-fit h-50 overflow-y-auto border border-(--color-border-subtle) bg-(--color-bg-base) rounded-lg shadow-md">
                {accountsData?.map((item, key) => (
                  <div
                    className="flex w-full px-5 py-1 h-fit text-[0.9rem] text-(--color-text-primary) font-display hover:bg-(--color-bg-subtle)"
                    key={key}
                    onClick={() => {
                      (setAccountDropdownClicked(false),
                        setChosenAccount(item.name));
                    }}
                  >
                    <p>{item.name}</p>
                  </div>
                ))}
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
              {!chosenAccountFrom ? (
                <p>{accountsData?.map((item) => item.name)[0]}</p>
              ) : (
                chosenAccountFrom
              )}
              {accountFromDropdown ? (
                <ChevronUp size={15} />
              ) : (
                <ChevronDown size={15} />
              )}
            </div>

            {/* Dropdown */}
            {accountFromDropdown && (
              <div className="flex flex-col top-10 -left-1 z-50 absolute w-fit max-h-50 min-h-fit overflow-y-auto border border-(--color-border-subtle) bg-(--color-bg-base) rounded-lg shadow-md">
                {accountsData?.map((item, key) => (
                  <div
                    className="flex w-full px-5 py-1 h-fit text-[0.9rem] text-(--color-text-primary) font-display hover:bg-(--color-bg-subtle)"
                    key={key}
                    onClick={() => {
                      (setAccountFromDropdown(true),
                        setChosenAccountFrom(item.name));
                    }}
                  >
                    <p>{item.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p>To</p>
          <div>
            <div
              className="flex border justify-between items-center border-(--color-border-default) rounded-lg text-[0.9rem] px-5 py-1 cursor-pointer hover:bg-(--color-bg-subtle)"
              onClick={() => setAccountToDropdown((prev) => !prev)}
            >
              {!chosenAccountTo ? (
                <p>{accountsData?.map((item) => item.name)[0]}</p>
              ) : (
                chosenAccountTo
              )}
              {accountToDropdown ? (
                <ChevronUp size={15} />
              ) : (
                <ChevronDown size={15} />
              )}
            </div>

            {/* Dropdown */}
            {accountToDropdown && (
              <div className="flex flex-col top-10 -left-1 z-50 absolute w-fit h-50 overflow-y-auto border border-(--color-border-subtle) bg-(--color-bg-base) rounded-lg shadow-md">
                {accountsData?.map((item, key) => (
                  <div
                    className="flex w-full px-5 py-1 h-fit text-[0.9rem] text-(--color-text-primary) font-display hover:bg-(--color-bg-subtle)"
                    key={key}
                    onClick={() => {
                      (setAccountToDropdown(true),
                        setChosenAccountTo(item.name));
                    }}
                  >
                    <p>{item.name}</p>
                  </div>
                ))}
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
          name="amountInput"
        />
      </div>

      <label htmlFor="note">Note</label>
      <div>
        <textarea
          id="note"
          rows={4}
          className="w-full border border-(--color-border-default) rounded-lg focus:outline-none resize-none px-5"
          name="descriptionInput"
        ></textarea>
      </div>
    </form>
  );
}
