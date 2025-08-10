/* eslint-disable react-hooks/exhaustive-deps */
import PriceComponent from "@/Components/PriceComponent";
import Sham_Alert from "@/Components/Sham_Alert";
import Sham_Input from "@/Components/Sham_Input";
import Sham_LoadingOverlay from "@/Components/Sham_LoadingOverlay";
import Sham_TextArea from "@/Components/Sham_TextArea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/hooks/useAlert";
import { API } from "@/lib/utils/Axios";
import type { ErrorResponse, SuccessResponse } from "@/lib/utils/Constants";
import type { Service } from "@/Tables/Services/services-columns";
import type { AxiosError } from "axios";
import { FieldArray, Form, Formik } from "formik";
import { FileIcon, ShirtIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

interface PriceEntry {
  serviceName: string;
  price: number;
}

interface AddItemFormData {
  name: string;
  description: string;
  prices: PriceEntry[];
  image: File | null;
}
const ItemDetails = () => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();
  const [services, setServices] = useState([] as Array<Service>);
  const [item, setItem] = useState({} as SuccessResponse<AddItemFormData>);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const initialValues: AddItemFormData = {
    name: "",
    description: "",
    prices: [
      {
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
        showAlert("success", response.data.message);
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

  const getItem = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/items/?id=${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const retreivedItem: SuccessResponse<AddItemFormData> = response.data;
        showAlert("success", response.data.message);
        setItem(retreivedItem);
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
    if (services) {
      getItem();
    }
  }, [services]);

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

  return (
    <Sham_LoadingOverlay loading={loading}>
      <div className="w-full h-full max-h-full bg-gray-200 overflow-auto">
        <Sham_Alert
          type={alert.type}
          message={alert.message}
          visible={alert.visible}
          onClose={hideAlert}
        />
        <div className="flex items-center justify-between ml-9">
          <h1 className="mt-6 text-2xl font-semibold text-dark-blue">
            Item Details
          </h1>
          {user?.role === "admin" && (
            <div className="flex gap-3 items-center mr-5 mt-6">
              <Button
                variant={"ghost"}
                className="border-1 border-gray-400 button-background-warning"
                onClick={() => navigate(`/items/edit/${id}`)}
              >
                Edit
              </Button>
              <Button className="border-1 border-gray-400 button-background-destructive ">
                Delete
              </Button>
            </div>
          )}
        </div>
        <hr className="border-t border-gray-400 mt-3" />
        <Formik
          initialValues={item.data || initialValues}
          validationSchema={addItemSchema}
          onSubmit={(values) => {
            console.log(values);
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
                    disabled={true}
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
                    disabled={true}
                  />
                </div>
                <div className="ml-9">
                  <h1 className="text-xl font-semibold text-dark-blue">
                    Services
                  </h1>
                </div>
                <hr className="border-t border-gray-400 mt-3" />
                <FieldArray name="prices">
                  {() => (
                    <>
                      {item?.data?.prices?.map((_, index) => (
                        <div key={index} className="mt-1 px-6 py-2 ml-3">
                          <PriceComponent
                            name={`prices.${index}`}
                            data={services}
                            Label="Service"
                            LabelImportant={true}
                            InputLabel="Price"
                            disabled={true}
                          />
                        </div>
                      ))}
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
                    disabled={true}
                  />
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Sham_LoadingOverlay>
  );
};

export default ItemDetails;
