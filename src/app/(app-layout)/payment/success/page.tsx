import { CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { formatDateWithOptions, formatCurrencyVND } from "@/lib/formatters";
import { API_PAYMENT_ORDER_URL } from "@/lib/api-config";

interface TransactionData {
  code: string;
  id: string;
  orderCode: string;
  cancel: boolean;
  status: string;
}

interface OrderDetails {
  amount: number;
  description?: string;
  createdAt?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  productName?: string;
}

async function getTransactionData(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const getString = (value: string | string[] | undefined) =>
    Array.isArray(value) ? (value[0] ?? "") : (value ?? "");

  return {
    code: getString(searchParams.code),
    id: getString(searchParams.id),
    orderCode: getString(searchParams.orderCode),
    cancel: getString(searchParams.cancel) === "true",
    status: getString(searchParams.status) || "UNKNOWN",
  };
}

async function getOrderDetails(
  orderCode: string,
): Promise<OrderDetails | null> {
  if (!orderCode) return null;

  try {
    const res = await fetch(`${API_PAYMENT_ORDER_URL}/${orderCode}`);

    if (!res.ok) throw new Error("Fetch failed");
    const data = await res.json();
    return data.data || data;
  } catch (e) {
    console.error("Lỗi khi fetch order:", e);
    return null;
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const transactionData = await getTransactionData(resolvedParams);
  const orderDetails = await getOrderDetails(transactionData.orderCode);

  const isSuccess =
    transactionData.status === "PAID" && !transactionData.cancel;

  const formatDateTime = (dateString?: string) => {
    return formatDateWithOptions(dateString || new Date().toISOString(), {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!transactionData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Lỗi</h1>
          <p className="mb-6 text-gray-600">
            Không thể tải thông tin giao dịch
          </p>
          <Link
            href="/dashboard/wallet"
            prefetch={false}
            className="inline-block w-full rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 rounded-lg bg-white p-8 shadow-md">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Trang giao dịch chính thức
            </h1>
          </div>

          {/* Success Icon */}
          <div className="mb-8 text-center">
            <div
              className={`mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full ${
                isSuccess ? "bg-green-50" : "bg-orange-50"
              }`}
            >
              <CheckCircle
                className={`h-16 w-16 ${
                  isSuccess ? "text-green-500" : "text-orange-500"
                }`}
              />
            </div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">
              {isSuccess
                ? "Thanh toán đã hoàn tất!"
                : "Thanh toán không thành công"}
            </h2>
            <p className="text-gray-600">ID giao dịch</p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <code className="text-lg font-semibold text-gray-900">
                {transactionData.id}
              </code>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-6">
            {orderDetails ? (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Tổng cộng</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {Math.floor(orderDetails.amount / 100)}
                      </span>
                      <span className="text-sm text-gray-600">₫</span>
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Giá</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrencyVND(orderDetails.amount / 100)}
                    </p>
                  </div>
                </div>

                {/* <hr className="border-gray-200" /> */}

                <div className="space-y-4">
                  <DetailRow
                    label="Game"
                    value={
                      orderDetails.productName ||
                      orderDetails.description ||
                      "Nạp ví"
                    }
                  />
                  <DetailRow
                    label="Phương thức thanh toán"
                    value="Thanh toán qua App Ngân Hàng"
                  />
                  <DetailRow
                    label="Thời gian giao dịch"
                    value={formatDateTime(orderDetails.createdAt)}
                  />
                </div>
              </>
            ) : (
              <>
                <hr className="border-gray-200" />
                <DetailRow
                  label="Thời gian giao dịch"
                  value={formatDateTime()}
                />
              </>
            )}

            <hr className="border-gray-200" />
            <DetailRow label="Mã đơn hàng" value={transactionData.orderCode} />
            <hr className="border-gray-200" />
            <DetailRow label="Trạng thái" value={transactionData.status} />

            {orderDetails &&
              (orderDetails.customerName || orderDetails.customerEmail) && (
                <>
                  <hr className="border-gray-200" />
                  {orderDetails.customerName && (
                    <DetailRow
                      label="Khách hàng"
                      value={orderDetails.customerName}
                    />
                  )}
                  {orderDetails.customerEmail && (
                    <DetailRow
                      label="Email"
                      value={orderDetails.customerEmail}
                    />
                  )}
                  {orderDetails.customerPhone && (
                    <DetailRow
                      label="Số điện thoại"
                      value={orderDetails.customerPhone}
                    />
                  )}
                </>
              )}
          </div>

          {/* Button */}
          <Link
            href={`/dashboard/wallet`}
            className="mt-8 block w-full rounded-lg bg-green-500 px-6 py-3 text-center font-bold text-white transition hover:bg-red-700"
          >
            Quay lại Trang chủ
          </Link>

          {!isSuccess && (
            <div className="mt-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
              <p className="text-center text-sm text-orange-800">
                Nếu bạn đã thanh toán nhưng nhận được thông báo này
                <br /> Vui lòng liên hệ với chúng tôi.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="space-y-2 text-center text-sm text-gray-600">
          <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi !</p>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-right font-semibold text-gray-900">{value}</span>
    </div>
  );
}
