import Sham_Input from "@/Components/Sham_Input";
import { Button } from "@/components/ui/button";
import { Form, Formik } from "formik";
import {
  AlertCircleIcon,
  Building,
  CheckCircle2Icon,
  MailIcon,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { API } from "@/lib/utils/Axios";
import * as Yup from "yup";
import "./colors.css";
import Sham_Select from "@/Components/Sham_Select";
import {
  Country,
  State,
  City,
  type ICountry,
  type IState,
  type ICity,
} from "country-state-city";
import React, { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import type { ErrorResponse, SuccessResponse } from "@/lib/utils/Constants";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Sham_LoadingOverlay from "@/Components/Sham_LoadingOverlay";
interface AddCustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: {
    country: string;
    state: string;
    city: string;
    street: string;
    building: string;
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

  const [countries, setCountries] = useState([] as Array<ICountry>);
  const [states, setStates] = useState([] as Array<IState>);
  const [cities, setCities] = useState([] as Array<ICity>);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState({} as SuccessResponse);

  const addCustomerSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").nullable(),
    phone: Yup.string().required("Phone is required").nonNullable(),
    address: Yup.object().shape({
      country: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      street: Yup.string(),
      building: Yup.string(),
    }),
  });

  const handleSubmit = async (
    formData: AddCustomerFormData,
    resetForm: () => void
  ) => {
    setIsError(false);
    setIsSuccess(false);
    try {
      const response = await API.post("/customers/create", formData, {
        withCredentials: true,
      });
      if (response.data.success) {
        setLoading(true);
        setTimeout(() => setLoading(false), 100);
        setCustomer(response.data);
        setIsSuccess(true);
        resetForm();
      }
    } catch (error) {
      const err = error as AxiosError;
      const errData = err?.response?.data as ErrorResponse;
      setIsError(true);
      setError(errData?.message || "Something Went Wrong");
    } finally {
      //setLoading(false);
    }
  };

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  return (
    <Sham_LoadingOverlay loading={loading}>
      <div className="w-full h-full bg-gray-200">
        {(isError || isSuccess) && (
          <Alert
            variant={isError ? "destructive" : "default"}
            className={`p-1 align-middle mr-5 ml-2  mt-2 w-auto ${
              isError && "border-red-300 text-red-800 bg-red-100"
            } ${isSuccess && "border-green-300 text-green-800 bg-green-100"}`}
          >
            {isError ? <AlertCircleIcon /> : <CheckCircle2Icon />}
            <AlertDescription>
              {isError
                ? error || "Something went wrong"
                : isSuccess
                ? customer?.message
                : ""}
            </AlertDescription>
          </Alert>
        )}
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
            handleSubmit(values, resetForm);
          }}
        >
          {({ handleChange, handleBlur, values }) => {
            const customHandleChange = (
              e: React.ChangeEvent<HTMLSelectElement>
            ) => {
              console.log(e.target);
              const { name } = e.target;
              if (name === "address.country") {
                const country = countries.find(
                  (c) => c.name === e.target.value
                ) as ICountry;
                const getStates = State.getStatesOfCountry(country.isoCode);
                if (getStates.length <= 0) {
                  console.log("CITY", City.getCitiesOfCountry(country.isoCode));
                  setCities(City.getCitiesOfCountry(country.isoCode));
                }
                setStates(getStates);
              } else if (name === "address.state") {
                const state = states.find(
                  (s) => s.name === e.target.value
                ) as IState;
                setCities(
                  City.getCitiesOfState(state.countryCode, state.isoCode)
                );
              }
              handleChange(e);
            };
            return (
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
                    data={countries}
                    onChange={customHandleChange}
                    onBlur={handleBlur}
                    name="address.country"
                    value={values.address.country}
                    Label={"Country"}
                  />
                  <Sham_Select
                    data={states}
                    onChange={customHandleChange}
                    onBlur={handleBlur}
                    name="address.state"
                    value={values.address.state}
                    Label={"State"}
                    disabled={states.length === 0}
                  />
                  <Sham_Select
                    data={cities}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="address.city"
                    value={values.address.city}
                    Label={"City"}
                    disabled={cities.length === 0}
                  />
                </div>
                <div className="px-6 flex ml-3 gap-24">
                  <Sham_Input
                    placeholder="Street"
                    type="text"
                    name="address.street"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.address.street}
                    Icon={MapPin}
                    divClassName="border-1 border-gray-400"
                    Label="Street"
                  />

                  <Sham_Input
                    placeholder="Building"
                    type="text"
                    name="address.building"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.address.building}
                    Icon={Building}
                    divClassName="border-1 border-gray-400"
                    Label="Street"
                  />
                </div>
                <div className="px-6 flex ml-3 gap-24 mt-3 ">
                  <Button type="submit" className="button-bg-dark-blue">
                    Add customer
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Sham_LoadingOverlay>
  );
};

export default AddCustomer;
