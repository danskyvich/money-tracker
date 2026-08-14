import { FilterOptions } from "@/features/accounts/types/types";

export interface FilterTransactionField {
    key: string,
    label: string,
    type: "select" | "dateRange" | "text",
    options: FilterOptions[],
}