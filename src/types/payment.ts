export interface PaymentStatus {
  imageBase64?: string;
  name: string;
  phone: string;
  total: number;
  bookId: string;
  status: string;
  paymentDate: string;
  paymentTime: string;
  matchDate: string;
  matchTime: string;
  scheduleName: string;
  venue: string;
  id: string;
}
export interface PaymentCheckResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: PaymentStatus;
}

export interface PaymentCheckRequest {
  bookingId: string;
}
