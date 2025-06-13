"use client";

import {
  cn,
  formatPrice,
  formatQuantity,
  formatUkrainianDate,
} from "@/lib/utils";
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ttnSchema } from "@/lib/validations";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

const InvoiceInfo = ({
  invoiceInfo,
  supplierDriver,
  supplierCar,
}: {
  invoiceInfo: InvoiceById;
  supplierCar: SupplierCarsById[];
  supplierDriver: SupplierDriversById[];
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handlePrintInvoice = () => {
    const pdfUrl = `/invoices/invoice/${invoiceInfo.id}/pdf-invoice`;

    window.open(pdfUrl, "_blank");
    setOpen(false);
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

  const form = useForm({
    resolver: zodResolver(ttnSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      carId: "",
      driverId: "",
    },
  });

  const { control, handleSubmit, clearErrors } = form;

  const handlePrintTTN = (carId: string, driverId: string) => {
    const pdfUrl = `/invoices/invoice/${
      invoiceInfo.id
    }/pdf-ttn?vehicle=${encodeURIComponent(carId)}&driver=${encodeURIComponent(
      driverId
    )}`;
    window.open(pdfUrl, "_blank");
    setOpen(false);
  };

  const onSubmit: SubmitHandler<z.infer<typeof ttnSchema>> = (values) => {
    handlePrintTTN(values.carId, values.driverId);
    setOpen(false);
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

            {/* Print New */}

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PrinterIcon
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => setOpen(true)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Друк накладної та ТТН</TooltipContent>
                </Tooltip>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Друк накладної та ТТН</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground mb-4">
                  Виберіть транспортний засіб та водія для друку ТТН або
                  натисніть кнопку "Накладна" для друку накладної.
                </p>
                <div className="flex flex-col space-y-2">
                  <Button onClick={handlePrintInvoice} className="w-full">
                    Накладна № {invoiceInfo.number} від{" "}
                    {formatUkrainianDate(invoiceInfo.data)} року
                  </Button>

                  <Form {...form}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="flex flex-col space-y-4"
                    >
                      <FormField
                        control={control}
                        name="driverId"
                        render={({ field }) => {
                          const [driverPopoverOpen, setDriverPopoverOpen] =
                            useState(false);

                          return (
                            <FormItem className="flex flex-col gap-1">
                              <FormLabel className="text-xl font-bold text-[#11191f]">
                                Водій
                              </FormLabel>
                              <Popover
                                open={driverPopoverOpen}
                                onOpenChange={setDriverPopoverOpen}
                              >
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className={cn(
                                        "w-full min-h-12 bg-[#eae9e0] justify-between font-bold hover:bg-[#eae9e0] text-[#11191f]",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value
                                        ? (() => {
                                            const driver = supplierDriver.find(
                                              (d) => d.id === field.value
                                            );
                                            return driver
                                              ? `${driver.lastName} ${driver.firstName} ${driver.middleName}`
                                              : "Виберіть водія";
                                          })()
                                        : "Виберіть водія"}
                                      <ChevronsUpDown className="bg-[#eae9e0] hover:bg-[#eae9e0]" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="min-h-12 min-w-[var(--radix-popover-trigger-width)] bg-[#ffffff] justify-between hover:bg-[#ffffff] p-0">
                                  <Command>
                                    <CommandInput
                                      placeholder="Пошук водія..."
                                      className="w-full min-h-12 focus-visible:ring-0 focus-visible:shadow-none bg-[#ffffff] border-none"
                                    />
                                    <CommandList>
                                      <CommandEmpty>
                                        Водіїв не знайдено.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {supplierDriver.map((driver) => (
                                          <CommandItem
                                            value={`${driver.firstName} ${driver.lastName} ${driver.middleName}`}
                                            key={driver.id}
                                            onSelect={() => {
                                              form.setValue(
                                                "driverId",
                                                driver.id
                                              );
                                              clearErrors("driverId");
                                              setDriverPopoverOpen(false);
                                            }}
                                            className="text-[#11191f] bg-[#ffffff] font-bold"
                                          >
                                            {driver.lastName} {driver.firstName}{" "}
                                            {driver.middleName}
                                            <Check
                                              className={cn(
                                                "ml-auto bg-[#eae9e0] hover:bg-[#eae9e0]  text-[#11191f]",
                                                driver.id === field.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>

                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={control}
                        name="carId"
                        render={({ field }) => {
                          const [carPopoverOpen, setCarPopoverOpen] =
                            useState(false);

                          return (
                            <FormItem className="flex flex-col gap-1">
                              <FormLabel className="text-xl font-bold text-[#11191f]">
                                Транспортний засіб
                              </FormLabel>
                              <Popover
                                open={carPopoverOpen}
                                onOpenChange={setCarPopoverOpen}
                              >
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className={cn(
                                        "w-full min-h-12 bg-[#eae9e0] justify-between font-bold hover:bg-[#eae9e0] text-[#11191f]",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value
                                        ? (() => {
                                            const сar = supplierCar.find(
                                              (с) => с.id === field.value
                                            );
                                            return сar
                                              ? `${сar.name} ${сar.registration}`
                                              : "Виберіть транспортний засіб";
                                          })()
                                        : "Виберіть транспортний засіб"}
                                      <ChevronsUpDown className="bg-[#eae9e0] hover:bg-[#eae9e0]" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="min-h-12 min-w-[var(--radix-popover-trigger-width)] bg-[#ffffff] justify-between hover:bg-[#ffffff] p-0">
                                  <Command>
                                    <CommandInput
                                      placeholder="Пошук транспортного засобу..."
                                      className="w-full min-h-12 focus-visible:ring-0 focus-visible:shadow-none bg-[#ffffff] border-none"
                                    />
                                    <CommandList>
                                      <CommandEmpty>
                                        Транспортного засобу не знайдено.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {supplierCar.map((car) => (
                                          <CommandItem
                                            value={`${car.name} ${car.registration}`}
                                            key={car.id}
                                            onSelect={() => {
                                              form.setValue("carId", car.id);
                                              clearErrors("carId");
                                              setCarPopoverOpen(false);
                                            }}
                                            className="text-[#11191f] bg-[#ffffff] font-bold"
                                          >
                                            {car.name} {car.registration}
                                            <Check
                                              className={cn(
                                                "ml-auto bg-[#eae9e0] hover:bg-[#eae9e0]  text-[#11191f]",
                                                car.id === field.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>

                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />

                      <Button type="submit" className="w-full">
                        Друк ТТН для накладної № {invoiceInfo.number} від{" "}
                        {formatUkrainianDate(invoiceInfo.data)} року
                      </Button>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
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
              Дата накладної: {formatUkrainianDate(invoiceInfo.data)} року
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
