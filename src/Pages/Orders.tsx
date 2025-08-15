/* eslint-disable react-hooks/exhaustive-deps */
import Sham_Alert from "@/Components/Sham_Alert";
import Sham_LoadingOverlay from "@/Components/Sham_LoadingOverlay";
import { useAlert } from "@/hooks/useAlert";
import { API } from "@/lib/utils/Axios";
import type { ErrorResponse } from "@/lib/utils/Constants";
import { orderColumns, type Order } from "@/Tables/Orders/order-columns";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { DataTable } from "@/Tables/data-table";
import { FolderSearch } from "lucide-react";
import FiltersComponent from "@/Components/FiltersComponent";
export interface Filters {
  status: string;
  payment_status: string;
  from: Date | undefined;
  to: Date | undefined;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { showAlert, hideAlert, alert } = useAlert();
  const [loading, setLoading] = useState(false);

  const [filtersState, setFiltersState] = useState<Filters>({
    status: "",
    payment_status: "",
    from: undefined,
    to: undefined,
  });

  const formatDateForState = (date: Date | undefined) => {
    if (!date) return undefined;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Debounce filters before fetching
  const [debouncedFilters, setDebouncedFilters] =
    useState<Filters>(filtersState);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filtersState);
    }, 600);

    return () => clearTimeout(handler); // clean up previous timer
  }, [filtersState]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      let url = "/orders/table";
      const queryParams: string[] = [];

      if (debouncedFilters.status)
        queryParams.push(`status=${debouncedFilters.status}`);
      if (debouncedFilters.payment_status)
        queryParams.push(`payment_status=${debouncedFilters.payment_status}`);
      if (debouncedFilters.from)
        queryParams.push(`from=${formatDateForState(debouncedFilters.from)}`);
      if (debouncedFilters.to)
        queryParams.push(`to=${formatDateForState(debouncedFilters.to)}`);

      // Only append query string if there are any filters
      if (queryParams.length > 0) url += `?${queryParams.join("&")}`;

      try {
        const response = await API.get(url);
        if (response.data.success) {
          if (response.data.data.length === 0) {
            setOrders([]);
          } else {
            setOrders(response.data.data);
          }
        }
      } catch (error) {
        const err = error as AxiosError;
        const errData = err?.response?.data as ErrorResponse;
        showAlert(
          "error",
          errData?.message || err.message || "Something went wrong"
        );
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [debouncedFilters]);

  const updateStatus = async (
    id: string,
    status?: string,
    payment_status?: string
  ) => {
    if (status === undefined && payment_status === undefined) {
      return;
    }

    // Build only with provided keys
    const statusObject: Record<string, string> = {};
    if (status !== undefined) {
      statusObject.status = status;
    }
    if (payment_status !== undefined) {
      statusObject.payment_status = payment_status;
    }
    try {
      const response = await API.post(
        `/orders/update/status/${id}`,
        statusObject
      );
      if (response.data.success) {
        showAlert("success", response.data.message);
        setOrders((prev) => {
          return prev.map((order) => {
            if (order.id === id) {
              return { ...order, ...statusObject };
            }
            return order;
          });
        });
      }
    } catch (error) {
      const err = error as AxiosError;
      const errData = err?.response?.data as ErrorResponse;
      showAlert(
        "error",
        errData?.message || err.message || "Something went wrong"
      );
    }
  };

  return (
    <Sham_LoadingOverlay loading={loading}>
      <div>
        <Sham_Alert
          type={alert.type}
          message={alert.message}
          visible={alert.visible}
          onClose={hideAlert}
        />

        <div className="ml-9 flex gap-5 items-center">
          <h1 className="text-dark-blue text-2xl font-semibold py-2">Orders</h1>
          <FiltersComponent
            onChangeFilters={setFiltersState}
            filters={filtersState}
          />
        </div>
        <hr />

        {orders.length > 0 ? (
          <DataTable
            data={orders}
            columns={orderColumns(updateStatus)}
            expandable={true}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex flex-col justify-center items-center align-middle gap-10">
            <h1 className="text-9xl font-bold text-dark-blue">404</h1>
            <FolderSearch size={150} color="#2a4352" />
            <h1 className="text-7xl font-bold text-dark-blue">
              No data found.
            </h1>
          </div>
        )}
      </div>
    </Sham_LoadingOverlay>
  );
};

export default Orders;
