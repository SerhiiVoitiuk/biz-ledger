"use client";

import React from "react";
import { Session } from "next-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { contractsSchema } from "@/lib/validations";
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
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { createContract } from "@/lib/actions/сontract";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const ContractForm = ({
  session,
  customersList,
  suppliersList,
}: {
  session: Session;
  customersList: Customers[];
  suppliersList: Suppliers[];
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userId = session?.user?.id;

  const form = useForm<z.infer<typeof contractsSchema>>({
    resolver: zodResolver(contractsSchema),
    defaultValues: {
      customerId: "",
      supplierId: "",
      number: "",
      data: "",
      subject: "",
      price: "",
      executionPeriod: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof contractsSchema>) => {
    setIsLoading(true);
    const result = await createContract(values, userId as string);
    setIsLoading(false);

    if (result.success) {
      toast("Success", {
        description: "Контракт додано успішно",
      });

      router.push(`/contracts/contract/${result.data.id}`);
    } else {
      toast("Error", {
        description: result.message,
        className: "bg-red-500 text-white",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                          "w-full min-h-12 bg-[#eae9e0] justify-between placeholder:font-normal font-bold hover:bg-[#eae9e0] text-[#11191f]",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? customersList.find(
                              (customer) => customer.id === field.value
                            )?.name
                          : "Вибрати замовника"}
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
                        <CommandEmpty>Замовників не знайдено.</CommandEmpty>
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
                          "w-full min-h-12 bg-[#eae9e0] placeholder:font-normal font-bold justify-between hover:bg-[#eae9e0]",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? suppliersList.find(
                              (supplier) => supplier.id === field.value
                            )?.name
                          : "Вибрати постачальника"}
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
          name={"number"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xl font-bold text-[#11191f]">
                Номер договору
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Номер договору"
                  {...field}
                  className="w-full min-h-12 mt-1
                  text-[#11191f] placeholder:font-normal font-bold
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
                  Дата договору
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
                          "w-full pl-3 min-h-12 text-left mt-1 placeholder:font-normal font-bold  bg-[#eae9e0] hover:bg-[#eae9e0] text-[#11191f] placeholder:text-[#11191f] focus-visible:ring-0 focus-visible:shadow-none border-none",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? field.value : <span>Вибрати дату</span>}
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
          name={"subject"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xl font-bold text-[#11191f]">
                Предмет договору
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Предмет договору"
                  {...field}
                  className="w-full min-h-12 mt-1 text-xl font-bold 
                  placeholder:font-normal text-dark
                  placeholder:text-dark focus-visible:ring-0 focus-visible:shadow-none
                  bg-[#eae9e0] border-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"price"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xl font-bold text-[#11191f]">
                Сума договору
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Сума договору"
                  {...field}
                  className="w-full min-h-12 mt-1 text-xl font-bold placeholder:font-normal
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
          name="executionPeriod"
          render={({ field }) => {
            const [executionPeriodPopoverOpen, setExecutionPeriodPopoverOpen] =
              useState(false);

            return (
              <FormItem className="flex flex-col">
                <FormLabel className="text-xl font-bold text-[#11191f]">
                  Строк виконання договору
                </FormLabel>
                <Popover
                  open={executionPeriodPopoverOpen}
                  onOpenChange={setExecutionPeriodPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 min-h-12 text-left mt-1 placeholder:font-normal font-bold  bg-[#eae9e0] hover:bg-[#eae9e0] text-[#11191f] placeholder:text-[#11191f] focus-visible:ring-0 focus-visible:shadow-none border-none",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? field.value : <span>Вибрати дату</span>}
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
                          form.setValue("executionPeriod", formattedDate);
                          setExecutionPeriodPopoverOpen(false);
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

        <Button
          type="submit"
          className="min-h-14 w-full font-bold text-xl mt-4 text-[#ffffff]"
          disabled={isLoading}
        >
          {isLoading ? (
            <ClipLoader color="#ffffff" size={20} />
          ) : (
            "Додати договір"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ContractForm;
