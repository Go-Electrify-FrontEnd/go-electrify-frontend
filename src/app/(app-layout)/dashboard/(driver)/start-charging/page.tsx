"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { handleJoin } from "./action";

export default function StartChargingPage() {
  const [state, action, pending] = useActionState(handleJoin, {
    success: false,
    msg: "",
    data: null,
  });
  return (
    <div>
      <form action={action}>
        <Input name="joinCode" placeholder="Booking Code" />
        <Button type="submit" disabled={pending}>
          {pending ? "Joining..." : "Join"}
        </Button>
      </form>
    </div>
  );
}
