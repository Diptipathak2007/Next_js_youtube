import {z} from "zod";
export const verifySchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    code: z.string().min(6, { message: "Verification code must be at least 6 characters long" })
        .max(6, { message: "Verification code must be at most 6 characters long" }),
});
