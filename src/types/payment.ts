export interface PaymentStatus {
  id: string;
  bookingId: string;
  status: "PENDING" | "PAID" | "FAILED" | "EXPIRED";
  amount: number;
  paymentMethod?: string;
  paidAt?: string;
  expiresAt?: string;
  qrisImageUrl?: string;
  customerName: string;
  customerPhone: string;
  scheduleName: string;
  venue: string;
  date: string;
  time: string;
  createdAt: string;
}

export interface PaymentCheckRequest {
  bookingId: string;
}

export interface PaymentCheckResponse {
  success: boolean;
  data?: PaymentStatus;
  error?: string;
  message?: string;
}