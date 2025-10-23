import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, CreditCard, Zap } from "lucide-react";
import { formatCurrencyVND } from "@/lib/formatters";

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

// use shared formatter

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
                  className="flex items-center gap-3 rounded-lg border p-3 transition-all hover:shadow-md"
                >
                  <Zap className="text-muted-foreground h-5 w-5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">
                          {invoice.description} - {invoice.location}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {invoice.invoiceNumber}
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-3">
                        <div className="text-right">
                          <div className="font-semibold">
                            {formatCurrencyVND(invoice.amount)}
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
            <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Calendar className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="text-foreground mb-2 font-medium">
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
