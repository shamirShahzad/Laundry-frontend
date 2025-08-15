export const baseUrl = import.meta.env.VITE_API_URL;
export const productsUrl = import.meta.env.VITE_BASE_URL;
export const priceSymbol = "KWD";

export interface ErrorResponse {
  status: number;
  message: string;
  success: boolean;
  stack: unknown;
  data: object;
}

export interface SuccessResponse<T = object> {
  success: boolean;
  statusCode: string;
  message: string;
  data: T;
}

export const Status = {
  PENDING: "pending",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const PaymentStatus = {
  PAID: "paid",
  PARTIAL: "partial",
  UNPAID: "unpaid",
  REFUNDED: "refunded",
};
