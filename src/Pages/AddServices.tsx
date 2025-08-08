import Sham_Alert from "@/Components/Sham_Alert";
import Sham_Input from "@/Components/Sham_Input";
import Sham_LoadingOverlay from "@/Components/Sham_LoadingOverlay";
import Sham_TextArea from "@/Components/Sham_TextArea";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/hooks/useAlert";
import { API } from "@/lib/utils/Axios";
import type { ErrorResponse } from "@/lib/utils/Constants";
import type { AxiosError } from "axios";
import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
interface AddServiceFormData {
  name: string;
  description: string;
}
const AddServices = () => {
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();
  const addServiceSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().nullable(),
  });

  const initialValues = {
    name: "",
    description: "",
  };

  const handleSubmit = async (
    formData: AddServiceFormData,
    resetForm: () => void
  ) => {
    setLoading(true);
    try {
      const response = await API.post("/services/create", formData, {
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
      <div className="w-full h-full bg-gray-200">
        <Sham_Alert
          type={alert.type}
          message={alert.message}
          onClose={hideAlert}
          visible={alert.visible}
        />
        <div className="ml-9">
          <h1 className="mt-6 text-2xl font-semibold text-dark-blue">
            Add service
          </h1>
        </div>
        <hr className="border-t border-gray-400 mt-3" />
        <Formik
          initialValues={initialValues}
          validationSchema={addServiceSchema}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values, resetForm);
          }}
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
                  />
                  <Button>Add Service</Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Sham_LoadingOverlay>
  );
};

export default AddServices;
