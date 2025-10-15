import { z } from "zod";

export const UserSchema = z.object({
  uid: z.number(),
  email: z.string().email(),
  role: z.string(),
  name: z.string().optional(),
  avatar: z.string().url().optional(),
});
export type User = z.infer<typeof UserSchema>;

// API response schema for /api/v1/users (PascalCase -> camelCase)
export const UserApiSchema = z
  .object({
    Id: z.number(),
    Email: z.string().email(),
    FullName: z.string().nullable(),
    Role: z.string(),
    WalletBalance: z.number().optional(),
    CreateAt: z.string(),
  })
  .transform((raw) => ({
    id: raw.Id,
    email: raw.Email,
    fullName: raw.FullName ?? undefined,
    role: raw.Role,
    walletBalance: raw.WalletBalance ?? 0,
    createdAt: new Date(raw.CreateAt),
  }));

export type UserApi = z.infer<typeof UserApiSchema>;
