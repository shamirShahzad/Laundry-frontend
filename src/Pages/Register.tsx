// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
import Sham_Input from "@/Components/Sham_Input";
import "./Register.css";
import { CircleUserRound, Lock, Mail, Smartphone } from "lucide-react";
const Register = () => {
  // const initialValues = {
  //   name: "",
  //   email: "",
  //   password: "",
  //   phone: "",
  // };
  return (
    <div className="content flex w-full justify-center items-center align-middle">
      <div className="w-150 h-120 shadow rounded-3xl flex flex-col items-center">
        <h1 className="font-bold text-5xl mt-5">Register</h1>
        <form className="mt-10 p-6 gap-4">
          <Sham_Input
            placeholder="Name"
            type="text"
            name="name"
            Icon={CircleUserRound}
          />
          <Sham_Input
            placeholder="Email"
            type="email"
            name="email"
            Icon={Mail}
          />
          <Sham_Input
            placeholder="Password"
            type="password"
            name="password"
            Icon={Lock}
          />
          <Sham_Input
            placeholder="Phone"
            type="text"
            name="phone"
            inputMode="numeric"
            pattern="[0-9]"
            Icon={Smartphone}
          />
        </form>
      </div>
    </div>
  );
};

export default Register;
