export interface PaymentStatus {
  imageBase64: string;
  name: string;
  phone: string;
  total: number;
  bookId: string;
  status: string;
  id: string;
}
export interface PaymentCheckResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    status: PaymentStatus;
  };
}

export interface PaymentCheckRequest {
  bookingId: string;
}
