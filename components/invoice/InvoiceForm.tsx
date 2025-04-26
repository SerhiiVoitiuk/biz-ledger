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
import { zodResolver } from "@hookform/resolvers/zod";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { Check, ChevronsUpDown, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format, parse } from "date-fns";
import { createInvoice } from "@/lib/actions/invoice";
import {
  TrashIcon,
  PlusCircleIcon,
  ClockIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { unitValues } from "@/constants";
import ClipLoader from "react-spinners/ClipLoader";
import { getCustomerAddressForInvoice } from "@/lib/data/customer";
import {
  getContractsForInvoice,
  getContractSpecificationForInvoice,
} from "@/lib/data/contract";

type ContractSpecification = Pick<
  ContractSpecificationById,
  "id" | "productName" | "unit" | "quantity" | "pricePerUnit"
>;

type CustomerAddress = Pick<
  CustomerAddressesById,
  "id" | "institutionName" | "deliveryAddress"
>;

type Contract = Pick<
  ContractTables,
  "id" | "supplierId" | "number" | "data" | "subject"
>;

const InvoiceForm = ({
  session,
  customersList,
  suppliersList,
}: {
  session: Session;
  customersList: Pick<Customers, "id" | "name">[];
  suppliersList: Pick<Suppliers, "id" | "name">[];
}) => {
  const router = useRouter();
  const userId = session?.user?.id;
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [specification, setSpecification] = useState<ContractSpecification[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSpecification, setLoadingSpecification] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [contractsLoading, setContractsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(invoicesSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      number: "",
      data: "",
      status: "Неоплачена",
      paymentDate: "",
      customerId: "",
      supplierId: "",
      customerAddressId: "",
      contractId: "",
      specification: [],
    },
  });

  const { control, handleSubmit, trigger, reset, formState } = form;
  const { isValid } = formState;

  const customerId = useWatch({ control, name: "customerId" });
  const supplierId = useWatch({ control, name: "supplierId" });
  const contractId = useWatch({ control, name: "contractId" });
  const status = useWatch({ control, name: "status" });

  useEffect(() => {
    if (status === "Оплачена") {
      trigger("paymentDate");
    }
  }, [status, trigger]);

  useEffect(() => {
    if (!customerId) return;

    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const data = await getCustomerAddressForInvoice(customerId);
        setAddresses(data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [customerId]);

  useEffect(() => {
    if (!customerId && !supplierId) return;

    const fetchContracts = async () => {
      try {
        setContractsLoading(true);
        const data = await getContractsForInvoice(customerId, supplierId);
        setContracts(data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setContractsLoading(false);
      }
    };

    fetchContracts();
  }, [customerId, supplierId]);

  useEffect(() => {
    if (!contractId) return;

    const fetchSpecifications = async () => {
      try {
        setLoadingSpecification(true);
        const data = await getContractSpecificationForInvoice(contractId);
        setSpecification(data);

        const mappedSpecification = data.map((item) => ({
          contractSpecificationId: item.id,
          unit: getUnitValue(item.unit) || "кг",
          quantity: formatQuantity(item.quantity) || "",
          pricePerUnit: formatPrice(item.pricePerUnit) || "",
        }));

        reset({
          ...form.getValues(),
          specification: mappedSpecification,
        });
      } catch (error) {
        console.error("Error fetching specifications:", error);
      } finally {
        setLoadingSpecification(false);
      }
    };

    fetchSpecifications();
  }, [contractId]);

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

  const handleRemoveProduct = (index: number) => {
    remove(index);
  };

  const onSubmit: SubmitHandler<z.infer<typeof invoicesSchema>> = async (
    values
  ) => {
    setIsLoading(true);
  
    const result = await createInvoice(values, userId as string);
    setIsLoading(false);

    if (result.success && result.data) {
      toast("Success", {
        description: "Накладна додана успішно",
      });
      router.push(`/invoices/invoice/${result.data.id}`);
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
                            trigger();
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

                  {formState.errors.paymentDate && (
                    <FormMessage>
                      {formState.errors.paymentDate.message}
                    </FormMessage>
                  )}
                </FormItem>
              );
            }}
          />
        )}

        <FormField
          control={form.control}
          name="supplierId"
          render={({ field }) => {
            const [supplierPopoverOpen, setSupplierPopoverOpen] =
              useState(false);

            return (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-xl font-bold text-[#11191f]">
                  Постачальник
                </FormLabel>
                <Popover
                  open={supplierPopoverOpen}
                  onOpenChange={setSupplierPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full min-h-12 bg-[#eae9e0] font-bold justify-between hover:bg-[#eae9e0]",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? suppliersList.find(
                              (supplier) => supplier.id === field.value
                            )?.name
                          : "Виберіть постачальника"}
                        <ChevronsUpDown className="bg-[#eae9e0] hover:bg-[#eae9e0]" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="min-h-12 min-w-[var(--radix-popover-trigger-width)] bg-[#ffffff] justify-between hover:bg-[#ffffff] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Пошук постачальника..."
                        className="w-full min-h-12 focus-visible:ring-0 focus-visible:shadow-none
                      bg-[#ffffff] border-none"
                      />
                      <CommandList>
                        <CommandEmpty>Постачальника не знайдено.</CommandEmpty>
                        <CommandGroup>
                          {suppliersList.map((supplier) => (
                            <CommandItem
                              value={supplier.id}
                              key={supplier.id}
                              onSelect={() => {
                                form.setValue("supplierId", supplier.id);
                                setSupplierPopoverOpen(false);
                              }}
                              className="text-[#11191f] bg-[#ffffff] font-bold"
                            >
                              {supplier.name}
                              <Check
                                className={cn(
                                  "ml-auto bg-[#eae9e0] hover:bg-[#eae9e0] text-[#11191f]",
                                  supplier.id === field.value
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
          control={form.control}
          name="customerId"
          render={({ field }) => {
            const [customerPopoverOpen, setCustomerPopoverOpen] =
              useState(false);

            return (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-xl font-bold text-[#11191f]">
                  Замовник
                </FormLabel>
                <Popover
                  open={customerPopoverOpen}
                  onOpenChange={setCustomerPopoverOpen}
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
                          ? customersList.find(
                              (customer) => customer.id === field.value
                            )?.name
                          : "Виберіть замовника"}
                        <ChevronsUpDown className="bg-[#eae9e0] hover:bg-[#eae9e0]" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="min-h-12 min-w-[var(--radix-popover-trigger-width)] bg-[#ffffff] justify-between hover:bg-[#ffffff] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Пошук замовника..."
                        className="w-full min-h-12 focus-visible:ring-0 focus-visible:shadow-none
                  bg-[#ffffff] border-none"
                      />
                      <CommandList>
                        <CommandEmpty>Замовника не знайдено.</CommandEmpty>
                        <CommandGroup>
                          {customersList.map((customer) => (
                            <CommandItem
                              value={customer.id}
                              key={customer.id}
                              onSelect={() => {
                                form.setValue("customerId", customer.id);
                                setCustomerPopoverOpen(false);
                              }}
                              className="text-[#11191f] bg-[#ffffff] font-bold"
                            >
                              {customer.name}
                              <Check
                                className={cn(
                                  "ml-auto bg-[#eae9e0] hover:bg-[#eae9e0]  text-[#11191f]",
                                  customer.id === field.value
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

        {customerId ? (
          loadingAddresses ? (
            <div className="w-full flex justify-center items-center py-10">
              <ClipLoader color="#11191f" size={40} />
            </div>
          ) : addresses.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center text-center py-10 bg-[#eae9e0] rounded-lg shadow-sm mt-10">
              <h2 className="text-xl font-semibold text-[#11191f] mb-4">
                Адреси доставки відсутні
              </h2>
              <p className="text-lg text-[#11191f] mb-6">
                Схоже, що Вами для даного Замовника ще не добавлено жодної
                адреси доставки.
              </p>
            </div>
          ) : (
            <FormField
              control={form.control}
              name="customerAddressId"
              render={({ field }) => {
                const [
                  customerAddressPopoverOpen,
                  setCustomerAddressPopoverOpen,
                ] = useState(false);
                return (
                  <FormItem className="flex flex-col gap-1 w-full max-w-full">
                    <FormLabel className="text-xl font-bold text-[#11191f]">
                      Адреса доставки
                    </FormLabel>
                    <Popover
                      open={customerAddressPopoverOpen}
                      onOpenChange={setCustomerAddressPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl className="w-full max-w-full">
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full min-h-12 max-w-full bg-[#eae9e0] font-bold justify-between items-center hover:bg-[#eae9e0] overflow-hidden",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <span className="w-0 flex-1 truncate whitespace-nowrap overflow-hidden text-left">
                              {field.value
                                ? addresses.find(
                                    (addr) => addr.id === field.value
                                  )?.institutionName +
                                  " — " +
                                  addresses.find(
                                    (addr) => addr.id === field.value
                                  )?.deliveryAddress
                                : "Виберіть адресу доставки"}
                            </span>
                            <ChevronsUpDown className="ml-2 shrink-0 bg-[#eae9e0]" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="min-h-12 min-w-[var(--radix-popover-trigger-width)] bg-[#ffffff] justify-between hover:bg-[#ffffff] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Пошук адреси..."
                            className="w-full min-h-12 focus-visible:ring-0 focus-visible:shadow-none bg-[#ffffff] border-none"
                          />
                          <CommandList>
                            <CommandEmpty>
                              Адреси доставки не знайдено.
                            </CommandEmpty>
                            <CommandGroup>
                              {addresses.map((address) => (
                                <CommandItem
                                  value={address.id}
                                  key={address.id}
                                  onSelect={() => {
                                    form.setValue(
                                      "customerAddressId",
                                      address.id
                                    );
                                    setCustomerAddressPopoverOpen(false);
                                  }}
                                  className="text-[#11191f] bg-[#ffffff] font-bold"
                                >
                                  <span className="truncate overflow-hidden whitespace-nowrap w-full text-left">
                                    {address.institutionName} —{" "}
                                    {address.deliveryAddress}
                                  </span>
                                  <Check
                                    className={cn(
                                      "ml-auto bg-[#eae9e0] text-[#11191f]",
                                      address.id === field.value
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
          )
        ) : null}

        {customerId && supplierId ? (
          contractsLoading ? (
            <div className="w-full flex justify-center items-center py-10">
              <ClipLoader color="#11191f" size={40} />
            </div>
          ) : contracts.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center text-center py-10 bg-[#eae9e0] rounded-lg shadow-sm mt-10">
              <h2 className="text-xl font-semibold text-[#11191f] mb-4">
                Договори відсутні
              </h2>
              <p className="text-lg text-[#11191f] mb-6">
                Схоже, що між даним Постачальником та Замовником ще не укладено
                будь-яких договорів.
              </p>
            </div>
          ) : (
            <FormField
              control={form.control}
              name="contractId"
              render={({ field }) => {
                const [contractPopoverOpen, setContractPopoverOpen] =
                  useState(false);

                return (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="text-xl font-bold text-[#11191f]">
                      Договір
                    </FormLabel>
                    <Popover
                      open={contractPopoverOpen}
                      onOpenChange={setContractPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl className="w-full max-w-full">
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full min-h-12 max-w-full bg-[#eae9e0] font-bold justify-between items-center hover:bg-[#eae9e0] overflow-hidden",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <span className="w-0 flex-1 truncate whitespace-nowrap overflow-hidden text-left">
                              {field.value
                                ? "Договір № " +
                                  contracts.find((c) => c.id === field.value)
                                    ?.number +
                                  " від " +
                                  contracts.find((c) => c.id === field.value)
                                    ?.data +
                                  " — Предмет договору: " +
                                  contracts.find((c) => c.id === field.value)
                                    ?.subject
                                : "Виберіть договір"}
                            </span>
                            <ChevronsUpDown className="ml-2 shrink-0 bg-[#eae9e0]" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="min-h-12 min-w-[var(--radix-popover-trigger-width)] bg-[#ffffff] justify-between hover:bg-[#ffffff] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Пошук договору..."
                            className="w-full min-h-12 focus-visible:ring-0 focus-visible:shadow-none bg-[#ffffff] border-none"
                          />
                          <CommandList>
                            <CommandEmpty>Договору не знайдено.</CommandEmpty>
                            <CommandGroup>
                              {contracts.map((contract) => (
                                <CommandItem
                                  value={contract.id}
                                  key={contract.id}
                                  onSelect={() => {
                                    form.setValue("contractId", contract.id);
                                    setContractPopoverOpen(false);
                                  }}
                                  className="text-[#11191f] bg-[#ffffff] font-bold"
                                >
                                  <span className="truncate overflow-hidden whitespace-nowrap w-full text-left">
                                    {"Договір № "} {contract.number} — {"від "}
                                    {contract.data} —{" Предмет договору "}
                                    {contract.subject}
                                  </span>
                                  <Check
                                    className={cn(
                                      "ml-auto bg-[#eae9e0] hover:bg-[#eae9e0] text-[#11191f]",
                                      contract.id === field.value
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
          )
        ) : null}

        {customerId && supplierId && contractId ? (
          loadingSpecification ? (
            <div className="w-full flex justify-center items-center py-10">
              <ClipLoader color="#11191f" size={40} />
            </div>
          ) : specification.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center text-center py-10 bg-[#eae9e0] rounded-lg shadow-sm mt-10">
              <h2 className="text-xl font-semibold text-[#11191f] mb-4">
                Специфікація відсутня
              </h2>
              <p className="text-lg text-[#11191f] mb-6">
                Схоже, що Вами для даного договору ще не додано специфікацю.
              </p>
            </div>
          ) : (
            fields.map((field, index) => (
              <div key={field.id} className="flex flex-wrap gap-4">
                {/* Product */}
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
                          const selected = specification.find(
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
                          {specification.map((product) => (
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

                {/* Unit Select */}
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
                          <SelectTrigger className="min-h-12 w-full mt-1 font-bold placeholder:font-normal text-dark bg-[#eae9e0] border-none">
                            <SelectValue placeholder="Виберіть одиницю виміру" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {unitValues.map(({ id, name }: UnitOption) => (
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

                {/* Quantity Input */}
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
                          className="w-full min-h-12 mt-1 text-xl font-bold placeholder:font-normal text-dark bg-[#eae9e0] border-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price per unit Input */}
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
                          className="w-full min-h-12 mt-1 text-xl font-bold placeholder:font-normal text-dark bg-[#eae9e0] border-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Add / Remove Buttons */}
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
            ))
          )
        ) : null}

        <Button
          type="submit"
          className="min-h-14 w-full font-bold text-xl mt-4 text-[#ffffff]"
          disabled={isLoading || !isValid}
        >
          {isLoading ? (
            <ClipLoader color="#ffffff" size={20} />
          ) : (
            "Додати накладну"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default InvoiceForm;
