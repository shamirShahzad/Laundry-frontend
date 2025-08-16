/* eslint-disable react-hooks/exhaustive-deps */
import ChartData from "@/Components/Chart-Data";
import { AxiosError } from "axios";
import { useAlert } from "@/hooks/useAlert";
import Sham_LoadingOverlay from "@/Components/Sham_LoadingOverlay";
import { useEffect, useState } from "react";
import type { ErrorResponse } from "@/lib/utils/Constants";
import Sham_Alert from "@/Components/Sham_Alert";
import { API } from "@/lib/utils/Axios";
import LatestOrders from "@/Components/LatestOrders";
import type { Order } from "@/Tables/Orders/order-columns";
import LatestCustomers from "@/Components/LatestCustomers";
import type { Customer } from "@/Tables/Customers/customer-columns";

const Dashboard = () => {
  const { showAlert, hideAlert, alert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [latestOrders, setLatestOrders] = useState<Order[]>([]);
  const [latestCustomers, setLatestCustomers] = useState<Customer[]>([]);
  const getChartData = async () => {
    setLoading(true);
    try {
      const response = await API.get("/dashboard/charts");
      if (response.data.success) {
        setChartData(response.data.data);
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

  const getLatestOrders = async () => {
    setLoading(true);
    try {
      const response = await API.get("/dashboard/orders/latest");
      if (response.data.success) {
        setLatestOrders(response.data.data);
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

  const getLatestCustomers = async () => {
    setLoading(true);
    try {
      const response = await API.get("/dashboard/customers/latest");
      if (response.data.success) {
        setLatestCustomers(response.data.data);
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
    getChartData();
    getLatestOrders();
    getLatestCustomers();
  }, []);

  return (
    <div className="overflow-y-auto">
      <Sham_LoadingOverlay loading={loading}>
        <Sham_Alert
          type={alert.type}
          message={alert.message}
          visible={alert.visible}
          onClose={hideAlert}
        />
        <div className="p-5">
          <ChartData chartData={chartData} />
          <div className="w-full pt-3 flex gap-5">
            <LatestOrders className="w-1/2 max-h-[450px]" data={latestOrders} />
            <LatestCustomers
              className="w-1/2 max-h-[450px]"
              data={latestCustomers}
            />
          </div>
        </div>
      </Sham_LoadingOverlay>
    </div>
  );
};

export default Dashboard;
