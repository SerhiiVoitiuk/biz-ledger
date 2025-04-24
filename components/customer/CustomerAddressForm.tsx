"use client";

import React from "react";
import { Session } from "next-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { customerAddressesSchema } from "@/lib/validations";
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
import { createCustomerAddress } from "@/lib/actions/customer";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const CustomerAddressForm = ({
  customerId,
  session,
}: {
  customerId: string;
  session: Session;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userId = session?.user?.id;

  const form = useForm<z.infer<typeof customerAddressesSchema>>({
    resolver: zodResolver(customerAddressesSchema),
    defaultValues: {
      addresses: [{ institutionName: "", deliveryAddress: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "addresses",
  });

  const onSubmit = async (values: z.infer<typeof customerAddressesSchema>) => {
    setIsLoading(true);
    const result = await createCustomerAddress(
      { addresses: values.addresses },
      userId as string,
      customerId
    );
    setIsLoading(false);

    if (result.success) {
      toast("Success", {
        description: "Адресу успішно додано",
      });

      router.push(`/customers/customer/${customerId}`);
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
            {/* Institution Name */}
            <FormField
              control={form.control}
              name={`addresses.${index}.institutionName`}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 flex-1">
                  <FormLabel className="text-xl font-bold text-[#11191f]">
                    Найменування установи
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Найменування установи"
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

            {/* Delivery Address */}
            <FormField
              control={form.control}
              name={`addresses.${index}.deliveryAddress`}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 flex-1">
                  <FormLabel className="text-xl font-bold text-[#11191f]">
                    Адреса знаходження
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Адреса знаходження"
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
                  append({ institutionName: "", deliveryAddress: "" })
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
            "Додати адресу доставки"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CustomerAddressForm;
