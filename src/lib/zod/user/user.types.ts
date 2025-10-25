import type { User } from "./user.schema";
import type { UserApi } from "./user.schema";

export type { User };
export type { UserApi };

// Helper function để convert UserApi sang User
export function mapUserApiToUser(userApi: UserApi): User {
  return {
    uid: userApi.id,
    email: userApi.email,
    role: userApi.role,
    name: userApi.fullName || undefined,
    avatar: undefined,
  };
}
