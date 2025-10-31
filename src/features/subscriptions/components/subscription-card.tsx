"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item";
import { formatCurrencyVND } from "@/lib/formatters";
import type { Subscription } from "../schemas/subscription.types";
import { SubscriptionDetailsDialog } from "./subscription-details-dialog";

interface SubscriptionCardProps {
  subscription: Subscription;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  return (
    <>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>{subscription.name}</ItemTitle>
          <ItemDescription>
            {formatCurrencyVND(subscription.price)} •{" "}
            {subscription.durationDays} ngày • {subscription.totalKwh} kWh
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDetailsDialogOpen(true)}
          >
            Xem Chi Tiết
          </Button>
        </ItemActions>
      </Item>

      <SubscriptionDetailsDialog
        subscription={subscription}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </>
  );
}
