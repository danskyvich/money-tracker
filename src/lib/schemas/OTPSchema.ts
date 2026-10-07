import z from "zod";

export const OTPSchema = z.object({
    otp: z.string().length(6, "Enter a 6-digit code."),
});

export type OTPData = z.infer<typeof OTPSchema>;