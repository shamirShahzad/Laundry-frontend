import { priceSymbol, productsUrl } from "@/lib/utils/Constants";
import type { ItemsArray } from "@/Tables/Orders/order-columns";
import "../../src/Pages/colors.css";

interface SubRowProps {
  item: ItemsArray;
  notes: string;
}

const SubRow: React.FC<SubRowProps> = ({ item, notes }) => {
  return (
    <div className="p-2 flex gap-10 items-center border-b">
      <img
        src={`${productsUrl}${item.image}`}
        alt="item image"
        className="w-20 h-20 rounded object-contain"
      />
      <div className="flex-col items-center justify-center text-dark-blue">
        <p className="font-medium text-lg text-dark-blue">Item</p>
        <p className="text-dark-blue text-base">
          {item.quantity} x {item.name}
        </p>
      </div>
      <div className="flex-col items-cent justify-center ">
        <p className="font-medium text-lg text-dark-blue">Amount</p>
        <p className="text-dark-blue text-base">
          {item.amount} <span className="font-medium">{priceSymbol}</span>
        </p>
      </div>
      <div className="flex-col items-center justify-center">
        <p className="font-medium text-lg text-dark-blue">Services</p>
        <div id="services" className="w-full flex-wrap flex gap-5">
          {item.services.map((service, index) => (
            <p
              className="p-1 px-2 bg-gray-200 border border-gray-700 w-fit rounded-lg text-dark-blue font-medium text-base"
              key={index}
            >
              {service}
            </p>
          ))}
        </div>
      </div>
      {notes !== "" && (
        <div className="flex-col items-cent justify-center ">
          <p className="font-medium text-lg text-dark-blue">Notes</p>
          <p className="text-dark-blue text-base">{notes}</p>
        </div>
      )}
    </div>
  );
};

export default SubRow;
