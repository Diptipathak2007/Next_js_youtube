import {z}from 'zod';
export const messageSchema = z.object({
    content: z.string()
        .min(1, { message: "Message must be at least 1 character long" })
        .max(500, { message: "Message must be at most 500 characters long" })
        .regex(/^[\w\s.,!?'"-]+$/, { message: "Message can only contain letters, numbers, spaces, and punctuation" }),
})