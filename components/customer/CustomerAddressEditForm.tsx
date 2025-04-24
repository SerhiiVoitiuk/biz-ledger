"use client";

import React, { useState } from "react";
import { Session } from "next-auth";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { customerAddressesEditSchema } from "@/lib/validations";
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
import { updateCustomerAddress } from "@/lib/actions/customer";
import ClipLoader from "react-spinners/ClipLoader";

const CustomerAddressEditForm = ({
  customerId,
  customerAddress,
  session,
}: {
  customerId: string;
  customerAddress: CustomerAddressesById[];
  session: Session;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userSessionId = session?.user?.id as string;

  const form = useForm({
    defaultValues: {
      addresses: customerAddress.length
        ? customerAddress.map((address) => ({
            ...address,
            userId: address.userId || userSessionId,
          }))
        : [
            {
              institutionName: "",
              deliveryAddress: "",
              id: "",
              userId: userSessionId,
              customerId,
            },
          ],
    },
  });

  const { control, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const [deletedAddresses, setDeletedAddresses] = useState<string[]>([]);

  const handleAddAddress = () => {
    append({
      id: "",
      userId: userSessionId!,
      customerId,
      institutionName: "",
      deliveryAddress: "",
    });
  };

  const handleRemoveAddress = (index: number) => {
    const addressToRemove = form.getValues("addresses")[index];

    if (addressToRemove?.id) {
      setDeletedAddresses((prev) => [...prev, addressToRemove.id]);
    }
    remove(index);
  };

  const deletedAddressesIds = customerAddress
    .filter((address) => deletedAddresses.includes(address.id))
    .map((address) => address.id);

  const onSubmit: SubmitHandler<
    z.infer<typeof customerAddressesEditSchema>
  > = async (values) => {
    setIsLoading(true);
    const result = await updateCustomerAddress(
      values.addresses,
      deletedAddressesIds
    );
    setIsLoading(false);
    if (result.success) {
      toast("Success", {
        description: "Дані оновлено успішно",
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id || index}
            className="flex flex-row justify-between gap-4 w-full"
          >
            {/* Institution Name */}
            <FormField
              control={control}
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
              control={control}
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
                onClick={handleAddAddress}
              >
                <PlusCircleIcon />
              </Button>

              <Button
                type="button"
                className="p-2 h-12 w-12 text-red-500 hover:text-red-700"
                onClick={() => handleRemoveAddress(index)}
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

export default CustomerAddressEditForm;
