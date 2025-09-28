"use client";

interface UserProviderProps extends React.PropsWithChildren {
  user: {
    name: string;
    email: string;
    avatar: string;
  } | null;
}

import React, { createContext, useContext } from "react";

const UserContext = createContext<UserProviderProps["user"]>(null);

export function UserProvider({ user, children }: UserProviderProps) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
