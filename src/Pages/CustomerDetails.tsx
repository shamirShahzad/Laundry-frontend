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
import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import type { ErrorResponse, SuccessResponse } from "@/lib/utils/Constants";
import Sham_LoadingOverlay from "@/Components/Sham_LoadingOverlay";
import { useParams } from "react-router-dom";
import { useAlert } from "@/hooks/useAlert";
import Sham_Alert from "@/Components/Sham_Alert";
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
const CustomerDetails = () => {
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
  const { alert, showAlert, hideAlert } = useAlert();
  const [customer, setCustomer] = useState<
    SuccessResponse<AddCustomerFormData>
  >({
    success: false,
    statusCode: "404",
    message: "Customer Not Found",
    data: initialValues,
  });
  const { id } = useParams();

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

  const getCustomer = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/customers/?id=${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const retreivedCustomer: SuccessResponse<AddCustomerFormData> =
          response.data;
        showAlert("success", response.data.message);
        setCustomer(retreivedCustomer);
        const selectedCountry = countries.find(
          (c) => c.name === retreivedCustomer.data.address.country
        );
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
    setCountries(Country.getAllCountries());
    getCustomer();
  }, []);

  return (
    <Sham_LoadingOverlay loading={loading}>
      <div className="w-full h-full bg-gray-200">
        <Sham_Alert
          type={alert.type}
          message={alert.message}
          visible={alert.visible}
          onClose={hideAlert}
        />
        <div className=" flex items-center justify-between ml-9">
          <h1 className="mt-6 text-2xl font-semibold text-dark-blue">
            Customer Details
          </h1>
          <div className="flex gap-3 items-center mr-5 mt-6">
            <Button
              variant={"ghost"}
              className="border-1 border-gray-400 button-background-warning"
            >
              Edit
            </Button>
            <Button className="border-1 border-gray-400 button-background-destructive ">
              Delete
            </Button>
          </div>
        </div>
        <hr className="border-t border-gray-400 mt-3" />
        <Formik
          initialValues={customer.data}
          validationSchema={addCustomerSchema}
          onSubmit={() => {}}
          enableReinitialize
        >
          {({ handleChange, handleBlur }) => {
            return (
              <Form>
                <div className="mt-1 p-6 flex ml-3 gap-24">
                  <Sham_Input
                    placeholder="Name"
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={customer?.data?.name}
                    divClassName="border-1 border-gray-400 "
                    Icon={User}
                    Label="Name"
                    LabelImportant={true}
                    disabled={true}
                  />
                  <Sham_Input
                    placeholder="Email"
                    type="email"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    Icon={MailIcon}
                    value={customer?.data?.email}
                    divClassName="border-1 border-gray-400 "
                    Label="E-mail"
                    disabled={true}
                  />
                  <Sham_Input
                    placeholder="Phone"
                    type="phone"
                    name="phone"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={customer?.data?.phone}
                    Icon={Phone}
                    divClassName="border-1 border-gray-400"
                    Label="Phone"
                    LabelImportant={true}
                    disabled={true}
                  />
                </div>
                <h1 className="text-xl font-semibold ml-9 text-dark-blue">
                  Address
                </h1>
                <hr className="border-t border-gray-400" />
                <div className="mt-1 p-6 flex ml-3 gap-24">
                  <Sham_Select
                    data={countries}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="address.country"
                    value={customer?.data?.address?.country}
                    Label={"Country"}
                    disabled={true}
                  />
                  <Sham_Select
                    data={states}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="address.state"
                    value={customer?.data?.address?.state}
                    Label={"State"}
                    disabled={true}
                  />
                  <Sham_Select
                    data={cities}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="address.city"
                    value={customer?.data?.address?.city}
                    Label={"City"}
                    disabled={true}
                  />
                </div>
                <div className="px-6 flex ml-3 gap-24">
                  <Sham_Input
                    placeholder="Street"
                    type="text"
                    name="address.street"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={customer?.data?.address?.city}
                    Icon={MapPin}
                    divClassName="border-1 border-gray-400"
                    Label="Street"
                    disabled={true}
                  />

                  <Sham_Input
                    placeholder="Building"
                    type="text"
                    name="address.building"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={customer?.data?.address?.building}
                    Icon={Building}
                    divClassName="border-1 border-gray-400"
                    Label="Street"
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

export default CustomerDetails;
