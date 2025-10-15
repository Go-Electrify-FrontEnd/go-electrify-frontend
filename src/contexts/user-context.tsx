"use client";

import type { User } from "@/lib/zod/user/user.types";
import React, { createContext, useContext } from "react";

interface UserProviderProps extends React.PropsWithChildren {
  user: User | null | undefined;
}

const UserContext = createContext<UserProviderProps["user"]>(null);

export function UserProvider({ user, children }: UserProviderProps) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  const user = useContext(UserContext);
  return { user };
}
