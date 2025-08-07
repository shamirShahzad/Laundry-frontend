/* eslint-disable react-hooks/exhaustive-deps */
import Sham_Input from "@/Components/Sham_Input";
import { Button } from "@/components/ui/button";
import { Form, Formik } from "formik";
import { Building, MailIcon, MapPin, Phone, User } from "lucide-react";
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
import Sham_LoadingOverlay from "@/Components/Sham_LoadingOverlay";
import { useAlert } from "@/hooks/useAlert";
import Sham_Alert from "@/Components/Sham_Alert";
import { useParams } from "react-router-dom";
interface EditCustomerFormData {
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
const EditCustomer = () => {
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
  const [customer, setCustomer] = useState<
    SuccessResponse<EditCustomerFormData>
  >({
    success: false,
    statusCode: "404",
    message: "Customer Not Found",
    data: initialValues,
  });
  const { id } = useParams();
  const { alert, showAlert, hideAlert } = useAlert();

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

  const handleSubmit = async (formData: EditCustomerFormData) => {
    try {
      const response = await API.post(`/customers/update/${id}`, formData, {
        withCredentials: true,
      });
      if (response.data.success) {
        setLoading(true);
        showAlert("success", response.data.message);
        await getCustomer();
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

  const getCustomer = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/customers/?id=${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const retreivedCustomer: SuccessResponse<EditCustomerFormData> =
          response.data;
        showAlert("success", response.data.message);
        setCustomer(retreivedCustomer);
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

  const setStateAndCity = (
    selectedCountry: ICountry | undefined,
    retreivedCustomer: SuccessResponse<EditCustomerFormData>
  ) => {
    if (selectedCountry === undefined) return;
    const myStates = State.getStatesOfCountry(selectedCountry?.isoCode);
    setStates(myStates);
    const selectedState = myStates.find(
      (s) => s.name === retreivedCustomer.data.address.state
    );
    if (myStates.length <= 0 && selectedCountry !== undefined) {
      setCities(City.getCitiesOfCountry(selectedCountry?.isoCode));
    } else if (selectedState !== undefined) {
      setCities(
        City.getCitiesOfState(
          selectedState?.countryCode,
          selectedState?.isoCode
        )
      );
    }
  };

  useEffect(() => {
    if (countries.length > 0) {
      getCustomer();
    }
  }, [countries]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    console.log("CUSt", customer);
    if (customer.data.address.country) {
      const selectedCountry = countries.find(
        (c) => c.name === customer.data.address.country
      );
      setStateAndCity(selectedCountry, customer);
    }
  }, [customer]);

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
            Edit customer
          </h1>
        </div>
        <hr className="border-t border-gray-400 mt-3" />
        <Formik
          initialValues={customer.data}
          validationSchema={addCustomerSchema}
          onSubmit={(values) => {
            handleSubmit(values);
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
                    Submit
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

export default EditCustomer;
