import * as z from "zod";

export const verificationSchema = z.object({
    activateCode: z.string().length(6, "Code must be 6 digits"),
});

export type VerificationInput = z.infer<typeof verificationSchema>