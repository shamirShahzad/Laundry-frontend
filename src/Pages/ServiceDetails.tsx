/* eslint-disable react-hooks/exhaustive-deps */
import Sham_Alert from "@/Components/Sham_Alert";
import Sham_Input from "@/Components/Sham_Input";
import Sham_LoadingOverlay from "@/Components/Sham_LoadingOverlay";
import Sham_TextArea from "@/Components/Sham_TextArea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/hooks/useAlert";
import { API } from "@/lib/utils/Axios";
import type { ErrorResponse, SuccessResponse } from "@/lib/utils/Constants";
import type { AxiosError } from "axios";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
interface AddServiceFormData {
  name: string;
  description: string;
}
const ServiceDetails = () => {
  const initialValues = {
    name: "",
    description: "",
  };
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState<SuccessResponse<AddServiceFormData>>({
    success: false,
    statusCode: "404",
    message: "Service Not Found",
    data: initialValues,
  });

  const { alert, showAlert, hideAlert } = useAlert();
  const addServiceSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().nullable(),
  });
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const getService = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/services/?id=${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const retreivedService: SuccessResponse<AddServiceFormData> =
          response.data;
        showAlert("success", response.data.message);
        setService(retreivedService);
      }
    } catch (error) {
      const err = error as AxiosError;
      const errData = err?.response?.data as ErrorResponse;
      showAlert(
        "error",
        errData?.message || err?.message || "Something Went Wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getService();
  }, []);

  return (
    <Sham_LoadingOverlay loading={loading}>
      <div className="w-full h-full bg-gray-200">
        <Sham_Alert
          type={alert.type}
          message={alert.message}
          onClose={hideAlert}
          visible={alert.visible}
        />
        <div className="flex items-center justify-between ml-9">
          <h1 className="mt-6 text-2xl font-semibold text-dark-blue">
            Service Details
          </h1>
          {user?.role === "admin" && (
            <div className="flex gap-3 items-center mr-5 mt-6">
              <Button
                variant={"ghost"}
                className="border-1 border-gray-400 button-background-warning"
                onClick={() => navigate(`/services/edit/${id}`)}
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
          initialValues={service.data}
          validationSchema={addServiceSchema}
          onSubmit={() => {}}
        >
          {({ handleBlur, handleChange, values }) => {
            return (
              <Form>
                <div className="mt-1 p-6 ml-3">
                  <Sham_Input
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    name="name"
                    divClassName="border-1 border-gray-400"
                    LabelImportant={true}
                    Label="Name"
                    type="text"
                    disabled={true}
                  />
                  <Sham_TextArea
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    name="description"
                    className="resize-none"
                    Label="Description"
                    rows={7}
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

export default ServiceDetails;
