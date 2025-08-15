/* eslint-disable react-hooks/exhaustive-deps */
import Sham_Alert from "@/Components/Sham_Alert";
import Sham_Input from "@/Components/Sham_Input";
import Sham_LoadingOverlay from "@/Components/Sham_LoadingOverlay";
import Sham_TextArea from "@/Components/Sham_TextArea";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/hooks/useAlert";
import { API } from "@/lib/utils/Axios";
import "./colors.css";
import {
  priceSymbol,
  productsUrl,
  type ErrorResponse,
} from "@/lib/utils/Constants";
import type { Customer } from "@/Tables/Customers/customer-columns";
import type { Item } from "@/Tables/Items/item-columns";
import type { AxiosError } from "axios";
import { Form, Formik } from "formik";
import { BanknoteIcon, PlusCircleIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddOrder = () => {
  interface OrderLine {
    item_id: string;
    service_ids: string[];
    quantity: number;
    amount: number;
  }

  interface FormData {
    search: string;
    cust_id: number | undefined;
    items: OrderLine[];
    notes: string;
    paid_amount: string;
    total: number;
  }

  const initialValues: FormData = {
    search: "",
    cust_id: undefined,
    items: [],
    paid_amount: "",
    total: 0,
    notes: "",
  };

  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const [items, setItems] = useState([] as Array<Item>);
  const [customers, setCustomers] = useState([] as Array<Customer>);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

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

  const getCustomers = async () => {
    setLoading(true);
    try {
      const response = await API.get("/customers");
      if (response.data.success) {
        setCustomers(response.data.data);
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
    getCustomers();
  }, []);

  const handleSubmit = async (formData: FormData, resetForm: () => void) => {
    setLoading(true);
    try {
      //Make cust_id to a number from string
      formData.cust_id = Number(formData.cust_id);
      const response = await API.post("/orders/create", formData, {
        withCredentials: true,
      });
      if (response.data.success) {
        showAlert("success", response.data.message);
        resetForm();
      }
    } catch (error) {
      const err = error as AxiosError;
      const errData = err?.response?.data as ErrorResponse;
      showAlert(
        "error",
        errData?.message || err?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

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
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values, resetForm);
          }}
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
                  amount: 0,
                },
              ]);
            };

            const updateQty = (lineIndex: number, quantity: number) => {
              const updated = [...values.items];
              updated[lineIndex].quantity = quantity;

              if (updated[lineIndex].service_ids.length > 0) {
                const item = items.find(
                  (i) => i.id === updated[lineIndex].item_id
                );

                if (item && quantity > 0) {
                  const totalPrice = item.prices
                    .filter((p) =>
                      updated[lineIndex].service_ids.includes(p.serviceId)
                    )
                    .reduce((sum, p) => sum + p.price, 0);
                  updated[lineIndex].amount = totalPrice * quantity;
                } else {
                  updated[lineIndex].amount = 0;
                }
              } else {
                updated[lineIndex].amount = 0;
              }
              const total = updated.reduce((sum, line) => sum + line.amount, 0);
              setFieldValue("total", total);
              setTotalAmount(total);
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

              if (updated[lineIndex].service_ids.length > 0) {
                const item = items.find(
                  (i) => i.id === updated[lineIndex].item_id
                );
                if (item && updated[lineIndex].quantity > 0) {
                  const totalPrice = item.prices
                    .filter((p) =>
                      updated[lineIndex].service_ids.includes(p.serviceId)
                    )
                    .reduce((sum, p) => sum + p.price, 0);
                  updated[lineIndex].amount =
                    totalPrice * updated[lineIndex].quantity;
                } else {
                  updated[lineIndex].amount = 0;
                }
              }
              const total = updated.reduce((sum, line) => sum + line.amount, 0);
              setFieldValue("total", total);
              setTotalAmount(total);
              setFieldValue("items", updated);
            };
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
                  <div className="flex justify-stretch  items-center w-full">
                    <div className="flex-1">
                      <label htmlFor="cust_id">
                        Customer{" "}
                        <span className="text-red-600 text-3xl border-box leading-none">
                          *
                        </span>
                      </label>
                      <select
                        id="cust_id"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="cust_id"
                        className="w-full border-1 border-gray-400 bg-white p-2 rounded mt-2"
                      >
                        <option value="">Select Customer</option>
                        {customers.length > 0 &&
                          customers.map((customer, index) => (
                            <option key={index} value={customer.id}>
                              {customer.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <Button
                      type="button"
                      variant={"ghost"}
                      onClick={() => {
                        navigate("/customers/add");
                      }}
                      className="ml-2 border border-blue-700 hover:bg-blue-700 hover:text-white flex gap-2 mt-10 flex-0.5"
                    >
                      Add Customer
                      <PlusCircleIcon className="w-4 h-4" />
                    </Button>
                  </div>

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
                  <div className="flex gap-10 justify-start items-center">
                    <Sham_Input
                      name="paid_amount"
                      Label={"Paid Amount"}
                      LabelImportant={true}
                      type="number"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      Icon={BanknoteIcon}
                      divClassName="border-1 border-gray-400"
                      onKeyDown={(e) => {
                        const allowedKeys = [
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                          "Tab",
                        ];

                        // Allow control keys
                        if (allowedKeys.includes(e.key)) return;

                        // Allow only one decimal point
                        if (e.key === ".") {
                          if (values.paid_amount.includes(".")) {
                            e.preventDefault();
                          }
                          return;
                        }

                        // Block anything that's not a digit
                        if (!/^[0-9]$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <div className="text-2xl font-bold w-1/2 text-dark-blue">{`Total Amount: ${priceSymbol} ${totalAmount}`}</div>
                  </div>
                  <Sham_TextArea
                    name="notes"
                    Label={"Notes"}
                    LabelImportant={false}
                    rows={5}
                    className="resize-none"
                    divClassName="border-1 border-gray-400"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg ml-6 mb-2"
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
