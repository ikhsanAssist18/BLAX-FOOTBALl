import { PaymentStatus, PaymentCheckRequest, PaymentCheckResponse } from "@/types/payment";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BE}/api/v1/payment`;

class PaymentService {
  async checkPaymentStatus(bookingId: string): Promise<PaymentCheckResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/check-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Failed to check payment status",
        };
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error("Error checking payment status:", error);
      return {
        success: false,
        error: "Network error occurred",
      };
    }
  }

  async getPaymentDetails(paymentId: string): Promise<PaymentStatus | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/details/${paymentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch payment details");
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching payment details:", error);
      return null;
    }
  }
}

export const paymentService = new PaymentService();