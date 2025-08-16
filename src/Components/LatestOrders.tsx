import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Order } from "@/Tables/Orders/order-columns";
import CollapsibleDashboardOrder from "./CollapsibleDashboardOrder";

interface LatestOrdersProps {
  className?: string;
  data: Order[];
}
const LatestOrders: React.FC<LatestOrdersProps> = ({ className, data }) => {
  return (
    <Card className={`@container/card ${className}`}>
      <CardHeader>
        <CardTitle>Latest Orders</CardTitle>
        <CardDescription>The latest 10 orders</CardDescription>
      </CardHeader>
      <CardContent className="overflow-y-auto">
        {data?.map((order) => {
          return <CollapsibleDashboardOrder order={order} />;
        })}
      </CardContent>
    </Card>
  );
};

export default LatestOrders;
