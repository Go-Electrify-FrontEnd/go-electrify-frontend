import { SubscriptionsTable } from "@/components/dashboard/admin/subscriptions/subscriptions-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, CreditCard } from "lucide-react";

export interface Subscription {
  id: number; // int
  name: string; // varchar(128)
  price: number; // decimal(18,2)
  totalKwh: number; // decimal(12,4)
  durationDays: number; // int
  createdAt: Date; // datetime
  updatedAt: Date; // datetime
}

async function getData(): Promise<Subscription[]> {
  // Mock data - replace with actual API call
  return [
    {
      id: 1,
      name: "Gói Cơ Bản",
      price: 199000,
      totalKwh: 100,
      durationDays: 30,
      createdAt: new Date("2023-10-01"),
      updatedAt: new Date("2023-10-01"),
    },
    {
      id: 2,
      name: "Gói Tiêu Chuẩn",
      price: 399000,
      totalKwh: 250,
      durationDays: 30,
      createdAt: new Date("2023-10-02"),
      updatedAt: new Date("2023-10-02"),
    },
    {
      id: 3,
      name: "Gói Premium",
      price: 799000,
      totalKwh: 500,
      durationDays: 30,
      createdAt: new Date("2023-10-03"),
      updatedAt: new Date("2023-10-03"),
    },
  ];
}

export default async function SubscriptionsPage() {
  const subscriptions = await getData();

  return (
    <div className="container mx-auto mt-4 space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="pt-2 pb-2">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-3xl">
                    Quản lý Gói Đăng Ký
                  </CardTitle>
                  <CardDescription className="text-base">
                    Quản lý các gói đăng ký sạc xe điện
                  </CardDescription>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto">
                <Plus className="mr-2 h-5 w-5" />
                Thêm Gói Mới
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Data Table Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Danh sách gói đăng ký</CardTitle>
              <CardDescription>
                Tất cả các gói đăng ký trong hệ thống
              </CardDescription>
            </div>
            <div className="bg-muted rounded-full px-3 py-1.5">
              <span className="text-sm font-medium">
                {subscriptions.length}
              </span>
              <span className="text-muted-foreground ml-1 text-xs">gói</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SubscriptionsTable data={subscriptions} />
        </CardContent>
      </Card>
    </div>
  );
}
