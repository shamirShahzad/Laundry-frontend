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

const Orders = () => {
  const [orders, setOrders] = useState([] as Array<Order>);
  const { showAlert, hideAlert, alert } = useAlert();
  const [loading, setLoading] = useState(false);

  const getOrderColumns = async () => {
    setLoading(true);
    try {
      const response = await API.get("/orders/table");
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      const err = error as AxiosError;
      const errData = err?.response?.data as ErrorResponse;
      showAlert(
        "error",
        errData?.message || err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderColumns();
  }, []);

  return (
    <Sham_LoadingOverlay loading={loading}>
      <div>
        <Sham_Alert
          type={alert.type}
          message={alert.message}
          visible={alert.visible}
          onClose={hideAlert}
        />
        <div className="ml-9">
          <h1 className="text-dark-blue text-2xl font-semibold py-2">Orders</h1>
        </div>
        <hr />
        {orders.length > 0 ? (
          <DataTable data={orders} columns={orderColumns} expandable={true} />
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
