"use client";

import React from "react";
import { Session } from "next-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
import { supplierCarsSchema } from "@/lib/validations";
import { createSupplierCars } from "@/lib/actions/supplier";

const SupplierCarForm = ({
  supplierId,
  session,
}: {
  supplierId: string;
  session: Session;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userId = session?.user?.id;

  const form = useForm<z.infer<typeof supplierCarsSchema>>({
    resolver: zodResolver(supplierCarsSchema),
    defaultValues: {
      cars: [{ name: "", registration: "", owner: "", ownerAddress: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cars",
  });

  const onSubmit = async (values: z.infer<typeof supplierCarsSchema>) => {
    setIsLoading(true);
    const result = await createSupplierCars(
      { cars: values.cars },
      userId as string,
      supplierId
    );
    setIsLoading(false);

    if (result.success) {
      toast("Success", {
        description: "Автомобіль(-і) успішно додано",
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
                onClick={() =>
                  append({
                    name: "",
                    registration: "",
                    owner: "",
                    ownerAddress: "",
                  })
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
            "Додати автомобіль"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SupplierCarForm;
