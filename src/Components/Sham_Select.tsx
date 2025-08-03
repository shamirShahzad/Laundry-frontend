import { useField } from "formik";

interface NamedEntity {
  name: string;
  isoCode: string;
}
const Sham_Select = ({
  name,
  data,
  LabelImportant = false,
  Label,
  ...props
}: React.ComponentProps<"select"> & {
  name: string;
  data: NamedEntity[];
  LabelImportant?: boolean;
  Label: string | null;
}) => {
  const handleChange = () => {
    field.onChange(field.value);
  };

  const [field] = useField(name);
  return (
    <div className="flex flex-col gap-2">
      {Label && (
        <div className="flex items-center gap-1 min-h-[32px]">
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
      <div className="max-w-[250px] border border-gray-400 rounded">
        <select
          className="bg-white p-2 rounded w-full"
          id={name}
          onChange={handleChange}
          {...props}
        >
          {data.map((item) => (
            <option key={item.isoCode} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Sham_Select;
