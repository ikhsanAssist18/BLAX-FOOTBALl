"use client";
import React, { useState, useEffect } from "react";
import { QrCode, Copy, RefreshCw } from "lucide-react";
import Button from "../atoms/Button";
import { useNotifications } from "./NotificationContainer";
import { bookingService } from "@/utils/booking";
import { SuccessModal, WarningModal } from "../molecules/AlertModal";

interface PaymentReviewProps {
  paymentId: string; // Changed from bookingId to paymentId
  onClose?: () => void;
  onExpiredPayment?: () => void; // New callback for expired payment
  onSuccessPayment?: () => void; // New callback for successful payment
}

interface PaymentData {
  customerName: string;
  customerPhone: string;
  bookId: string;
  amount: number;
  qrisImageBase64: string; // Base64 string from backend
}

export default function PaymentReview({
  paymentId,
  onClose,
  onExpiredPayment,
  onSuccessPayment,
}: PaymentReviewProps) {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    fetchPaymentData();
  }, [paymentId]);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const result = await bookingService.previewPayment(paymentId);

      if (result.status === "pending") {
        setPaymentData({
          customerName: result.name,
          customerPhone: result.phone,
          amount: result.total,
          bookId: result.bookId,
          qrisImageBase64: result.imageBase64,
        });
      } else if (result.status === "expire") {
        // Show expired payment modal
        setShowExpiredModal(true);
        setPaymentData(null);
      } else if (result.status === "settlement") {
        // Show success payment modal
        setShowSuccessModal(true);
        setPaymentData(null);
      } else {
        showError(
          "Payment Error",
          result.error || "Failed to fetch payment data"
        );
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
      showError("Payment Error", "Failed to fetch payment data");
    } finally {
      setLoading(false);
    }
  };

  const handleExpiredPaymentConfirm = () => {
    setShowExpiredModal(false);
    // Call the callback if provided, otherwise close the component
    if (onExpiredPayment) {
      onExpiredPayment();
    } else if (onClose) {
      onClose();
    }
  };

  const handleSuccessPaymentConfirm = () => {
    setShowSuccessModal(false);
    // Call the callback if provided, otherwise close the component
    if (onSuccessPayment) {
      onSuccessPayment();
    } else if (onClose) {
      onClose();
    }
  };

  const copyBookId = () => {
    if (paymentData?.bookId) {
      navigator.clipboard.writeText(paymentData.bookId);
      showSuccess("Copied", "Book ID copied to clipboard");
    }
  };

  console.log("paymentData", paymentData);

  // Show expired modal
  if (showExpiredModal) {
    return (
      <>
        <WarningModal
          isOpen={showExpiredModal}
          onClose={() => setShowExpiredModal(false)}
          title="Payment Expired"
          message="Payment telah expired, silahkan lakukan booking lagi untuk melanjutkan proses pembayaran."
          confirmText="OK, Booking Lagi"
          cancelText="Tutup"
          onConfirm={handleExpiredPaymentConfirm}
          showCancel={true}
        />
      </>
    );
  }

  // Show success modal
  if (showSuccessModal) {
    return (
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Payment Successful"
        message="Payment telah berhasil! Silahkan hubungi admin dan cek line up secara berkala."
        confirmText="OK"
        onConfirm={handleSuccessPaymentConfirm}
        showCancel={false}
      />
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Loading Payment Data
          </h3>
          <p className="text-gray-600">
            Please wait while we fetch your payment information...
          </p>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load Payment Data
          </h3>
          <p className="text-gray-600 mb-4">
            Unable to fetch payment information. Please try again.
          </p>
          <Button onClick={fetchPaymentData} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <QrCode className="h-8 w-8 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">
            Payment Review - {paymentData.bookId}
          </h2>
        </div>
      </div>

      {/* Book ID Box */}
      <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
          📋 Booking ID
        </h4>
        <div className="flex items-center justify-between bg-white p-3 rounded border border-yellow-300">
          <div className="flex-1">
            <span className="text-lg font-mono font-bold text-gray-800">
              {paymentData.bookId}
            </span>
          </div>
          <button
            onClick={copyBookId}
            className="ml-3 flex items-center gap-2 px-3 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 hover:text-yellow-800 rounded-md transition-colors font-medium"
            title="Copy Book ID"
          >
            <Copy className="h-4 w-4" />
            Copy
          </button>
        </div>
        <p className="text-sm text-yellow-700 mt-3 leading-relaxed">
          <strong>📝 Penting:</strong> Simpan booking ID anda sebagai bukti
          pembayaran atau jika pembayaran gagal bisa berikan booking ID kepada
          admin untuk proses lebih lanjut.
        </p>
      </div>

      {/* Payment Details */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
        <h4 className="font-medium text-blue-900 mb-2">Payment Information:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • <span>Name :</span>
            <span> {paymentData.customerName}</span>
          </li>
          <li>
            • <span>Contact :</span> {paymentData.customerPhone}
          </li>
          <li>
            • <span>Amount :</span> Rp{" "}
            {paymentData.amount.toLocaleString("id-ID")}
          </li>
          <li>
            • <span>Status :</span> Ready for payment
          </li>
        </ul>
      </div>

      {/* QRIS Code Display */}
      <div className="text-center mb-6">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 inline-block mb-4">
          <img
            src={paymentData.qrisImageBase64}
            alt="QRIS Code"
            className="w-64 h-64 mx-auto"
            onError={(e) => {
              console.error("Failed to load QRIS image");
              showError("Image Error", "Failed to load QRIS code");
            }}
          />
        </div>

        <p className="text-gray-600 mb-4">
          Scan this QR code with your mobile banking or e-wallet app
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-3">
        <Button onClick={fetchPaymentData} variant="outline" className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>

        {onClose && (
          <Button onClick={onClose} variant="primary" className="w-full">
            Close
          </Button>
        )}
      </div>
    </div>
  );
}
