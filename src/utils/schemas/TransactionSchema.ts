import * as z from "zod"

export const TransactionSchema = z.object({
    category: z.string(),
    account: z.string(),
    amount: z.uint32(),
    note: z.string(),
    date: z.string(),
    accountFrom: z.string().optional(),
    accountTo: z.string().optional(),
})

export type TransactionData = z.infer<typeof TransactionSchema>;