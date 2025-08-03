import Sham_Input from "@/Components/Sham_Input";
import { Button } from "@/components/ui/button";
import { Form, Formik } from "formik";
import { MailIcon, Phone, User } from "lucide-react";
import * as Yup from "yup";
import "./colors.css";
import Sham_Select from "@/Components/Sham_Select";
import { Country, State, City } from "country-state-city";
import { useState } from "react";
interface AddCustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: {
    city: string;
    street: string;
    building: string;
    country: string;
  };
}
const AddCustomer = () => {
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    address: {
      country: "",
      state: "",
      city: "",
      street: "",
      building: "",
    },
  };

  const addCustomerSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").nullable(),
    phone: Yup.string().required("Phone is required").nonNullable(),
    address: Yup.object().shape({
      // city: Yup.string().required("City is required"),
      // street: Yup.string().required("Street is required"),
      // building: Yup.string().required("Building is required"),
      state: Yup.string().required("State is required"),
      country: Yup.string().required("Country is required"),
    }),
  });

  const handleSubmit = (formData: AddCustomerFormData) => {
    console.log(formData);
  };

  return (
    <div className="w-full h-full bg-gray-200">
      <div className="ml-9">
        <h1 className="mt-6 text-2xl font-semibold text-dark-blue">
          Add customer
        </h1>
      </div>
      <hr className="border-t border-gray-400 mt-3" />
      <Formik
        initialValues={initialValues}
        validationSchema={addCustomerSchema}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values);
          resetForm();
        }}
      >
        {({ handleChange, handleBlur, values }) => (
          <Form>
            <div className="mt-1 p-6 flex ml-3 gap-24">
              <Sham_Input
                placeholder="Name"
                type="text"
                name="name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                divClassName="border-1 border-gray-400 "
                Icon={User}
                Label="Name"
                LabelImportant={true}
              />
              <Sham_Input
                placeholder="Email"
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                Icon={MailIcon}
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
                Icon={Phone}
                divClassName="border-1 border-gray-400"
                Label="Phone"
                LabelImportant={true}
              />
            </div>
            <h1 className="text-xl font-semibold ml-9 text-dark-blue">
              Address
            </h1>
            <hr className="border-t border-gray-400" />
            <div className="mt-1 p-6 flex ml-3 gap-24">
              <Sham_Select
                data={Country.getAllCountries()}
                onChange={handleChange}
                onBlur={handleBlur}
                name="address.country"
                value={values.address.country}
                Label={"Country"}
                LabelImportant={true}
              />
              <Sham_Select
                data={Country.getAllCountries()}
                onChange={handleChange}
                onBlur={handleBlur}
                name="address.state"
                value={values.address.state}
                Label={"State"}
                LabelImportant={true}
              />
            </div>
            <Button type="submit">Add customer</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddCustomer;
