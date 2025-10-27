"use client";

import type { User } from "@/lib/zod/user/user.types";
import React, { createContext, useContext } from "react";

interface UserProviderProps extends React.PropsWithChildren {
  user: User | null | undefined;
  token: string | null | undefined;
}

const UserContext = createContext<UserProviderProps | null>(null);

export function UserProvider({ user, token, children }: UserProviderProps) {
  return (
    <UserContext.Provider value={{ user, token }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  return { user: context?.user, token: context?.token };
}
