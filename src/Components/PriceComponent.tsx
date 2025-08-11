import type { Service } from "@/Tables/Services/services-columns";
import { useField } from "formik";
import { useNavigate } from "react-router-dom";
interface PriceComponentProps {
  data: Service[];
  disabled?: boolean;
  name: string;
  Label: string;
  LabelImportant: boolean;
  InputLabel: string;
}

const PriceComponent: React.FC<PriceComponentProps> = ({
  data,
  disabled,
  name,
  Label,
  LabelImportant,
  InputLabel,
}) => {
  const [serviceField, serviceMeta, serviceHelpers] = useField(
    `${name}.serviceName`
  ); // serviceName field
  const [priceField, priceMeta] = useField(`${name}.price`);
  const [serviceIdField, , serviceIdhelpers] = useField(`${name}.serviceId`);
  const navigate = useNavigate();

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    serviceHelpers.setValue(selectedName);
    const selectedService = data.find(
      (service) => service.name === selectedName
    );
    if (selectedService) {
      serviceIdhelpers.setValue(selectedService.id);
    }
  };

  return (
    <div className={`flex gap-30 items-center ${disabled && "opacity-50"}`}>
      {/* Service Select */}
      <div className="flex-1">
        {Label && (
          <div className="flex items-center gap-1">
            <label htmlFor={serviceField.name}>{Label}</label>
            {LabelImportant && (
              <span className="text-red-600 text-3xl leading-none">*</span>
            )}
          </div>
        )}
        <select
          disabled={disabled}
          onChange={handleServiceChange}
          name={serviceField.name}
          onBlur={serviceField.onBlur}
          value={serviceField.value}
          className={`bg-white rounded p-2 border border-gray-400 w-full ${
            serviceMeta.touched && serviceMeta.error ? "border-red-500" : ""
          } `}
        >
          <option value="">Select a service</option>
          {data.length > 0 &&
            data.map((service) => (
              <option key={service.id} value={service.name}>
                {service.name}
              </option>
            ))}
          <option value="" onClick={() => navigate("/services/add")}>
            {" "}
            ➕ Add new service
          </option>
        </select>
        {serviceMeta.touched && serviceMeta.error && (
          <div className="text-red-600 text-xs mb-1">{serviceMeta.error}</div>
        )}
        <input type="hidden" {...serviceIdField} />
      </div>

      {/* Price Input */}
      <div className="flex-1">
        {InputLabel && (
          <div className="flex items-center gap-1">
            <label htmlFor={priceField.name}>{InputLabel}</label>
            {LabelImportant && (
              <span className="text-red-600 text-3xl leading-none">*</span>
            )}
          </div>
        )}
        <input
          type="number"
          disabled={serviceField.value === "" || disabled}
          {...priceField}
          className="bg-white rounded p-1.5 border border-gray-400 w-full disabled:bg-gray-100"
        />
        {priceMeta.touched && priceMeta.error && (
          <span className="text-red-600 text-xs mb-1">{priceMeta.error}</span>
        )}
      </div>
    </div>
  );
};

export default PriceComponent;
