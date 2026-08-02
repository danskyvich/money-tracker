import * as z from "zod"

export const TransactionSchema = z.object({
    category_id: z.string().min(1, "Category is required"),
    account_id: z.string().min(1, "An account is required"),
    amount: z.coerce.number().int().nonnegative(),
    description: z.string(),
    dateTime: z.string().min(1, "Date and time is required"),
    type: z.string().min(1, "A type is required"),
    to_account_id: z.string().optional(),
}).refine(
    (data) => data.type !== "transfer" || !!data.to_account_id, {
        message: "Destination account is required for transfer transactions", path: ["to_account_id"]
    }
)

export type TransactionData = z.infer<typeof TransactionSchema>;