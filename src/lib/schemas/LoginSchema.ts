import { z } from "zod";

export const loginSchema = z
    .object({
        email: z.email("Invali email")
    });

    export type LoginFormData = z.infer<typeof loginSchema>;

