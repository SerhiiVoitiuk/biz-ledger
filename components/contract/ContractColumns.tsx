"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ContractActions from "./ContractActions";
import { formatPrice } from "@/lib/utils";
import { useRef, useState } from "react";

export const columns: ColumnDef<ContractTables>[] = [
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
    header: "Номер договору",
  },
  {
    accessorKey: "data",
    header: "Дата договору",
  },
  {
    accessorKey: "subject",
    header: "Предмет догвору",
  },
  {
    accessorKey: "price",
    header: "Сума договору",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formattedPrice = formatPrice(price.toString());

      return <div className="text-center font-bold">{formattedPrice}</div>;
    },
  },
  {
    id: "actions",
    header: "Дії",
    cell: ({ row }) => {
      const payment = row.original;
      const contractId = payment.id;
      const userId = payment.userId;
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
          <DropdownMenuContent align="start">
            <ContractActions contractId={contractId} userId={userId} dropdownCloseRef={dropdownCloseRef}/>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
