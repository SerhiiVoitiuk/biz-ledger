"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPrice } from "@/lib/utils";
import InvoiceActions from "./InvoiceActions";
import { useRef, useState } from "react";

export const columns: ColumnDef<InvoiceTable>[] = [
  {
    accessorKey: "customerName",
    header: "Замовник",
  },
  {
    accessorKey: "supplierName",
    header: "Постачальник",
  },
  {
    accessorKey: "number",
    header: "Номер накладної",
  },
  {
    accessorKey: "data",
    header: "Дата накладної",
  },
  {
    accessorKey: "status",
    header: "Статус",
  },
  {
    accessorKey: "totalAmount",
    header: "Сума накладної",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("totalAmount"));
      const formattedPrice = formatPrice(price.toString());

      return <div className="text-center font-bold">{formattedPrice}</div>;
    },
  },
  {
    id: "actions",
    header: "Дії",
    cell: ({ row }) => {
      const payment = row.original;
      const invoiceId = payment.id;
      const [menuOpen, setMenuOpen] = useState(false);
      const dropdownCloseRef = useRef<(() => void) | undefined>(undefined);

      return (
        <DropdownMenu
          open={menuOpen}
          onOpenChange={(open) => {
            setMenuOpen(open);

            if (!open) dropdownCloseRef.current = undefined;
            else dropdownCloseRef.current = () => setMenuOpen(false);
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <InvoiceActions invoiceId={invoiceId} dropdownCloseRef={dropdownCloseRef} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
