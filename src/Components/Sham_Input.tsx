import { CircleUserRound, type LucideIcon } from "lucide-react";
import "./Sham_Input.css";
const Sham_Input = ({
  type,
  className,
  name,
  children,
  Icon = CircleUserRound,
  ...props
}: React.ComponentProps<"input"> & {
  Icon?: LucideIcon;
}) => {
  return (
    <div className="flex shamInputContainer justify-center items-center">
      <Icon strokeWidth={0.75} className="mr-1" />
      <input
        type={type}
        name={name}
        className={`shamInput ${className}`}
        {...props}
      >
        {children}
      </input>
    </div>
  );
};

export default Sham_Input;
