import { Formik, Form } from "formik";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import Sham_Input from "@/Components/Sham_Input";
import "./Register.css";
import { AlertCircleIcon, Loader2Icon, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { API } from "@/lib/utils/Axios";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "@/lib/utils/Constants";
import { useAuth } from "@/context/AuthContext";
const Login = () => {
  interface LoginFormData {
    email: string;
    password: string;
  }
  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const initialValues = {
    email: "",
    password: "",
  };
  const loginSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleLogin = async (
    formData: LoginFormData,
    resetForm: () => void
  ) => {
    setIsError(false);
    setLoading(true);
    try {
      const response = await API.post("/users/login", formData);
      if (response.data.success === true) {
        await auth.login();
        resetForm();
        navigate("/dashboard");
      }
    } catch (error) {
      const err = error as AxiosError;
      const errorData = err?.response?.data as ErrorResponse;
      setIsError(true);
      setErrorMessage(errorData?.message || "Something went wrong");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content flex flex-col  w-full justify-center items-center">
      <h1 className="font-bold text-5xl mb-20 heading">Laundry Pos</h1>
      <div className="w-100 h-80 shadow rounded-3xl flex flex-col items-center">
        <h1 className="font-bold text-5xl mt-5 heading">Login</h1>
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
          validationSchema={loginSchema}
          onSubmit={(values, { resetForm }) => {
            handleLogin(values, resetForm);
          }}
        >
          {({ handleChange, handleBlur, values }) => (
            <Form className="mt-1 p-6 gap-4 ">
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
              />
              <Button
                type="submit"
                className="w-full text-1xl font-bold uppercase bg-cyan-950"
                disabled={loading}
              >
                {loading && <Loader2Icon className="animate-spin" />}
                {loading ? "Loading..." : "Login"}
              </Button>
              <p className="font-bold text-sky-900 text-start w-full mt-4 text-xs">
                Don't have an account?{" "}
                <Link to="/register" className="underline">
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

export default Login;
