"use client";

import { formatPrice, formatQuantity, formatUkrainianDate } from "@/lib/utils";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PrinterIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { deleteInvoice } from "@/lib/actions/invoice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const InvoiceInfo = ({ invoiceInfo }: { invoiceInfo: InvoiceById }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const vehicles = ["Renault", "Peugeot"];

  const handlePrintInvoice = () => {
    const pdfUrl = `/invoices/invoice/${invoiceInfo.id}/pdf-invoice`;

    window.open(pdfUrl, "_blank");
  };

  const handlePrintTTN = (vehicleName: string) => {
    const pdfUrl = `/invoices/invoice/${
      invoiceInfo.id
    }/pdf-ttn?vehicle=${encodeURIComponent(vehicleName)}`;
    window.open(pdfUrl, "_blank");
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInvoice(id);
      toast.success("Накладну видалено успішно");
      router.push(`/invoices`);
      setOpen(false);
    } catch (error) {
      toast.error("Помилка при видалені накладної");
    }
  };

  return (
    <>
      <div className="flex justify-end w-full gap-3">
        <TooltipProvider>
          <div className="flex items-center space-x-3">
            {/* Edit */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/invoices/edit/${invoiceInfo.id}`} passHref>
                  <PencilIcon className="w-6 h-6 cursor-pointer" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>Редагувати накладну</TooltipContent>
            </Tooltip>

            {/* Delete */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TrashIcon
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => setOpen(true)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Видалити накладну</TooltipContent>
                </Tooltip>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Підтвердження</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  Ви точно хочете видалити цю накладну? Цю дію неможливо
                  скасувати.
                </p>
                <DialogFooter className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setOpen(false);
                      handleDelete(invoiceInfo.id);
                    }}
                  >
                    Так, видалити
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Print */}
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <PrinterIcon className="w-6 h-6 cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="left"
                    align="center"
                    className="flex flex-row space-x-3 p-2 bg-white shadow-md rounded-md"
                  >
                    <DropdownMenuItem
                      onClick={handlePrintInvoice}
                      className="flex items-center space-x-1"
                    >
                      <PrinterIcon className="w-6 h-6" />
                      <span>Накладна</span>
                    </DropdownMenuItem>
                    {vehicles.map((name) => (
                      <DropdownMenuItem
                        key={name}
                        onClick={() => handlePrintTTN(name)}
                        className="flex items-center space-x-1"
                      >
                        <PrinterIcon className="w-6 h-6" />
                        <span>ТТН з {name}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>Друкувати</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
      <div className="flex flex-col m-4 gap-5">
        <div className="flex flex-row-reverse justify-between">
          <div className="flex flex-col gap-2 font-bold text-[#11191f] items-center">
            <h1 className="text-3xl uppercase">Накладна</h1>
            <p className="text-sm text-[#11191f]">
              Номер накладної: {invoiceInfo.number}
            </p>
            <p className="text-sm text-[#11191f]">
              Дата накладної: {formatUkrainianDate(invoiceInfo.data)}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-[#11191f]">
              Постачальник:{" "}
              <span className="font-black text-[#1f2124]">
                {invoiceInfo.supplierName}
              </span>
            </h2>
            <h2 className="font-bold  text-[#11191f]">
              Адреса:{" "}
              <span className="font-normal text-[#1f2124] ">
                {invoiceInfo.supplierAddress}
              </span>
            </h2>
            <h2 className="font-bold text-[#11191f]">
              p/p:{" "}
              <span className="font-normal text-[#1f2124]">
                {invoiceInfo.supplierBankAccount}
              </span>
            </h2>
            <h2 className="font-bold text-[#11191f]">
              Код ЄДРПОУ:{" "}
              <span className="font-normal text-[#1f2124]">
                {invoiceInfo.supplierEDRPOU}
              </span>
            </h2>
            <h2 className="font-bold text-[#11191f]">
              Номер телефону:{" "}
              <span className="font-normal text-[#1f2124]">
                {invoiceInfo.supplierPhoneNumber}
              </span>
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-[#11191f]">
            Одержувач:{" "}
            <span className="font-normal text-[#1f2124]">
              {invoiceInfo.institutionName === invoiceInfo.customerName ? (
                <>
                  {invoiceInfo.institutionName} ({invoiceInfo.deliveryAddress})
                </>
              ) : (
                <>
                  {invoiceInfo.customerName} ({invoiceInfo.institutionName}){" "}
                  {invoiceInfo.deliveryAddress}
                </>
              )}
            </span>
          </h2>

          <h2 className="font-bold text-[#11191f]">
            Замовник:{" "}
            <span className="font-normal text-[#1f2124]">
              {invoiceInfo.customerName}
            </span>
          </h2>

          <h2 className="font-bold text-[#11191f]">
            На підставі договору №{" "}
            <span className="font-bold text-[#1f2124]">
              {invoiceInfo.contractNumber} {" від "} {invoiceInfo.contractData}{" "}
              {" року "}
            </span>
          </h2>
        </div>

        <Table className="border border-[#1f2124]">
          <TableHeader className="border border-[#1f2124]">
            <TableRow className="border border-[#1f2124]">
              <TableHead className="font-bold text-[#11191f] text-center border border-[#1f2124]">
                №.
              </TableHead>
              <TableHead className="font-bold text-[#11191f] text-center border border-[#1f2124]">
                Найменування товару
              </TableHead>
              <TableHead className="font-bold text-[#11191f] text-center border border-[#1f2124]">
                Одиниця виміру
              </TableHead>
              <TableHead className="font-bold text-[#11191f] text-center border border-[#1f2124]">
                Кількість
              </TableHead>
              <TableHead className="font-bold text-[#11191f] text-center border border-[#1f2124]">
                Ціна за одницю товару
              </TableHead>
              <TableHead className="font-bold text-[#11191f] text-center border border-[#1f2124]">
                Сума
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="border border-[#1f2124]">
            {invoiceInfo.specification.map((item, index) => (
              <TableRow
                key={item.id || index}
                className="border border-[#1f2124]"
              >
                <TableCell className="font-normal text-center text-[#1f2124] border border-[#1f2124]">
                  {index + 1}
                </TableCell>
                <TableCell className="font-normal text-center text-[#1f2124] border border-[#1f2124]">
                  {item.productName}
                </TableCell>
                <TableCell className="font-normal text-center text-[#1f2124] border border-[#1f2124]">
                  {item.unit}
                </TableCell>
                <TableCell className="font-normal text-center text-[#1f2124] border border-[#1f2124]">
                  {formatQuantity(item.quantity)}
                </TableCell>
                <TableCell className="font-normal text-center text-[#1f2124] border border-[#1f2124]">
                  {formatPrice(item.pricePerUnit)}
                </TableCell>
                <TableCell className="font-normal text-center text-[#1f2124] border border-[#1f2124]">
                  {formatPrice(item.sum as number)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableBody className="border border-[#1f2124]">
            <TableRow className="border border-[#1f2124]">
              <TableCell colSpan={3} className="border border-[#1f2124]" />
              <TableCell
                className="font-normal text-center text-[#1f2124] border border-[#1f2124]"
                colSpan={2}
              >
                Разом
              </TableCell>
              <TableCell className="font-medium text-center text-[#1f2124] border border-[#1f2124]">
                {formatPrice(invoiceInfo.totalAmount as number)}
              </TableCell>
            </TableRow>

            <TableRow className="border border-[#1f2124]">
              <TableCell colSpan={3} className="border border-[#1f2124]" />
              <TableCell
                className="font-normal text-center text-[#1f2124] border border-[#1f2124]"
                colSpan={2}
              >
                ПДВ20%:
              </TableCell>
              <TableCell className="font-medium text-center text-[#1f2124] border border-[#1f2124]">
                00,00
              </TableCell>
            </TableRow>

            <TableRow className="border border-[#1f2124]">
              <TableCell colSpan={3} className="border border-[#1f2124]" />
              <TableCell
                className="font-normal text-center text-[#1f2124] border border-[#1f2124]"
                colSpan={2}
              >
                Всього з ПДВ:
              </TableCell>
              <TableCell className="font-medium text-center text-[#1f2124] border border-[#1f2124]">
                {formatPrice(invoiceInfo.totalAmount as number)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="flex flex-row justify-between">
          <h2 className="font-bold text-xl text-[#11191f]">
            Відправник: ______________
          </h2>
          <h2 className="font-bold text-xl text-[#11191f]">
            Одержувач: ______________
          </h2>
        </div>
      </div>
    </>
  );
};

export default InvoiceInfo;
