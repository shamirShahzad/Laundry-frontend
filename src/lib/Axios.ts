import axios, { AxiosError } from "axios";
import { baseUrl } from "./Constants";
export const API = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});
export const getAxiosErrorMessage = (error: unknown) => {
  if (
    error instanceof AxiosError &&
    error.response &&
    typeof error.response.data === "object" &&
    error.response.data != null &&
    "message" in error.response.data
  ) {
    return (error.response.data as { message: string }).message;
  }
};
