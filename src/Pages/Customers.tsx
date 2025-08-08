/* eslint-disable react-hooks/exhaustive-deps */
import { API } from "@/lib/utils/Axios";
import type { ErrorResponse } from "@/lib/utils/Constants";
import type { Customer } from "@/Tables/Customers/customer-columns";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useAlert } from "@/hooks/useAlert";
import Sham_Alert from "@/Components/Sham_Alert";
import Sham_LoadingOverlay from "@/Components/Sham_LoadingOverlay";
import { DataTable } from "@/Tables/data-table";
import { customerColumns } from "@/Tables/Customers/customer-columns";
import { FolderSearch } from "lucide-react";
import "./colors.css";

const Customers = () => {
  const [customers, setCustomer] = useState([] as Array<Customer>);
  const { alert, showAlert, hideAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await API.get("/customers", { withCredentials: true });
      if (response.data.success) {
        setCustomer(response.data.data);
      }
      showAlert("success", response.data.message);
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
    fetchCustomers();
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
          <h1 className="text-dark-blue text-2xl font-semibold py-2">
            Customers
          </h1>
        </div>
        <hr />
        <section>
          {customers.length > 0 ? (
            <DataTable data={customers} columns={customerColumns} />
          ) : (
            <div className="w-full h-full bg-gray-100 flex flex-col justify-center items-center align-middle gap-10">
              <h1 className="text-9xl font-bold text-dark-blue">404</h1>
              <FolderSearch size={150} color="#2a4352" />
              <h1 className="text-7xl font-bold text-dark-blue">
                No data found.
              </h1>
            </div>
          )}
        </section>
      </div>
    </Sham_LoadingOverlay>
  );
};

export default Customers;
