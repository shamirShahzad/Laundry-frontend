import { Formik, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { API } from "@/lib/utils/Axios";
import Sham_Input from "@/Components/Sham_Input";
import "./Register.css";
import {
  AlertCircleIcon,
  CircleUserRound,
  Loader2Icon,
  Lock,
  Mail,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "@/lib/utils/Constants";
const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const initialValues = {
    name: "",
    email: "",
    password: "",
    phone: "",
  };
  const registerSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    phone: Yup.string()
      .matches(/^\d+$/, "Phone must only contain numbers")
      .required("Phone is required"),
  });

  interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    phone: string;
  }

  const handleRegister = async (
    formData: RegisterFormData,
    resetForm: () => void
  ) => {
    setIsError(false);
    setLoading(true);
    try {
      const response = await API.post("/users/register", formData);
      if (response?.data?.success === true) {
        setLoading(false);
        resetForm();
        navigate("/");
        return;
      }
    } catch (error) {
      const err = error as AxiosError;
      const errorData = err?.response?.data as ErrorResponse;
      setIsError(true);
      setErrorMessage(errorData?.message);
      resetForm();
      setLoading(false);
    }
  };
  return (
    <div className="content flex flex-col  w-full justify-center items-center">
      <h1 className="font-bold text-5xl mb-5 heading">Laundry Pos</h1>
      <div className="w-120 h-120 shadow rounded-3xl flex flex-col items-center">
        <h1 className="font-bold text-5xl mt-5 heading">Register</h1>
        {isError && (
          <Alert
            variant="destructive"
            className="p-1 align-middle w-70 border-red-300 text-red-800 bg-red-100 mt-2"
          >
            <AlertCircleIcon />
            <AlertDescription>
              {errorMessage ? errorMessage : "Something went wrong"}
            </AlertDescription>
          </Alert>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          onSubmit={async (values, { resetForm }) => {
            await handleRegister(values, resetForm);
          }}
        >
          {({ handleChange, handleBlur, values }) => (
            <Form className="mt-2 p-6 gap-4 ">
              <Sham_Input
                placeholder="Name"
                type="text"
                name="name"
                Icon={CircleUserRound}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
              />

              <Sham_Input
                placeholder="Email"
                type="email"
                name="email"
                Icon={Mail}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              <Sham_Input
                placeholder="Password"
                type="password"
                name="password"
                Icon={Lock}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                isPassword={true}
                divClassName="w-full important"
              />
              <Sham_Input
                placeholder="Phone"
                type="text"
                name="phone"
                inputMode="numeric"
                pattern="^\d+$"
                Icon={Smartphone}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phone}
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full text-1xl font-bold uppercase bg-cyan-950"
              >
                {loading && <Loader2Icon className="animate-spin" />}
                {loading ? "Loading..." : "Submit"}
              </Button>
              <p className="font-bold text-sky-900 text-start w-full mt-4 text-xs">
                Already have an account?{" "}
                <Link to="/" className="underline">
                  Click Here.
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
