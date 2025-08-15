import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Popover } from "@/components/ui/popover";
import { PaymentStatus, Status } from "@/lib/utils/Constants";
import type { Filters } from "@/Pages/Orders";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { ChevronDownIcon, SlidersHorizontalIcon } from "lucide-react";
import React from "react";

interface FiltersComponentProps {
  onChangeFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filters: Filters;
}

const FiltersComponent = ({
  onChangeFilters,
  filters,
}: FiltersComponentProps) => {
  const [openFrom, setOpenFrom] = React.useState(false);
  const [openTo, setOpenTo] = React.useState(false);

  const updateFilter = <K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K]
  ) => {
    onChangeFilters((prev) => {
      const updated = { ...prev, [key]: value };
      return updated;
    });
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-blue-600"
        >
          <SlidersHorizontalIcon />
          Filters
        </Button>
      </DrawerTrigger>

      <DrawerContent className="fixed right-0 top-0 h-full w-80 p-4 border-l bg-white overflow-y-scroll">
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>
            Apply filters to your orders table.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div>
            <div className="flex flex-col gap-3">
              <Label
                className="block text-sm font-medium text-blue-700"
                htmlFor="for"
              >
                From
              </Label>
              <Popover open={openFrom} onOpenChange={setOpenFrom}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"ghost"}
                    id="for"
                    className="w-full border border-gray-400 rounded "
                  >
                    {filters.from
                      ? filters.from.toLocaleDateString()
                      : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0 shadow-sm border border-gray-400"
                  align="center"
                >
                  <button
                    onClick={() => updateFilter("from", undefined)}
                    disabled={!filters.from}
                    className={`text-sm text-blue-600 mr-10 relative left-50 top-2 ${
                      !filters.from && "opacity-50"
                    }`}
                  >
                    Clear
                  </button>
                  <Calendar
                    mode="single"
                    selected={filters.from}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      updateFilter("from", date);
                      setOpenFrom(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-3">
              <Label
                className="block text-sm font-medium text-blue-700"
                htmlFor="to"
              >
                To
              </Label>
              <Popover open={openTo} onOpenChange={setOpenTo}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"ghost"}
                    id="to"
                    className="w-full border border-gray-400 rounded"
                  >
                    {filters.to
                      ? filters.to.toLocaleDateString()
                      : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0 shadow-sm border border-gray-400"
                  align="center"
                >
                  <button
                    onClick={() => updateFilter("to", undefined)}
                    disabled={!filters.to}
                    className={`text-sm text-blue-600 mr-10 relative left-50 top-2 ${
                      !filters.to && "opacity-50"
                    }`}
                  >
                    Clear
                  </button>
                  <Calendar
                    mode="single"
                    selected={filters.to}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      updateFilter("to", date);
                      setOpenFrom(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="mt-1 block w-full rounded border border-blue-400 py-2 px-3  focus:border-blue-700 focus:ring-blue-700 sm:text-sm"
            >
              <option value="">Select Status</option>
              <option value={Status.COMPLETED}>Completed</option>
              <option value={Status.PENDING}>Pending</option>
              <option value={Status.CANCELLED}>Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700">
              Payment Status
            </label>
            <select
              value={filters.payment_status}
              onChange={(e) => updateFilter("payment_status", e.target.value)}
              className="mt-1 block w-full rounded border border-blue-400 py-2 px-3  focus:border-blue-700 focus:ring-blue-700 sm:text-sm"
            >
              <option value="">Select Payment Status</option>
              <option value={PaymentStatus.PAID}>Paid</option>
              <option value={PaymentStatus.PARTIAL}>Partial</option>
              <option value={PaymentStatus.UNPAID}>Unpaid</option>
              <option value={PaymentStatus.REFUNDED}>Refunded</option>
            </select>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FiltersComponent;
