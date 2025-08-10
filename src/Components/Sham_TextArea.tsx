import { type LucideIcon } from "lucide-react";
import { useField } from "formik";
import "./Sham_Input.css";
const Sham_TextArea = ({
  className,
  name,
  children,
  Icon = null,
  divClassName,
  Label = null,
  LabelImportant = false,
  ...props
}: React.ComponentProps<"textarea"> & {
  Icon?: LucideIcon | null;
  isPassword?: boolean;
  isPasswordVisible?: boolean;
  divClassName?: string;
  Label?: string | null;
  LabelImportant?: boolean;
}) => {
  const [field, meta] = useField(name);
  const hasIcon = Icon !== null ? true : false;
  const inputClass = `${hasIcon ? "shamInputIcon" : "shamInput"} ${className} ${
    props.disabled && "opacity-50"
  }`;
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
          <textarea
            className={inputClass}
            {...props}
            {...field}
            disabled={props.disabled}
          >
            {children}
          </textarea>
        </div>
        {meta.touched && meta.error && (
          <div className="text-red-600 text-xs mb-1">{meta.error}</div>
        )}
      </div>
    </>
  );
};

export default Sham_TextArea;
