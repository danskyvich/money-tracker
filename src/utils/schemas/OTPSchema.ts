import z from "zod";

export const OTPSchema = z.object({
    otp: z.string().length(6),
});

export type OTPData = z.infer<typeof OTPSchema>;