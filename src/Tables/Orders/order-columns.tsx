"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { priceSymbol } from "@/lib/utils/Constants";
import { type ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
} from "lucide-react";
import { Status, PaymentStatus } from "@/lib/utils/Constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

export type ItemsArray = {
  name: string;
  amount: number;
  image: string;
  quantity: number;
  services: string[];
};
export interface Order {
  id: string;
  cust_name: string;
  cust_phone: string;
  status: string;
  payment_status: string;
  total: number;
  notes: string;
  created_at: Date;
  updated_at: Date;
  paid_amount: string;
  items: ItemsArray[];
}

export const orderColumns = (
  updateStatus: (id: string, status?: string, payment_status?: string) => void
): ColumnDef<Order>[] => [
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
        "border p-1 px-2 rounded-md w-fit  uppercase font-semibold";
      if (status === Status.PENDING) {
        className += " bg-yellow-100 border-yellow-500 text-yellow-500";
      } else if (status === Status.COMPLETED) {
        className += " bg-green-100 border-green-500 text-green-500";
      } else if (status === Status.CANCELLED) {
        className += " bg-red-100 border-red-500 text-red-500";
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
        "border p-1 px-2 rounded-md w-fit  uppercase font-semibold";
      if (status === PaymentStatus.PARTIAL) {
        className += " bg-yellow-100 border-yellow-500 text-yellow-500";
      } else if (status === PaymentStatus.PAID) {
        className += " bg-green-100 border-green-500 text-green-500";
      } else if (status === PaymentStatus.UNPAID) {
        className += " bg-red-100 border-red-500 text-red-500";
      } else if (status === PaymentStatus.REFUNDED) {
        className += " bg-blue-100 border-blue-500 text-blue-500";
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
    accessorKey: "paid_amount",
    header: "Paid",
    cell: ({ row }) => (
      <div className="text-right">{`${row.original.paid_amount} ${priceSymbol}`}</div>
    ),
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
    header: "Last Update",
    cell: ({ row }) => {
      if (row.original.updated_at === null) {
        return <p className="opacity-50">N/A</p>;
      } else {
        const date = new Date(row.original.updated_at);
        return (
          <div>
            {date.getFullYear()}/
            {(date.getMonth() + 1).toString().padStart(2, "0")}/
            {date.getDate().toString().padStart(2, "0")}
          </div>
        );
      }
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: function ActionCell({ row }) {
      const id = row.original.id;
      const paymentStatus = row.original.payment_status;
      const status = row.original.status;
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} className="h-8 w-8 p-0">
                <span className="sr-only">Open Menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        className="uppercase"
                        onClick={() => {
                          updateStatus(id, Status.COMPLETED, paymentStatus);
                        }}
                      >
                        {Status.COMPLETED}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="uppercase"
                        onClick={() => {
                          updateStatus(id, Status.CANCELLED, paymentStatus);
                        }}
                      >
                        {Status.CANCELLED}
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Update Payment Status
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        className="uppercase"
                        onClick={() => {
                          updateStatus(id, status, PaymentStatus.PAID);
                        }}
                      >
                        {PaymentStatus.PAID}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="uppercase"
                        onClick={() => {
                          updateStatus(id, status, PaymentStatus.PARTIAL);
                        }}
                      >
                        {PaymentStatus.PARTIAL}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="uppercase"
                        onClick={() => {
                          updateStatus(id, status, PaymentStatus.REFUNDED);
                        }}
                      >
                        {PaymentStatus.REFUNDED}
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
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
  {
    accessorKey: "notes",
    header: () => {
      return "";
    },
    cell: () => {
      return "";
    },
  },
];
