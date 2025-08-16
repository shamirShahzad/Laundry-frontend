"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

export interface Address {
  country: string;
  state: string;
  city: string;
  street: string;
  building: string;
}

export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: Address;
};
export const customerColumns: ColumnDef<Customer>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address (Country,State,City,Street,Building)",
    cell: ({ row }) => {
      const address = row.original.address;
      const isEmptyAddress =
        !address.country &&
        !address.state &&
        !address.city &&
        !address.street &&
        !address.building;
      return (
        <div className="flex gap-2">
          {!isEmptyAddress ? (
            <>
              <p>{address.country ? address.country + "," : "N/A,"}</p>
              <p>{address.state ? address.state + "," : "N/A,"}</p>
              <p>{address.city ? address.city + "," : "N/A,"}</p>
              <p>{address.street ? address.street + "," : "N/A,"}</p>
              <p>{address.building ? address.building : "N/A"}</p>
            </>
          ) : (
            <p className="text-muted-foreground">N/A</p>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: function ActionCell({ row }) {
      const customer = row.original;
      const navigate = useNavigate();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className="h-8 w-8 p-0">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(customer.id.toString())
              }
            >
              Copy customer Id
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate(`/customers/${customer.id}`)}
            >
              View Customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
