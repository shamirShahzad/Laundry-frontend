/* eslint-disable react-hooks/exhaustive-deps */
import Sham_Alert from "@/Components/Sham_Alert";
import Sham_Input from "@/Components/Sham_Input";
import Sham_LoadingOverlay from "@/Components/Sham_LoadingOverlay";
import { useAlert } from "@/hooks/useAlert";
import { API } from "@/lib/utils/Axios";
import {
  priceSymbol,
  productsUrl,
  type ErrorResponse,
} from "@/lib/utils/Constants";
import type { Item } from "@/Tables/Items/item-columns";
import type { AxiosError } from "axios";
import { Form, Formik } from "formik";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

const AddOrder = () => {
  interface OrderLine {
    item_id: string;
    service_ids: string[];
    quantity: number;
  }

  interface FormData {
    search: string;
    cust_id: string;
    items: OrderLine[];
  }

  const initialValues: FormData = {
    search: "",
    cust_id: "",
    items: [],
  };

  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const [items, setItems] = useState([] as Array<Item>);

  const getItems = async () => {
    setLoading(true);
    try {
      const response = await API.get("/items");
      if (response.data.success) {
        setItems(response.data.data);
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
    getItems();
  }, []);

  return (
    <Sham_LoadingOverlay loading={loading}>
      <div className="w-full h-full max-h-full bg-gray-200 overflow-auto">
        <Sham_Alert
          visible={alert.visible}
          type={alert.type}
          message={alert.message}
          onClose={hideAlert}
        />
        <div className="ml-9">
          <h1 className="mt-6 text-2xl font-semibold text-dark-blue">
            Create Order
          </h1>
        </div>
        <hr className="border-t border-gray-400 mt-3" />
        <Formik
          initialValues={initialValues}
          onSubmit={() => {}}
          validationSchema={null}
        >
          {({ handleBlur, handleChange, values, setFieldValue }) => {
            const addOrderLine = (item_id: string) => {
              setFieldValue("items", [
                ...values.items,
                {
                  item_id,
                  service_ids: [],
                  quantity: 1,
                },
              ]);
            };

            const updateQty = (lineIndex: number, quantity: number) => {
              const updated = [...values.items];
              updated[lineIndex].quantity = quantity;
              setFieldValue("items", updated);
            };

            const removeOrderLine = (index: number) => {
              setFieldValue(
                "items",
                values.items.filter((_, i) => i != index)
              );
            };

            const toggleService = (lineIndex: number, service_id: string) => {
              const updated = [...values.items];
              const services = updated[lineIndex].service_ids;
              updated[lineIndex].service_ids = services.includes(service_id)
                ? services.filter((id) => id !== service_id)
                : [...services, service_id];
              setFieldValue("items", updated);
            };
            console.log(values);
            const filteredItems = items.filter((item) =>
              item.name.toLowerCase().includes(values.search.toLowerCase())
            );
            return (
              <Form>
                <div className="p-6 space-y-6">
                  <Sham_Input
                    type="text"
                    Icon={SearchIcon}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    LabelImportant={false}
                    placeholder="Search Items"
                    name="search"
                    divClassName="border-1 border-gray-400"
                  />
                  <div className="grid grid-cols-2 gap-6">
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <div
                          key={item?.id}
                          className="border border-gray-400 rounded-lg p-3 shadow-lg cursor-pointer bg-white"
                          onClick={() => addOrderLine(item.id)}
                        >
                          <img
                            src={productsUrl + item?.image}
                            alt={item.name}
                            className="w-full h-32 object-contain rounded"
                          />
                          <h2 className="text-center mt-2 font-medium">
                            {item.name}
                          </h2>
                          <p className="text-xs text-center text-gray-500">
                            Click to add to order
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="col-span-2 text-center text-gray-500">
                        No items found.
                      </p>
                    )}
                  </div>
                  {values.items.length > 0 && (
                    <div className="mt-6 border-t pt-4">
                      <h2 className="text-lg font-medium">Order Details</h2>
                      {values.items.map((line, index) => {
                        const item = items.find((i) => i.id === line.item_id)!;
                        return (
                          <div
                            key={index}
                            className="relative border border-gray-400 rounded-lg p-3 mt-3 space-y-3 bg-white"
                          >
                            <button
                              type="button"
                              onClick={() => removeOrderLine(index)}
                              className="absolute top-0 right-2 text-gray-500 hover:text-red-600 text-4xl"
                            >
                              &times;
                            </button>

                            <div className="flex items-center gap-3">
                              <img
                                src={productsUrl + item?.image}
                                alt={item?.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <h3 className="font-medium">{item?.name}</h3>
                              <input
                                type="number"
                                min={1}
                                onChange={(e) =>
                                  updateQty(
                                    index,
                                    Math.max(1, parseInt(e.target.value) || 1)
                                  )
                                }
                                name={`items[${index}].quantity`}
                                className="border border-gray-400 rounded p-1 w-16 text-center"
                              />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {item?.prices?.map((service) => (
                                <button
                                  type="button"
                                  key={service.serviceId}
                                  className={`px-3 py-1 border border-gray-400 rounded ${
                                    line.service_ids.includes(service.serviceId)
                                      ? "bg-blue-200 border-blue-500"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    toggleService(index, service.serviceId)
                                  }
                                >
                                  {service.serviceName} ({priceSymbol + " "}
                                  {service.price})
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg ml-6"
                >
                  Place Order
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Sham_LoadingOverlay>
  );
};

export default AddOrder;
