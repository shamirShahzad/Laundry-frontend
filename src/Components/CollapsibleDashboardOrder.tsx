import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Order } from "@/Tables/Orders/order-columns";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import "../Pages/colors.css";
import { PaymentStatus, Status } from "@/lib/utils/Constants";
import SubRow from "./SubRow";
import "./CollapsibleDashboardOrder.css";

interface Props {
  order: Order;
}

const CollapsibleDashboardOrder: React.FC<Props> = ({ order }) => {
  const getDateString = (date: Date) => {
    const newDate = new Date(date);
    const day = String(newDate.getDate()).padStart(2, "0");
    const month = String(newDate.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const year = newDate.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const [open, setOpen] = useState(false);
  return (
    <Collapsible
      key={order.id}
      className="w-full"
      open={open}
      onOpenChange={setOpen}
    >
      <div className="flex gap-2 w-full border border-gray-300 py-5 mt-1.5 rounded-ss-md rounded-se-md">
        <div className="flex gap-10 w-[90%] pl-3  items-center justify-around">
          <div className="flex-col gap-2 max-w-[100px]">
            <p className="text-[#2a4352] font-bold">{order.cust_name}</p>
            <p className="text-[#2a4352] font-bold">{order.cust_phone}</p>
          </div>
          <div
            className={`px-1 py-1 border rounded-md font-semibold w-fit uppercase max-w-[100px] ${
              order.status === Status.PENDING
                ? "bg-yellow-100 text-yellow-500 border-yellow-500"
                : order.status === Status.CANCELLED
                ? "bg-red-100 text-red-500 border-red-500"
                : "bg-green-100 text-green-500 border-green-500"
            }`}
          >
            {order.status}
          </div>
          <div
            className={`px-1 py-1 border rounded-md font-semibold w-fit uppercase max-w-[100px] ${
              order.payment_status === PaymentStatus.PARTIAL
                ? "bg-yellow-100 text-yellow-500 border-yellow-500"
                : order.payment_status === PaymentStatus.UNPAID
                ? "bg-red-100 text-red-500 border-red-500"
                : order.payment_status === PaymentStatus.PAID
                ? "bg-green-100 text-green-500 border-green-500"
                : "bg-blue-100 text-blue-500 border-blue-500"
            }`}
          >
            {order.payment_status}
          </div>
          <div>
            <p className="text-[#2a4352] font-bold z-30">
              {getDateString(order.created_at)}
            </p>
          </div>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant={"ghost"} className="z-1">
            <ChevronDownIcon />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="border-l border-r border-b border-gray-300 rounded-ee-md rounded-es-md">
          {order.items.map((item, index) => (
            <SubRow key={index} item={item} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleDashboardOrder;
