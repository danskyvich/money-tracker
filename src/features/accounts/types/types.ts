export type FilterOptions = { name: string, value: string };

export interface FilterAccountField {
    key: string,
    label: string,
    type: "select" | "dateRange" | "text"
    options: FilterOptions[],
}