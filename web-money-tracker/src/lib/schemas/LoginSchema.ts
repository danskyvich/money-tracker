import { z } from "zod";

export const loginSchema = z
    .object({
        username: z.string().min(2, "Username must be at least 2 characters"),
        password: z.string().min(8, "Password must be at least 8 characters"),
    });

    export type LoginFormData = z.infer<typeof loginSchema>;

