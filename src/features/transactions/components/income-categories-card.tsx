import Card from "@/components/layout/card";
import ErrorModal from "@/components/layout/error-modal";
import { FetchIncomeCategories } from "@/lib/supabase/actions/database";
import { useEffect, useState } from "react";
import CategoriesSkeleton from "./skeleton/categories-skeleton";
import { Categories } from "@/lib/types/derived";

export default function IncomeCategoriesCard() {
  //states
  const [loading, setLoading] = useState<boolean>(false);
  const [incomeCategoriesError, setIncomeCategoriesError] = useState<
    string | null
  >(null);
  const [incomeCategories, setIncomeCategories] = useState<Categories[] | null>(
    null,
  );

  const fetchData = async () => {
    setLoading(true);

    const result = await FetchIncomeCategories();
    if (!result.success) {
      setIncomeCategoriesError(result.error);
      setLoading(false);
      return;
    }
    setIncomeCategories(result.data);
    setLoading(false);
    return;
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Card
      header="Income categories"
      className="flex flex-1 border border-(--color-border-default) rounded-lg xl:h-full h-150 overflow-auto shadow-lg"
    >
      {incomeCategoriesError && <ErrorModal message={incomeCategoriesError} />}
      {loading ? (
        <CategoriesSkeleton />
      ) : (
        <>
          {incomeCategories?.map((item, id) => (
            <div className="flex w-full h-fit px-5 py-2 border-b border-(--color-border-subtle) hover:bg-(--color-bg-subtle) text-[0.9rem] cursor-pointer" key={id}>
              {item.name}
            </div>
          ))}
        </>
      )}
    </Card>
  );
}
