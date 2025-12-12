import * as z from "zod"

export const registerSchema = z
    .object({
        username: z.string().trim().min(1, { message: "Username is required" }),
        email: z.email({ message: "Invalid email" }),
        password: z
            .string()
            .min(6, { message: "Password must be at least 6 characters" }),
        confirm: z.string().min(6, { message: "Please confirm your password" }),
    })
    .refine((data) => data.password === data.confirm, {
        message: "Passwords do not match",
        path: ["confirm"],
    })

export type RegisterInput = z.infer<typeof registerSchema>