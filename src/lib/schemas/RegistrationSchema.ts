import {z} from "zod";

export const registerFormSchema = z
    .object({
        username: z.string().min(3, "Username must have at least 3 characters"),
        email: z.string().regex(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/, "Invalid email address"),
        password: z.string().min(8, "Requires at least eight characters").regex(/^(?=.*[a-z])(?=.*\d)(?=.*[@*&%?!$#])[A-Za-z\d@*&%?!$#]$/, "Requires at least one alphanumeric and any character"),
        retypePassword: z.string().min(8, "Requires at least eight characters").regex(/^(?=.*[a-z])(?=.*\d)(?=.*[@*&%?!$#])[A-Za-z\d@*&%?!$#]$/, "Requires at least one alphanumeric and any character"),
    }).refine((data) => data.password === data.retypePassword, {
        message: "Password does not match",
        path: ["retypedPassword"], //on where input should this error message manifest
    })

export type RegisterFormData = z.infer<typeof registerFormSchema>