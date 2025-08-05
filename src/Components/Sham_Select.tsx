import { useField } from "formik";

interface NamedEntity {
  name: string;
  isoCode?: string;
}
const Sham_Select = ({
  name,
  data,
  LabelImportant = false,
  Label,
  disabled,
  ...props
}: React.ComponentProps<"select"> & {
  name: string;
  data: NamedEntity[];
  LabelImportant?: boolean;
  Label: string | null;
}) => {
  const [field, meta] = useField(name);
  return (
    <div
      className={`flex flex-col gap-2 min-w-[260px] ${
        disabled && "opacity-50"
      }`}
    >
      {Label && (
        <div className="flex items-center gap-1">
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
        className={`max-w-[255px] border border-gray-400 rounded ${
          meta.touched && meta.error ? "border-red-600 mb-2" : ""
        }`}
      >
        <select
          className="bg-white p-2 rounded w-full"
          id={name}
          disabled={disabled}
          {...field}
          {...props}
        >
          <option value="">Select {name.split(".")[1]}</option>
          {data.map((item) => (
            <option key={item.isoCode || item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      {meta.touched && meta.error && (
        <div className="text-red-600 text-xs">{meta.error}</div>
      )}
    </div>
  );
};

export default Sham_Select;
