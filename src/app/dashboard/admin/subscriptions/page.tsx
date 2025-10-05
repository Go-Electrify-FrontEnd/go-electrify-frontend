import { SubscriptionsTable } from "@/components/dashboard/admin/subscriptions/subscription-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, CreditCard } from "lucide-react";
import type { Subscription } from "@/types";

async function getData(): Promise<Subscription[]> {
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
      <Card>
        <CardHeader className="pt-8 pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-5">
                <div className="bg-primary ring-primary/10 flex h-16 w-16 items-center justify-center rounded-2xl shadow-xl ring-4">
                  <CreditCard className="text-primary-foreground h-8 w-8" />
                </div>
                <div className="space-y-1.5">
                  <CardTitle className="text-foreground text-4xl font-semibold">
                    Quản lý Gói Đăng Ký
                  </CardTitle>
                  <CardDescription className="text-muted-foreground/90 text-base font-medium">
                    Quản lý và theo dõi các gói đăng ký sạc xe điện một cách
                    hiệu quả
                  </CardDescription>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 w-full shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg sm:w-auto"
              >
                <Plus className="mr-2 h-5 w-5" />
                Thêm Gói Mới
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="dark:bg-card/50 overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
        <CardHeader className="border-b">
          <CardTitle>Danh sách gói đăng ký</CardTitle>
          <CardDescription>
            Tất cả các gói đăng ký trong hệ thống với thông tin chi tiết
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubscriptionsTable data={subscriptions} />
        </CardContent>
      </Card>
    </div>
  );
}
