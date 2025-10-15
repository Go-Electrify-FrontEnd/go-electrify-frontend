import { useEffect, useState } from "react";
import { CheckCircle, Copy, Loader, AlertCircle } from "lucide-react";

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

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const code = params.code as string;
  const id = params.id as string;
  const orderCode = params.orderCode as string;
  const cancel = params.cancel === "true";
  const status = (params.status as string) || "UNKNOWN";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const transaction: TransactionData = {
          code: searchParams.get("code") || "",
          id: searchParams.get("id") || "",
          orderCode: searchParams.get("orderCode") || "",
          cancel: searchParams.get("cancel") === "true",
          status: searchParams.get("status") || "UNKNOWN",
        };

        setTransactionData(transaction);

        // Gọi API backend để lấy chi tiết đơn hàng
        if (transaction.orderCode) {
          try {
            const response = await fetch(
              `/api/payment/order/${transaction.orderCode}`,
            );
            if (response.ok) {
              const data = await response.json();
              setOrderDetails(data.data || data);
            }
          } catch (err) {
            console.log("Could not fetch order details");
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Có lỗi xảy ra";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString)
      return new Date().toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

    return new Date(dateString).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <Loader className="h-12 w-12 animate-spin text-blue-600" />
          </div>
          <p className="font-medium text-gray-600">
            Đang xử lý thông tin thanh toán...
          </p>
        </div>
      </div>
    );
  }

  if (error || !transactionData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Lỗi</h1>
          <p className="mb-6 text-gray-600">
            {error || "Không thể tải thông tin giao dịch"}
          </p>
          <button
            onClick={() => router.push(`/dashboard/wallet`)}
            className="w-full rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const isSuccess =
    transactionData.status === "PAID" && !transactionData.cancel;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 rounded-lg bg-white p-8 shadow-md">
          {/* Logo & Title */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Trung tâm nạp thẻ chính thức
            </h1>
          </div>

          {/* Success Icon & Message */}
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
              <button
                onClick={() => copyToClipboard(transactionData.id)}
                className="p-1 text-gray-400 transition hover:text-gray-600"
                title="Copy"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
            {copied && (
              <p className="mt-1 text-sm text-green-600">✓ Đã copy!</p>
            )}
          </div>

          {/* Transaction Details */}
          <div className="space-y-6">
            {/* Amount Section */}
            {orderDetails && (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Tổng cộng</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {orderDetails.amount
                          ? Math.floor(orderDetails.amount / 100)
                          : 0}
                      </span>
                      <span className="text-sm text-gray-600">₫</span>
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Giá</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {orderDetails.amount
                        ? (orderDetails.amount / 100).toLocaleString("vi-VN")
                        : "0"}{" "}
                      ₫
                    </p>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Details Grid */}
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
            )}

            {/* If no order details, show basic info from URL */}
            {!orderDetails && (
              <>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
                  <p className="mb-2 text-sm text-blue-800">
                    Giao dịch đang được xử lý
                  </p>
                  <p className="text-xs text-blue-600">
                    Thông tin chi tiết sẽ được cập nhật trong giây lát
                  </p>
                </div>

                <hr className="border-gray-200" />

                <div className="space-y-4">
                  <DetailRow
                    label="Thời gian giao dịch"
                    value={formatDateTime()}
                  />
                </div>
              </>
            )}

            {/* Order Code */}
            <hr className="border-gray-200" />
            <DetailRow
              label="Mã đơn hàng"
              value={transactionData.orderCode}
              copiable={true}
              onCopy={() => copyToClipboard(transactionData.orderCode)}
            />

            {/* Additional Info */}
            <hr className="border-gray-200" />
            <DetailRow label="Trạng thái" value={transactionData.status} />
            <DetailRow
              label="Mã phản hồi"
              value={transactionData.code || "00"}
            />

            {/* Customer Info */}
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

          {/* Action Button */}
          <button
            onClick={() => router.push(`/dashboard/wallet`)}
            className="mt-8 w-full rounded-lg bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
          >
            Quay lại Trang chủ
          </button>

          {/* Warning for cancelled */}
          {!isSuccess && (
            <div className="mt-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
              <p className="text-center text-sm text-orange-800">
                Nếu bạn đã thanh toán nhưng nhận được thông báo này, vui lòng
                liên hệ với chúng tôi.
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="space-y-2 text-center text-sm text-gray-600">
          <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</p>
          <p>Kiểm tra email để nhận xác nhận giao dịch</p>
        </div>
      </div>
    </div>
  );
}

// Component hiển thị chi tiết
interface DetailRowProps {
  label: string;
  value: string;
  copiable?: boolean;
  onCopy?: () => void;
}

function DetailRow({ label, value, copiable = false, onCopy }: DetailRowProps) {
  return (
    <div className="flex items-start justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-right font-semibold text-gray-900">{value}</span>
        {copiable && onCopy && (
          <button
            onClick={onCopy}
            className="flex-shrink-0 p-0.5 text-gray-400 transition hover:text-gray-600"
            title="Copy"
          >
            <Copy className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
