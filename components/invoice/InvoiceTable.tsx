"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InvoiceTable<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const globalFilterFn: FilterFn<any> = (row, _columnId, filterValue) => {
  const search = filterValue.toLowerCase();

  const searchableFields = [
    row.original.number,
    row.original.customerName,
    row.original.supplierName,
    row.original.status,
    row.original.data,
    row.original.totalAmount,
  ];

  return searchableFields.some((field) =>
    String(field ?? "")
      .toLowerCase()
      .includes(search)
  );
};

export function InvoiceTable<TData, TValue>({
  columns,
  data,
}: InvoiceTable<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Пошук..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm border-[#11191f] border-1 rounded-md"
        />
      </div>
      <div className="rounded-md w-full border-[#11191f] border-1">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-[#11191f] border-b"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-lg font-bold text-[#11191f] border-r border-[#11191f] last:border-0 text-center"
                    >
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-[#11191f] border-b"
                >
                  {row.getVisibleCells().map((cell) => {
                    const cellValue = cell.getValue() as string;
                    const columnId = cell.column.id;
                    const shouldShowTooltip = [
                      "customerName",
                      "supplierName",
                    ].includes(columnId);

                    return (
                      <TableCell
                        key={cell.id}
                        className="max-w-[200px] font-bold text-center overflow-hidden text-ellipsis border-r border-[#11191f] last:border-0"
                      >
                        {shouldShowTooltip ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="bottom"
                              align="center"
                              className="max-w-[200px] break-words text-center"
                            >
                              {cellValue}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Накладних за заданим пошуком не знайдено.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-4 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Попередній
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Наступний
        </Button>
      </div>
    </div>
  );
}
