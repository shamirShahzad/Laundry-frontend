export const baseUrl = import.meta.env.VITE_API_URL;

export interface ErrorResponse {
  status: number;
  message: string;
  success: boolean;
  stack: unknown;
  data: object;
}
