"use-client";
import {
  flexRender,
  useReactTable,
  type SortingState,
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  type ExpandedState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import "./dataTable.css";
import { DataTablePagination } from "./DataTablePagination";
import { Input } from "@/components/ui/input";
import React from "react";
import type { ItemsArray } from "./Orders/order-columns";
import SubRow from "@/Components/SubRow";
import { AnimatePresence, motion } from "framer-motion";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  expandable?: boolean;
  drawer?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  expandable,
  drawer,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      expanded,
    },
    onExpandedChange: setExpanded,
  });

  const getCorrectFilterColumn = () => {
    if (expandable) {
      return table.getColumn("cust_name");
    } else {
      return table.getColumn("name");
    }
  };

  const filterCol = getCorrectFilterColumn();

  return (
    <div>
      <div className="flex items-center py-4 ml-2 gap-10">
        <Input
          placeholder="Filter name..."
          value={(filterCol?.getFilterValue() as string) ?? ""}
          onChange={(event) => filterCol?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        {drawer}
      </div>
      <div className="overflow-scroll border-t-0">
        <Table containerClassName="myTable">
          <TableHeader
            className={`sticky top-0 z-10 bg-white transition-shadow duration-300 boxShadow `}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const notes: string = row.getValue("notes") as string;
                console.log("ROW", row.original);
                let items: ItemsArray[] = [];
                if (expandable) {
                  items = row.getValue("items") as ItemsArray[];
                }
                return (
                  <React.Fragment key={row.id}>
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    <AnimatePresence initial={false}>
                      {row.getIsExpanded() && expandable && (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="flex-col gap-3 bg-gray-50 pl-10"
                          >
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              style={{ overflow: "hidden" }}
                            >
                              {items.map((items, index) => {
                                return (
                                  <SubRow
                                    key={index}
                                    item={items}
                                    notes={notes}
                                  />
                                );
                              })}
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
