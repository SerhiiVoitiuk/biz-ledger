"use client";

import React, { useState } from "react";
import { Session } from "next-auth";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supplierCarsEditSchema } from "@/lib/validations";
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
import { updateSupplierCars } from "@/lib/actions/supplier";

const SupplierСarEditForm = ({
  session,
  supplierId,
  cars,
}: {
  session: Session;
  supplierId: string;
  cars: SupplierCarsById[];
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userSessionId = session?.user?.id as string;

  const form = useForm({
    defaultValues: {
      cars: cars.length
        ? cars.map((car) => ({
            ...car,
            userId: car.userId || userSessionId,
          }))
        : [
            {
              name: "",
              registration: "",
              owner: "",
              ownerAddress: "",
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
    name: "cars",
  });

  const [deletedCars, setDeletedCars] = useState<string[]>([]);

  const handleAddCar = () => {
    append({
      id: "",
      userId: userSessionId!,
      supplierId,
      name: "",
      registration: "",
      owner: "",
      ownerAddress: "",
    });
  };

  const handleRemoveCars = (index: number) => {
    const carsToRemove = form.getValues("cars")[index];

    if (carsToRemove?.id) {
      setDeletedCars((prev) => [...prev, carsToRemove.id]);
    }
    remove(index);
  };

  const deletedCarsIds = cars
    .filter((car) => deletedCars.includes(car.id))
    .map((car) => car.id);

  const onSubmit: SubmitHandler<
    z.infer<typeof supplierCarsEditSchema>
  > = async (values) => {
    setIsLoading(true);
    const result = await updateSupplierCars(values.cars, deletedCarsIds);
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
            {/* Сar name */}
            <FormField
              control={form.control}
              name={`cars.${index}.name`}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 flex-1">
                  <FormLabel className="text-xl font-bold text-[#11191f]">
                    Найменнування
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Найменнування"
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

            {/* Сar registration */}
            <FormField
              control={form.control}
              name={`cars.${index}.registration`}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 flex-1">
                  <FormLabel className="text-xl font-bold text-[#11191f]">
                    Номерний знак
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Номерний знак"
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

            {/* Сar owner */}
            <FormField
              control={form.control}
              name={`cars.${index}.owner`}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 flex-1">
                  <FormLabel className="text-xl font-bold text-[#11191f]">
                    Дані власника (ПІБ)
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Дані власника (ПІБ)"
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

            {/* Сar ownerAddress */}
            <FormField
              control={form.control}
              name={`cars.${index}.ownerAddress`}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 flex-1">
                  <FormLabel className="text-xl font-bold text-[#11191f]">
                    Адреса власника
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Адреса власника"
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
                onClick={handleAddCar}
              >
                <PlusCircleIcon />
              </Button>

              <Button
                type="button"
                className="p-2 h-12 w-12 text-red-500 hover:text-red-700"
                onClick={() => handleRemoveCars(index)}
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

export default SupplierСarEditForm;
