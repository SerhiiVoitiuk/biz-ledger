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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { contractSpecificationSchema } from "@/lib/validations";
import { unitValues } from "@/constants";
import { createContractSpecification } from "@/lib/actions/сontract";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const ContractSpecificationForm = ({
  contractId,
  session,
}: {
  contractId: string;
  session: Session;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userId = session?.user?.id;

  const form = useForm<z.infer<typeof contractSpecificationSchema>>({
    resolver: zodResolver(contractSpecificationSchema),
    defaultValues: {
      specification: [
        { productName: "", unit: "кг", quantity: "", pricePerUnit: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "specification",
  });

  const onSubmit = async (
    values: z.infer<typeof contractSpecificationSchema>
  ) => {
    setIsLoading(true);
    const result = await createContractSpecification(
      { specification: values.specification },
      userId as string,
      contractId
    );
    setIsLoading(false);

    if (result.success) {
      toast("Success", {
        description: "Специфікацію додано успішно",
      });

      router.push(`/contracts/contract/${contractId}`);
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
            {/* Product Name */}
            <FormField
              control={form.control}
              name={`specification.${index}.productName`}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 flex-1">
                  <FormLabel className="text-xl font-bold text-[#11191f]">
                    Найменування товару
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Найменування товару"
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

            {/* Product unit */}
            <FormField
              control={form.control}
              name={`specification.${index}.unit`}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-xl font-bold text-[#11191f]">
                    Одиниця виміру
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="min-h-12 w-auto mt-1 font-bold 
                          placeholder:font-normal text-dark
                          placeholder:text-dark focus-visible:ring-0 focus-visible:shadow-none
                          bg-[#eae9e0] border-none"
                      >
                        <SelectValue placeholder="Select a verified email to display" />
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

            {/* Quantity */}
            <FormField
              control={form.control}
              name={`specification.${index}.quantity`}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 flex-1">
                  <FormLabel className="text-xl font-bold text-[#11191f]">
                    Кількість
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Кількість"
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

            {/* Unit price */}
            <FormField
              control={form.control}
              name={`specification.${index}.pricePerUnit`}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 flex-1">
                  <FormLabel className="text-xl font-bold text-[#11191f]">
                    Ціна за одиницю товару
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Ціна за одиницю товару"
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
                    productName: "",
                    unit: "кг",
                    quantity: "",
                    pricePerUnit: "",
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
            "Додати специфікацію"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ContractSpecificationForm;
