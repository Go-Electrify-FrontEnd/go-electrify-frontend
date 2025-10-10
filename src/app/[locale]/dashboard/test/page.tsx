"use client";

import { useUser } from "@/contexts/user-context";
export default function ClientTest() {
  const { user } = useUser();
  return (
    <div>
      Welcome: {user?.email}
      Test: {user?.name}
    </div>
  );
}
