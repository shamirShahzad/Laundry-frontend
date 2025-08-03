import Sham_Input from "@/Components/Sham_Input";
import { Button } from "@/components/ui/button";
import { Form, Formik } from "formik";
import * as Yup from "yup";

const AddCustomer = () => {
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    address: {
      city: "",
      street: "",
      buiilding: "",
      country: "",
    },
  };

  const addCustomerSchema = {
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").nullable(),
    phone: Yup.string().required("Phone is required").nonNullable(),
    address: Yup.object().shape({
      city: Yup.string().required("City is required"),
      street: Yup.string().required("Street is required"),
      building: Yup.string().required("Building is required"),
      country: Yup.string().required("Country is required"),
    }),
  };

  return (
    <div className="w-full h-full bg-gray-200">
      <div className="ml-9">
        <h1 className="mt-6 text-2xl font-semibold">Add customer</h1>
      </div>
      <hr className="border-b border-gray-400 mt-3" />
      <Formik
        initialValues={initialValues}
        validationSchema={addCustomerSchema}
        onSubmit={(values, { resetForm }) => {
          console.log(values, resetForm);
        }}
      >
        {({ handleChange, handleBlur, values }) => (
          <Form className="mt-1 p-6 gap-4 flex ml-3">
            <Sham_Input
              placeholder="Name"
              type="text"
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              divClassName="border-1 border-gray-400 "
              Label="Name"
              LabelImportant={true}
            />
            <Sham_Input
              placeholder="Email"
              type="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              divClassName="border-1 border-gray-400 "
              Label="E-mail"
            />
            <Sham_Input
              placeholder="Phone"
              type="phone"
              name="phone"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.phone}
              divClassName="border-1 border-gray-400 w-fit"
              Label="Phone"
              LabelImportant={true}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddCustomer;
