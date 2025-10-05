import { z } from "zod";

export const UserSchema = z.object({
  email: z.string().email(),
});
export type User = z.infer<typeof UserSchema>;
