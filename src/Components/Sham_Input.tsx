import { CircleUserRound, Eye, EyeClosed, type LucideIcon } from "lucide-react";
import { useField } from "formik";
import "./Sham_Input.css";
import { useState } from "react";

const Sham_Input = ({
  type,
  className,
  name,
  children,
  Icon = CircleUserRound,
  isPassword = false,
  ...props
}: React.ComponentProps<"input"> & {
  Icon?: LucideIcon;
  isPassword?: boolean;
  isPasswordVisible?: boolean;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [field, meta] = useField(name);
  return (
    <>
      <div
        className={`flex shamInputContainer justify-center items-center ${
          meta.touched && meta.error ? "border-red-600 mb-2" : "mb-5"
        }`}
      >
        <Icon strokeWidth={0.75} className="mr-1" />
        <input
          type={showPassword && isPassword ? "text" : type}
          className={`shamInput ${className}`}
          {...props}
          {...field}
        >
          {children}
        </input>
        {isPassword ? (
          showPassword ? (
            <Eye
              strokeWidth={0.75}
              onClick={() => setShowPassword(!showPassword)}
            />
          ) : (
            <EyeClosed
              strokeWidth={0.75}
              onClick={() => setShowPassword(!showPassword)}
            />
          )
        ) : (
          <></>
        )}
      </div>
      {meta.touched && meta.error && (
        <div className="text-red-600 text-xs mb-1">{meta.error}</div>
      )}
    </>
  );
};

export default Sham_Input;
