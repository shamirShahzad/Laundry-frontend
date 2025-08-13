"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { priceSymbol } from "@/lib/utils/Constants";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";

export type ItemsArray = {
  name: string;
  amount: number;
  image: string;
  quantity: number;
  services: string[];
};
export interface Order {
  cust_name: string;
  cust_phone: string;
  status: string;
  payment_status: string;
  total: number;
  notes: string;
  created_at: Date;
  updated_at: Date;
  items: ItemsArray[];
}

export const orderColumns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "cust_name",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.getIsSorted() === "asc"}
        >
          Customer Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "cust_phone",
    header: "Customer Phone",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let className =
        "border p-1 px-2 rounded-md w-fit text-gray-600 uppercase font-medium";
      if (status === "pending") {
        className += " bg-yellow-100 border-yellow-500";
      } else if (status === "completed") {
        className += " bg-green-100 border-green-500";
      } else if (status === "cancelled") {
        className += " bg-red-100 border-red-500";
      }
      return <div className={className}>{status}</div>;
    },
  },
  {
    accessorKey: "payment_status",
    header: "Payment Status",
    cell: ({ row }) => {
      const status = row.original.payment_status;
      let className =
        "border p-1 px-2 rounded-md w-fit text-gray-600 uppercase font-medium";
      if (status === "partial") {
        className += " bg-yellow-100 border-yellow-500";
      } else if (status === "paid") {
        className += " bg-green-100 border-green-500";
      } else if (status === "unpaid") {
        className += " bg-red-100 border-red-500";
      }
      return <div className={className}>{status}</div>;
    },
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.original.items;
      return (
        <div>
          {items.map((item, index) => (
            <div key={index}>
              {item.quantity} x {item.name}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => (
      <div className="text-right">{`${row.original.total} ${priceSymbol}`}</div>
    ),
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    accessorKey: "created_at",
    header: "Order Date",
    //Format date to human readable mm/dd/yyyy
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return (
        <div>
          {date.getFullYear()}/
          {(date.getMonth() + 1).toString().padStart(2, "0")}/
          {date.getDate().toString().padStart(2, "0")}
        </div>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
    cell: ({ row }) => {
      if (row.original.updated_at === null) {
        return <p className="opacity-50">N/A</p>;
      }
    },
  },
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <Button
          variant={"ghost"}
          className="rounded-xl "
          onClick={row.getToggleExpandedHandler()}
        >
          {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
        </Button>
      ) : null,
    enableHiding: false,
    enableSorting: false,
  },
];
