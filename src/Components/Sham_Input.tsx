import { Eye, EyeClosed, type LucideIcon } from "lucide-react";
import { useField } from "formik";
import "./Sham_Input.css";
import { useState } from "react";

const Sham_Input = ({
  type,
  className,
  name,
  children,
  Icon = null,
  isPassword = false,
  divClassName,
  Label = null,
  LabelImportant = false,
  ...props
}: React.ComponentProps<"input"> & {
  Icon?: LucideIcon | null;
  isPassword?: boolean;
  isPasswordVisible?: boolean;
  divClassName?: string;
  Label?: string | null;
  LabelImportant?: boolean;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [field, meta] = useField(name);
  const hasIcon = Icon !== null ? true : false;
  const inputClass = `${hasIcon ? "shamInputIcon" : "shamInput"} ${className}`;
  return (
    <>
      <div className="flex-col justify-start">
        {Label && (
          <div
            className={`flex items-center gap-1 min-h-[32px] ${
              props.disabled && "opacity-50"
            }`}
          >
            <label htmlFor={name}>{Label} </label>
            {LabelImportant ? (
              <span className="text-red-600 text-3xl border-box leading-none">
                *
              </span>
            ) : (
              <span className="text-2xl"></span>
            )}
          </div>
        )}
        <div
          className={`flex shamInputContainer justify-between items-center ${
            meta.touched && meta.error ? "border-red-600 mb-2" : "mb-5"
          } ${divClassName}`}
        >
          {Icon && <Icon strokeWidth={0.75} className="mr-1" />}
          <input
            type={showPassword && isPassword ? "text" : type}
            className={inputClass}
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
                className="cursor-pointer"
              />
            ) : (
              <EyeClosed
                strokeWidth={0.75}
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              />
            )
          ) : (
            <></>
          )}
        </div>
        {meta.touched && meta.error && (
          <div className="text-red-600 text-xs mb-1">{meta.error}</div>
        )}
      </div>
    </>
  );
};

export default Sham_Input;
