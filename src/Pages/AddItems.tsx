import Sham_Alert from "@/Components/Sham_Alert";
import Sham_Input from "@/Components/Sham_Input";
import Sham_LoadingOverlay from "@/Components/Sham_LoadingOverlay";
import { useAlert } from "@/hooks/useAlert";
import { Form, Formik } from "formik";
import { ShirtIcon } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";

type PriceMap = Record<string, number>;
interface AddItemFormData {
  name: string;
  desciption: string;
  price: PriceMap;
  image: string;
}
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * AddItems is a component that displays a form to add a new item.
 * The form asks for the item's name, description, price, and image.
 * The component also displays a loading overlay and an alert
 * to show any error messages.
 */
/*******  330fcbba-04ed-4d22-9c30-dd2a26960768  *******/ const AddItems =
  () => {
    const [loading, isLoading] = useState(false);
    const { alert, showAlert, hideAlert } = useAlert();

    const initialValues = {
      name: "",
      description: "",
      price: {},
      image: "",
    };

    const addItemSchema = Yup.object().shape({
      name: Yup.string().required("Name is required"),
      description: Yup.string().nullable(),
      price: Yup.object()
        .test(
          "is-valid-price-map",
          "Price must be an object with number values",
          (value) => {
            if (typeof value != "object" || value === null) return false;
            return Object.values(value).every((v) => typeof v === "number");
          }
        )
        .required("Price is required"),
      image: Yup.string().required("Image is required"),
    });

    return (
      <Sham_LoadingOverlay loading={loading}>
        <div className="w-full h-full bg-gray-200">
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
              console.log(values);
            }}
          >
            {({ handleChange, handleBlur, values }) => {
              return (
                <Form>
                  <div className="mt-1 p-6 flex ml-3 gap-24">
                    <Sham_Input
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.name}
                      name="name"
                      Label="Name"
                      LabelImportant={true}
                      type="text"
                      divClassName="border-1 border-gray-400 "
                      Icon={ShirtIcon}
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

export default AddItems;
