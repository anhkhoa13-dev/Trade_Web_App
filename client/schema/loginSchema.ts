import * as z from "zod"

export const loginSchema = z.object({
    email: z.email({ error: "Invalid email" }),
    password: z.string().trim().min(1, { message: "Required password" }),
})

export type LoginInput = z.infer<typeof loginSchema>