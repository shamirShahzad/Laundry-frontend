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
    <div className="w-full h-full bg-cyan-100">
      <Formik
        initialValues={initialValues}
        validationSchema={addCustomerSchema}
        onSubmit={(values, { resetForm }) => {
          console.log(values, resetForm);
        }}
      >
        {({ handleChange, handleBlur, values }) => (
          <Form className="mt-1 p-6 gap-4 ">
            <Sham_Input
              placeholder="Name"
              type="text"
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              divClassName="border-1 border-gray-100 "
            />
            <Sham_Input
              placeholder="Email"
              type="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            <Button
              type="submit"
              className="w-full text-1xl font-bold uppercase bg-cyan-950"
            >
              Add Customer
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddCustomer;
