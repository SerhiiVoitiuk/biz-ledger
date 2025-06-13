"use client";

import React from "react";
import { Session } from "next-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supplierDriversSchema } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { createSupplierDrivers } from "@/lib/actions/supplier";

const SupplierDriverForm = ({
  supplierId,
  session,
}: {
  supplierId: string;
  session: Session;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userId = session?.user?.id;

  const form = useForm<z.infer<typeof supplierDriversSchema>>({
    resolver: zodResolver(supplierDriversSchema),
    defaultValues: {
      drivers: [
        { lastName: "", firstName: "", middleName: "", driverLicense: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "drivers",
  });

  const onSubmit = async (values: z.infer<typeof supplierDriversSchema>) => {
    setIsLoading(true);
    const result = await createSupplierDrivers(
      { drivers: values.drivers },
      userId as string,
      supplierId
    );
    setIsLoading(false);

    if (result.success) {
      toast("Success", {
        description: "Водія(-їв) успішно додано",
      });

      router.push(`/suppliers/supplier/${supplierId}`);
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
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-row justify-between gap-4 w-full"
          >
            {/* Driver lastName */}
            <FormField
              control={form.control}
              name={`drivers.${index}.lastName`}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 flex-1">
                  <FormLabel className="text-xl font-bold text-[#11191f]">
                    Прізвище водія
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Прізвище водія"
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

            {/* Driver firstName */}
            <FormField
              control={form.control}
              name={`drivers.${index}.firstName`}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 flex-1">
                  <FormLabel className="text-xl font-bold text-[#11191f]">
                    Імя водія
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Імя водія"
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

            {/* Driver middleName */}
            <FormField
              control={form.control}
              name={`drivers.${index}.middleName`}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 flex-1">
                  <FormLabel className="text-xl font-bold text-[#11191f]">
                    По-батькові водія
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="По-батькові водія"
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

            {/* Driver License */}
            <FormField
              control={form.control}
              name={`drivers.${index}.driverLicense`}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 flex-1">
                  <FormLabel className="text-xl font-bold text-[#11191f]">
                     Посвідчення водія (№)
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Номер посвідчення водія"
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

            <div className="flex justify-center items-end">
              <Button
                type="button"
                className="p-2 h-12 w-12 text-green-500 hover:text-green-700"
                variant="ghost"
                onClick={() =>
                  append({ lastName: "", firstName: "", middleName: "", driverLicense: "" })
                }
              >
                <PlusCircleIcon />
              </Button>

              <Button
                type="button"
                className="p-2 h-12 w-12 text-red-500 hover:text-red-700"
                onClick={() => remove(index)}
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
            "Додати водія"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SupplierDriverForm;
