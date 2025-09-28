import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, CreditCard, Zap } from "lucide-react";

const outstandingInvoices = [
  {
    id: 1,
    invoiceNumber: "HD-2025-001234",
    description: "Phí phạt sạc quá giờ",
    amount: 30000,
    status: "normal", // overdue, due-soon, normal
    location: "FPT University",
    daysPastDue: 2,
  },
];

// Sort by urgency (overdue first, then due soon, then normal)
const sortedInvoices = outstandingInvoices.sort((a, b) => {
  const statusPriority = { overdue: 0, "due-soon": 1, normal: 2 };
  return (
    statusPriority[a.status as keyof typeof statusPriority] -
    statusPriority[b.status as keyof typeof statusPriority]
  );
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export function PenaltyTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Khoản Phạt</CardTitle>
        <CardDescription>
          {sortedInvoices.length > 0
            ? `Bạn có ${sortedInvoices.length} khoản phạt cần thanh toán trước khi sử dụng dịch vụ`
            : "Bạn không có khoản phạt nào cần thanh toán"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedInvoices.length > 0 ? (
          <div className="space-y-3">
            {sortedInvoices.map((invoice) => {
              return (
                <div
                  key={invoice.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:shadow-md transition-all"
                >
                  <Zap className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {invoice.description} - {invoice.location}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.invoiceNumber}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <div className="font-semibold">
                            {formatCurrency(invoice.amount)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">
                            <CreditCard className="mr-1 h-4 w-4" />
                            Thanh toán
                          </Button>
                          <Button variant="outline" size="sm">
                            Chi tiết
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2">
              Không có khoản phạt nào
            </h3>
            <Button variant="outline" size="sm" className="mt-4">
              <Calendar className="mr-2 h-4 w-4" />
              Xem lịch sử thanh toán
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
