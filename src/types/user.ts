import { z } from "zod";

export const UserSchema = z.object({
  email: z.email(),
  role: z.string(),
  name: z.string().optional(),
  avatar: z.url().optional(),
});
export type User = z.infer<typeof UserSchema>;
