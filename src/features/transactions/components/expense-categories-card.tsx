import Card from "@/components/layout/card";
import ErrorModal from "@/components/layout/error-modal";
import { FetchExpenseCategories } from "@/lib/supabase/actions/database";
import { Categories } from "@/lib/types/derived";
import { useEffect, useState } from "react";
import CategoriesSkeleton from "./skeleton/categories-skeleton";

export default function ExpenseCategoriesCard () {

    // states
    const [loading, setLoading] = useState<boolean>(false);
    const [expenseCategoriesError, setExpenseCategoriesError] = useState<string | null>(null);
    const [expenseCategories, setExpenseCategories] = useState<Categories[] | null>(null);

    // fetch data
    const fetchData = async () => {
        setLoading(true);

        const result = await FetchExpenseCategories();
        if (!result.success) {
            setExpenseCategoriesError(result.error);
            setLoading(false);
            return;
        }
        setExpenseCategories(result.data);
        setLoading(false);
        return;
    }

    useEffect(() => {
        fetchData();
    }, []);
    return (
      <Card
        header="Expense categories"
        className="flex flex-1 border border-(--color-border-default) rounded-lg xl:h-full h-150 overflow-auto shadow-lg"
      >
        {expenseCategoriesError && (
          <ErrorModal message={expenseCategoriesError} />
        )}
        {loading ? (
          <CategoriesSkeleton />
        ) : (
          <>
            {expenseCategories?.map((item, id) => (
              <div
                className="flex w-full h-fit px-5 py-2 border-b border-(--color-border-subtle) hover:bg-(--color-bg-subtle) text-[0.9rem] cursor-pointer"
                key={id}
              >
                {item.name}
              </div>
            ))}
          </>
        )}
      </Card>
    );
}