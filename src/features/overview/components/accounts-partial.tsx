import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface AccountsListProps {
  accountsData: any[] | null | undefined;
  accountsError: string | null;
  totalNumberOfItems: number | null | undefined;
  pressedCurrentPage: (page: number) => void;
}

export default function AccountsList({
  accountsData,
  accountsError,
  totalNumberOfItems,
  pressedCurrentPage,
}: AccountsListProps) {

  // pagination --> edit # of items calculations on lib/aadt / overview.ts;
  // calculation here is purely for pagination purposes
  const [currentPage, setCurrentPage] = useState<number>(1); // dynamic, comes from page number the user clicks to navigate
  const totalPages = totalNumberOfItems ? Math.ceil(totalNumberOfItems / 4) : 0;
  const paginationArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  const [windowStart, setWindowStart] = useState(0);
  const visiblePages = paginationArray.slice(windowStart, windowStart + 5);

  return (
    <>
      {accountsError ? (
        <div className="flex w-full h-full items-center justify-center text-[0.9rem]">
          <p>{accountsError}</p>
        </div>
      ) : (
        <div className="flex flex-col w-full h-100 2xl:h-full">
          {accountsData?.length === 0 ? (
            <div className="flex w-full h-full items-center justify-center text-[0.9rem]">
              <p>You have no accounts.</p>
            </div>
          ) : (
            <div className="flex relative flex-2 flex-col w-full h-fit overflow-y-auto">
              <div className="flex flex-col w-full h-full">
                {accountsData?.map((item, key) => (
                  <div
                    className="grid grid-cols-[1fr_1fr_1fr_1fr] w-full h-15 border-b border-(--color-border-subtle) px-5 py-1 text-[0.9rem] items-center hover:bg-(--color-bg-subtle) cursor-pointer"
                    key={key}
                  >
                    <div className="line-clamp-1">{item.name}</div>
                    <div className="text-(--color-text-secondary) line-clamp-1">
                      {item.description}
                    </div>
                    <div className="line-clamp-1">
                      {item?.category_id?.name}
                    </div>
                    <div className="line-clamp-1">{item.balance}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-0 w-full h-fit px-5 py-3 text-[0.9rem] text-(--color-text-secondary) whitespace-nowrap items-center justify-between">
            <div className="flex flex-1 w-full h-fit">
              <p>
                Show data{" "}
                <span className="border border-(--color-border-subtle) mx-1 rounded-lg p-2">
                  {accountsData?.length ?? 0}
                </span>
                of {totalNumberOfItems ?? 0}
              </p>
            </div>

            <div className="flex flex-1 w-full h-full items-center justify-end gap-2">
              {windowStart > 0 && (
                <div
                  className="px-3 py-2 border border-(--color-border-default) rounded-lg shadow-md cursor-pointer hover:bg-(--color-bg-subtle)"
                  onClick={() =>
                    setWindowStart((prev) => Math.max(0, prev - 5))
                  }
                >
                  <ChevronLeft size={15} />
                </div>
              )}

              {/* window slice (-5, windowStart, +5) */}
              {visiblePages.map((item, key) => (
                <div
                  className={`px-3 py-2 border border-(--color-border-default) rounded-lg shadow-md hover:bg-(--color-bg-subtle) cursor-pointer ${currentPage === item ? "bg-(--color-brand-green) text-black hover:bg-(--color-brand-green)" : null}`}
                  key={key}
                  onClick={() => {
                    pressedCurrentPage(item);
                  }}
                >
                  <p>{item}</p>
                </div>
              ))}

              {/* Right */}
              {windowStart + 5 < paginationArray.length && (
                <div
                  className="px-3 py-2 border border-(--color-border-default) rounded-lg shadow-md"
                  onClick={() =>
                    setWindowStart((prev) =>
                      Math.min(paginationArray.length - 5, prev + 5),
                    )
                  }
                >
                  <ChevronRight size={15} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
