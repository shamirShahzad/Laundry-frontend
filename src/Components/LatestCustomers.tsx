import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Address, Customer } from "@/Tables/Customers/customer-columns";
import "../Pages/colors.css";

interface LatestCustomersProps {
  className?: string;
  data: Customer[];
}
const LatestCustomers: React.FC<LatestCustomersProps> = ({
  className,
  data,
}) => {
  return (
    <Card className={`@container/card ${className}`}>
      <CardHeader>
        <CardTitle>Latest Customers</CardTitle>
        <CardDescription>The latest 10 Customers</CardDescription>
      </CardHeader>
      <CardContent className="overflow-y-auto">
        {data?.map((customer) => {
          const getAddress = () => {
            const address: Address = customer.address;
            if (
              address.country === "" &&
              address.state === "" &&
              address.city === "" &&
              address.street === "" &&
              address.building === ""
            ) {
              return <p className="text-dark-blue opacity-50 font-bold">N/A</p>;
            } else {
              return (
                <div className="flex flex-col">
                  <p className="text-dark-blue font-bold">
                    {customer.address.country
                      ? customer.address.country
                      : "N/A"}
                  </p>
                  <p>
                    {customer.address.state ? customer.address.state : "N/A"}
                  </p>
                  <p>{customer.address.city ? customer.address.city : "N/A"}</p>
                  <p>
                    {customer.address.street ? customer.address.street : "N/A"}
                  </p>
                  <p>
                    {customer.address.building
                      ? customer.address.building
                      : "N/A"}
                  </p>
                </div>
              );
            }
          };
          return (
            <div className="flex gap-2 w-full border border-gray-300 py-5 px-2 mt-1.5 rounded-md items-center">
              <div className="flex-col min-w-[150px]">
                <div className="font-bold text-dark-blue">{customer.name}</div>
                <div>{customer.phone}</div>
              </div>
              <div className="border-l p-3 border-gray-400 min-w-[150px] border-r overflow-x-scroll align-center">
                {customer.email}
              </div>
              <div className="min-w-[150px]">{getAddress()}</div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default LatestCustomers;
