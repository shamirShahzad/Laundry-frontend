/* eslint-disable react-hooks/exhaustive-deps */
import PriceComponent from "@/Components/PriceComponent";
import Sham_Alert from "@/Components/Sham_Alert";
import Sham_Input from "@/Components/Sham_Input";
import Sham_LoadingOverlay from "@/Components/Sham_LoadingOverlay";
import Sham_TextArea from "@/Components/Sham_TextArea";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/hooks/useAlert";
import { API } from "@/lib/utils/Axios";
import type { ErrorResponse } from "@/lib/utils/Constants";
import type { Service } from "@/Tables/Services/services-columns";
import type { AxiosError } from "axios";
import { FieldArray, Form, Formik } from "formik";
import { FileIcon, PlusCircleIcon, ShirtIcon } from "lucide-react";
import { useEffect, useState } from "react";
import * as Yup from "yup";

interface PriceEntry {
  serviceId: string;
  serviceName: string;
  price: number;
}

interface AddItemFormData {
  name: string;
  description: string;
  prices: PriceEntry[];
  image: File | null;
}
const AddItems = () => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();
  const [services, setServices] = useState([] as Array<Service>);

  const initialValues: AddItemFormData = {
    name: "",
    description: "",
    prices: [
      {
        serviceId: "",
        serviceName: "",
        price: 0,
      },
    ],
    image: null,
  };

  const getServices = async () => {
    setLoading(true);
    try {
      const response = await API.get("/services", { withCredentials: true });
      if (response.data.success) {
        setServices(response.data.data);
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
    getServices();
  }, []);

  const addItemSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().nullable(),
    prices: Yup.array()
      .of(
        Yup.object().shape({
          serviceName: Yup.string().required("Service is required"),
          price: Yup.number()
            .min(0, "Price must be greater than 0")
            .required("Price is required"),
        })
      )
      .min(1, "At least one price is required")
      .required(),
    image: Yup.mixed()
      .required("Image is required")
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return false;
        return ["image/jpeg", "image/png", "image/jpg", "image/pjpeg"].includes(
          (value as File).type
        );
      })
      .test(
        "fileSize",
        "File too large, maximum 5MB allowed",
        (value) => !value || (value as File).size <= MAX_FILE_SIZE
      ),
  });

  const handleSubmit = async (formData: AddItemFormData) => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description || "");
      data.append("prices", JSON.stringify(formData.prices)); // stringified prices object
      if (formData.image) {
        data.append("image", formData.image); // only the file here
      }

      const response = await API.post("/items/create", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        showAlert("success", response.data.message);
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
          type={alert.type}
          message={alert.message}
          visible={alert.visible}
          onClose={hideAlert}
        />
        <div className="ml-9">
          <h1 className="mt-6 text-2xl font-semibold text-dark-blue">
            Add Items
          </h1>
        </div>
        <hr className="border-t border-gray-400 mt-3" />
        <Formik
          initialValues={initialValues}
          validationSchema={addItemSchema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ handleChange, handleBlur, values }) => {
            return (
              <Form>
                <div className="mt-1 px-6 py-3 ml-3 flex felx-col gap-30">
                  <Sham_Input
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    placeholder="Name"
                    name="name"
                    Label="Name"
                    LabelImportant={true}
                    type="text"
                    divClassName="border-1 border-gray-400"
                    containerClassName="flex-1"
                    Icon={ShirtIcon}
                  />
                  <Sham_Input
                    onBlur={handleBlur}
                    placeholder="Image"
                    id="image"
                    name="image"
                    Label="Image"
                    LabelImportant={true}
                    type="file"
                    divClassName="border-1 border-gray-400"
                    containerClassName="flex-1"
                    Icon={FileIcon}
                  />
                </div>
                <div className="ml-9">
                  <h1 className="text-xl font-semibold text-dark-blue">
                    Services
                  </h1>
                </div>
                <hr className="border-t border-gray-400 mt-3" />
                <FieldArray name="prices">
                  {({ push, remove }) => (
                    <>
                      {values.prices.map((_, index) => (
                        <div key={index} className="mt-1 px-6 py-2 ml-3">
                          <PriceComponent
                            name={`prices.${index}`}
                            data={services}
                            Label="Service"
                            LabelImportant={true}
                            InputLabel="Price"
                          />
                          {values.prices.length > 1 && (
                            <Button
                              type="button"
                              variant={"ghost"}
                              className="mt-2 border border-red-500 hover:bg-red-600 hover:text-white"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      <div className="flex mt-4 pb-6 ml-9">
                        <Button
                          type="button"
                          variant={"ghost"}
                          className="border border-blue-600 hover:bg-blue-700 hover:text-white"
                          onClick={() => push({ serviceName: "", price: 0 })}
                        >
                          <PlusCircleIcon size={18} />
                          Add Service Prices
                        </Button>
                      </div>
                    </>
                  )}
                </FieldArray>
                <hr className="border-t border-gray-400 mt-3" />
                <div className="mt-1 px-6 py-3 ml-3">
                  <Sham_TextArea
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                    name="description"
                    Label="Description"
                    LabelImportant={false}
                    rows={10}
                    className="resize-none"
                    divClassName="border-1 border-gray-400"
                  />
                </div>
                <div className="mt-1 px-6 pb-3 ml-3">
                  <Button type="submit">Add Item</Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Sham_LoadingOverlay>
  );
};

export default AddItems;
