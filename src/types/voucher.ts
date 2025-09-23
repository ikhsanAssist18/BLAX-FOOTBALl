export interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VoucherPayload {
  code: string;
  name: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  isActive: boolean;
}

// export interface UserVoucher {
//   id: string;
//   userId: string;
//   voucherId: string;
//   usedAt?: string;
//   voucher: Voucher;
// }

export interface UserVoucher {
  name: string;
  code: string;
  description: string;
}
