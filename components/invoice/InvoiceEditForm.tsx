"use client";

import React, { useEffect, useState } from "react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { invoicesSchema } from "@/lib/validations";
import { formatPrice, formatQuantity, getUnitValue } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format, parse } from "date-fns";
import {
  updateInvoice,
} from "@/lib/actions/invoice";
import {
  TrashIcon,
  PlusCircleIcon,
  ClockIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { unitValues } from "@/constants";
import ClipLoader from "react-spinners/ClipLoader";
import { getContractSpecificationForInvoice } from "@/lib/data/contract";

type ContractSpecification = Pick<
  ContractSpecificationById,
  "id" | "productName" | "unit" | "quantity" | "pricePerUnit"
>;

const InvoiceEditForm = ({
  session,
  invoice,
}: {
  session: Session;
  invoice: InvoiceById;
}) => {
  const router = useRouter();
  const userId = session?.user?.id;
  const [contractSpecifications, setContractSpecifications] = useState<
    ContractSpecification[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = true;
  const invoiceId = invoice.id;

  const formattedSpecification = (invoice.specification || []).map((item) => ({
    ...item,
    unit: getUnitValue(item.unit),
    quantity: formatQuantity(item.quantity),
    pricePerUnit: formatPrice(item.pricePerUnit),
  }));

  const form = useForm({
    defaultValues: {
      number: invoice.number || "",
      data: invoice.data || "",
      status: invoice.status || "Неоплачена",
      paymentDate: invoice.paymentDate || "",
      customerId: invoice.customerId,
      supplierId: invoice.supplierId,
      customerAddressId: invoice.customerAddressId,
      contractId: invoice.contractId,
      specification: formattedSpecification,
    },
  });

  const { control, handleSubmit, reset } = form;
  const status = useWatch({ control, name: "status" });

  useEffect(() => {
    if (!invoice.contractId) return;

    const fetchSpecifications = async () => {
      try {
        const data = await getContractSpecificationForInvoice(
          invoice.contractId
        );
        setContractSpecifications(data);

        if (!isEditMode) {
          const mappedSpecification = data.map((item) => ({
            contractSpecificationId: item.id,
            unit: item.unit || "кг",
            quantity: item.quantity || "",
            pricePerUnit: item.pricePerUnit || "",
          }));

          reset({
            ...form.getValues(),
            specification: mappedSpecification,
          });
        }
      } catch (error) {
        console.error("Error fetching specifications:", error);
      }
    };

    fetchSpecifications();
  }, [invoice.contractId]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specification",
  });

  const handleAddProduct = () => {
    append({
      contractSpecificationId: "",
      unit: "кг",
      quantity: "",
      pricePerUnit: "",
    });
  };

  const [deletedProductId, setDeletedProductId] = useState<string[]>([]);

  const handleRemoveProduct = (index: number) => {
    const productToRemove = form.getValues("specification")[index];

    if (productToRemove?.id) {
      setDeletedProductId((prev) => [...prev, productToRemove.id!]);
    }

    remove(index);
  };

  const onSubmit: SubmitHandler<z.infer<typeof invoicesSchema>> = async (
    values
  ) => {
    setIsLoading(true);
    const result = await updateInvoice(
      values,
      invoiceId,
      deletedProductId,
      userId as string
    );
    setIsLoading(false);

    if (result.success) {
      toast("Success", {
        description: "Дані оновлено успішно",
      });
      router.push(`/invoices/invoice/${invoiceId}`);
    } else {
      toast("Error", {
        description: result.message,
        className: "bg-red-500 text-white",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name={"number"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xl font-bold text-[#11191f]">
                Номер накладної
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Номер накладної"
                  {...field}
                  className="w-full min-h-12 mt-1 font-bold 
                  text-[#11191f]
                  focus-visible:ring-0 focus-visible:shadow-none
                  bg-[#eae9e0] border-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="data"
          render={({ field }) => {
            const [dataPopoverOpen, setDataPopoverOpen] = useState(false);

            return (
              <FormItem className="flex flex-col">
                <FormLabel className="text-xl font-bold text-[#11191f]">
                  Дата накладної
                </FormLabel>
                <Popover
                  open={dataPopoverOpen}
                  onOpenChange={setDataPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 min-h-12 text-left mt-1 font-bold  bg-[#eae9e0] hover:bg-[#eae9e0] text-[#11191f] placeholder:text-[#11191f] focus-visible:ring-0 focus-visible:shadow-none border-none",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? field.value : <span>Вибіріть дату</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value
                          ? parse(field.value, "dd.MM.yyyy", new Date())
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          const formattedDate = format(date, "dd.MM.yyyy");
                          form.setValue("data", formattedDate);
                          setDataPopoverOpen(false);
                        }
                      }}
                      disabled={(date) =>
                        date < new Date("1900-01-01") ||
                        date > new Date("2045-12-31")
                      }
                      initialFocus
                      className="text-[#11191f] text-xl font-bold"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-xl font-bold text-[#11191f]">
                Статус
              </FormLabel>
              <FormControl className="flex gap-4">
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="w-full min-h-12 mt-1 pl-3
                  focus-visible:ring-0 focus-visible:shadow-none
                  bg-[#eae9e0] border-none flex flex-row rounded-md"
                >
                  <FormItem className="flex items-center">
                    <FormControl>
                      <RadioGroupItem value="Неоплачена" />
                    </FormControl>
                    <FormLabel className="flex gap-2 rounded-full justify-center w-32 bg-[#11191f] px-3 py-1.5 font-bold text-white">
                      Неоплачена <ClockIcon className="h-4 w-4" />
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center">
                    <FormControl>
                      <RadioGroupItem value="Оплачена" />
                    </FormControl>
                    <FormLabel className="flex gap-2 rounded-full w-32 justify-center  bg-green-500 px-3 py-1.5 font-bold text-white">
                      Оплачена{" "}
                      <CheckIcon className="h-4 w-4 border-1 rounded-3xl" />
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {status === "Оплачена" && (
          <FormField
            control={form.control}
            name="paymentDate"
            render={({ field }) => {
              const [paymentDatePopoverOpen, setPaymentDatePopoverOpen] =
                useState(false);

              return (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-xl font-bold text-[#11191f]">
                    Дата оплати
                  </FormLabel>
                  <Popover
                    open={paymentDatePopoverOpen}
                    onOpenChange={setPaymentDatePopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 min-h-12 text-left mt-1 font-bold  bg-[#eae9e0] hover:bg-[#eae9e0] text-[#11191f] placeholder:text-[#11191f] focus-visible:ring-0 focus-visible:shadow-none border-none",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            field.value
                          ) : (
                            <span>Вибіріть дату</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value
                            ? parse(field.value, "dd.MM.yyyy", new Date())
                            : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            const formattedDate = format(date, "dd.MM.yyyy");
                            form.setValue("paymentDate", formattedDate);
                            setPaymentDatePopoverOpen(false);
                          }
                        }}
                        disabled={(date) =>
                          date < new Date("1900-01-01") ||
                          date > new Date("2045-12-31")
                        }
                        initialFocus
                        className="text-[#11191f] text-xl font-bold"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}

        <FormField
          control={form.control}
          name="supplierId"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xl font-bold text-[#11191f]">
                Постачальник
              </FormLabel>
              <FormControl>
                <div
                  className={cn(
                    "w-full min-h-12 bg-[#eae9e0] font-bold text-[#11191f] justify-between rounded-md flex items-center px-3 py-2"
                  )}
                >
                  {invoice.supplierName}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xl font-bold text-[#11191f]">
                Замовник
              </FormLabel>
              <FormControl>
                <div
                  className={cn(
                    "w-full min-h-12 bg-[#eae9e0] font-bold text-[#11191f] justify-between rounded-md flex items-center px-3 py-2"
                  )}
                >
                  {invoice.customerName}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="customerAddressId"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xl font-bold text-[#11191f]">
                Адреса доставки
              </FormLabel>
              <FormControl>
                <div
                  className={cn(
                    "w-full min-h-12 bg-[#eae9e0] font-bold text-[#11191f] justify-between rounded-md flex items-center px-3 py-2"
                  )}
                >
                  {invoice.institutionName} {"-"} {invoice.deliveryAddress}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contractId"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xl font-bold text-[#11191f]">
                Договір
              </FormLabel>
              <FormControl>
                <div
                  className={cn(
                    "w-full min-h-12 bg-[#eae9e0] font-bold text-[#11191f] justify-between rounded-md flex items-center px-3 py-2"
                  )}
                >
                  {"Договір № "} {invoice.contractNumber} {" від "}{" "}
                  {invoice.contractData} {" — Предмет договору: "}{" "}
                  {invoice.contractSubject}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-wrap gap-4">
            {/* Product Select */}
            <FormField
              control={form.control}
              name={`specification.${index}.contractSpecificationId`}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 flex-1 min-w-[250px]">
                  <FormLabel className="text-base font-bold text-[#11191f]">
                    Найменування товару
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const selected = contractSpecifications.find(
                        (p) => p.id === value
                      );
                      if (selected) {
                        form.setValue(
                          `specification.${index}.unit`,
                          selected.unit
                        );
                        form.setValue(
                          `specification.${index}.pricePerUnit`,
                          selected.pricePerUnit
                        );
                      }
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="min-h-12 font-bold bg-[#eae9e0] border-none w-full overflow-hidden text-ellipsis whitespace-nowrap">
                        <SelectValue placeholder="Виберіть продукт" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contractSpecifications.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.productName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Unit */}
            <FormField
              control={form.control}
              name={`specification.${index}.unit`}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 flex-1 min-w-[150px]">
                  <FormLabel className="text-base font-bold text-[#11191f]">
                    Одиниця виміру
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="min-h-12 w-full mt-1 font-bold text-dark bg-[#eae9e0] border-none">
                        <SelectValue placeholder="Виберіть одиницю виміру" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unitValues.map(({ id, name }) => (
                        <SelectItem key={id} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantity */}
            <FormField
              control={form.control}
              name={`specification.${index}.quantity`}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 flex-1 min-w-[150px]">
                  <FormLabel className="text-base font-bold text-[#11191f]">
                    Кількість
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Кількість"
                      {...field}
                      className="w-full min-h-12 mt-1 text-xl font-bold text-dark bg-[#eae9e0] border-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price per unit */}
            <FormField
              control={form.control}
              name={`specification.${index}.pricePerUnit`}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 flex-1 min-w-[150px]">
                  <FormLabel className="text-base font-bold text-[#11191f]">
                    Ціна за одиницю товару
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Ціна за одиницю товару"
                      {...field}
                      className="w-full min-h-12 mt-1 text-xl font-bold text-dark bg-[#eae9e0] border-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex gap-2 items-end">
              <Button
                type="button"
                className="p-2 h-12 w-12 text-green-500 hover:text-green-700"
                variant="ghost"
                onClick={handleAddProduct}
              >
                <PlusCircleIcon />
              </Button>
              <Button
                type="button"
                className="p-2 h-12 w-12 text-red-500 hover:text-red-700"
                onClick={() => handleRemoveProduct(index)}
                disabled={fields.length === 1}
                variant="ghost"
              >
                <TrashIcon />
              </Button>
            </div>
          </div>
        ))}

        <Button
          type="submit"
          className="min-h-14 w-full font-bold text-xl mt-4 text-[#ffffff]"
          disabled={isLoading}
        >
          {isLoading ? (
            <ClipLoader color="#ffffff" size={20} />
          ) : (
            "Зберегти зміни"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default InvoiceEditForm;
