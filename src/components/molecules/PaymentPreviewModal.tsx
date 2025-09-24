"use client";

import React from "react";
import {
  X,
  CheckCircle,
  Calendar,
  CreditCard,
  Hash,
  Clock,
  User,
  MapPin,
  Download,
  ExternalLink,
} from "lucide-react";
import Button from "../atoms/Button";
import { Card, CardContent } from "../atoms/Card";
import Badge from "../atoms/Badge";
import { formatCurrency } from "@/lib/helper";

interface PaymentPreviewData {
  bookingId: string;
  amount: number;
  paymentDate: string;
  paymentTime: string;
  paymentMethod: string;
  transactionRef: string;
  customerName: string;
  customerPhone: string;
  scheduleName: string;
  venue: string;
  matchDate: string;
  matchTime: string;
  status: string;
}

interface PaymentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: PaymentPreviewData | null;
  loading?: boolean;
}

export default function PaymentPreviewModal({
  isOpen,
  onClose,
  paymentData,
  loading = false,
}: PaymentPreviewModalProps) {
  if (!isOpen) return null;

  const handleDownloadReceipt = () => {
    // Implement receipt download functionality
    console.log("Downloading receipt for:", paymentData?.bookingId);
  };

  const handleViewFullDetails = () => {
    if (paymentData?.bookingId) {
      window.open(`/payment/${paymentData.bookingId}`, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Payment Successful
                </h2>
                <p className="text-sm text-gray-600">
                  Your booking has been confirmed
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {/* Loading skeleton */}
                <div className="animate-pulse">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : paymentData ? (
              <div className="space-y-6">
                {/* Payment Summary */}
                <Card className="border-green-200 bg-green-50/30">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {formatCurrency(paymentData.amount)}
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Payment Confirmed
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Payment Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                          Payment Information
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Booking ID</span>
                            <span className="font-mono text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                              {paymentData.bookingId}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Payment Method</span>
                            <span className="font-medium text-gray-900">
                              {paymentData.paymentMethod}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Transaction Ref</span>
                            <span className="font-mono text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                              {paymentData.transactionRef}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Payment Date</span>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">
                                {new Date(paymentData.paymentDate).toLocaleDateString("id-ID")}
                              </div>
                              <div className="text-sm text-gray-500">
                                {paymentData.paymentTime} WIB
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                          Booking Details
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <User className="w-4 h-4 text-blue-600" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {paymentData.customerName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {paymentData.customerPhone}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {paymentData.scheduleName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {paymentData.venue}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {new Date(paymentData.matchDate).toLocaleDateString("id-ID")}
                              </div>
                              <div className="text-sm text-gray-600">
                                {paymentData.matchTime} WIB
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Success Message */}
                <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Booking Confirmed!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your payment has been processed successfully. You will receive a confirmation message shortly.
                  </p>
                  <div className="text-sm text-gray-500">
                    Transaction completed on {new Date(paymentData.paymentDate).toLocaleDateString("id-ID")} at {paymentData.paymentTime} WIB
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Payment Data
                </h3>
                <p className="text-gray-600">
                  Unable to load payment information at this time.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex items-center"
            >
              Close
            </Button>
            
            {paymentData && (
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleDownloadReceipt}
                  className="flex items-center border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
                <Button
                  variant="primary"
                  onClick={handleViewFullDetails}
                  className="flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full Details
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}