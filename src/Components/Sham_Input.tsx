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
  containerClassName,
  ...props
}: React.ComponentProps<"input"> & {
  Icon?: LucideIcon | null;
  isPassword?: boolean;
  isPasswordVisible?: boolean;
  divClassName?: string;
  Label?: string | null;
  LabelImportant?: boolean;
  containerClassName?: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [field, meta, helpers] = useField(name);
  const [fileName, setFileName] = useState("");
  const hasIcon = Icon !== null ? true : false;
  const inputClass = `${hasIcon ? "shamInputIcon" : "shamInput"} ${className}`;
  const fieldProps =
    type === "file" ? { name: field.name, onBlur: field.onBlur } : field;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFileName(file.name);
      helpers.setValue(file);
    }
  };

  return (
    <>
      <div
        className={`flex-col justify-start ${containerClassName} ${
          props.disabled && "opacity-50"
        }`}
      >
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
          {type === "file" ? (
            <div className="flex w-full items-center justify-between">
              <label
                htmlFor={name}
                className="px-3 py-[1px] border-l border-gray-400 order-1 cursor-pointer  hover:bg-gray-200"
              >
                Select File
                <input
                  type="file"
                  id={name}
                  hidden
                  className={inputClass}
                  {...props}
                  onChange={handleFileChange}
                  {...fieldProps}
                >
                  {children}
                </input>
              </label>
              <span className="text-sm text-gray-600 truncate flex-1 border-l border-gray-400 pl-1">
                {fileName || "No file selected"}
              </span>
            </div>
          ) : (
            <input
              type={showPassword && isPassword ? "text" : type}
              className={inputClass}
              {...props}
              {...fieldProps}
            >
              {children}
            </input>
          )}
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
