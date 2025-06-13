"use client";

import React, { useState } from "react";
import { Session } from "next-auth";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supplierDriversSchemaEditSchema } from "@/lib/validations";
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
import ClipLoader from "react-spinners/ClipLoader";
import { updateSupplierDrivers } from "@/lib/actions/supplier";

const SupplierDriverEditForm = ({
  session,
  supplierId,
  drivers,
}: {
  session: Session;
  supplierId: string;
  drivers: SupplierDriversById[];
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userSessionId = session?.user?.id as string;

  const form = useForm({
    defaultValues: {
      drivers: drivers.length
        ? drivers.map((driver) => ({
            ...driver,
            userId: driver.userId || userSessionId,
          }))
        : [
            {
              lastName: "",
              firstName: "",
              middleName: "",
              driverLicense: "",
              id: "",
              userId: userSessionId,
              supplierId,
            },
          ],
    },
  });

  const { control, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "drivers",
  });

  const [deletedDrivers, setDeletedDrivers] = useState<string[]>([]);

  const handleAddDriver = () => {
    append({
      id: "",
      userId: userSessionId!,
      supplierId,
      lastName: "",
      firstName: "",
      middleName: "",
      driverLicense: "",
    });
  };

  const handleRemoveDrivers = (index: number) => {
    const driversToRemove = form.getValues("drivers")[index];

    if (driversToRemove?.id) {
      setDeletedDrivers((prev) => [...prev, driversToRemove.id]);
    }
    remove(index);
  };

  const deletedDriversIds = drivers
    .filter((driver) => deletedDrivers.includes(driver.id))
    .map((driver) => driver.id);

  const onSubmit: SubmitHandler<
    z.infer<typeof supplierDriversSchemaEditSchema>
  > = async (values) => {
    setIsLoading(true);
    const result = await updateSupplierDrivers(
      values.drivers,
      deletedDriversIds
    );
    setIsLoading(false);
    if (result.success) {
      toast("Success", {
        description: "Дані оновлено успішно",
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id || index}
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
                onClick={handleAddDriver}
              >
                <PlusCircleIcon />
              </Button>

              <Button
                type="button"
                className="p-2 h-12 w-12 text-red-500 hover:text-red-700"
                onClick={() => handleRemoveDrivers(index)}
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

export default SupplierDriverEditForm;
