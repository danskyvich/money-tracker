export type FilterOption = { label: string; value: string };

export type FilterField =
  | {
      type: 'select';
      key: string;
      label: string;
      options: FilterOption[];
    }
  | {
      type: 'date';
      key: string;
      label: string;
    };