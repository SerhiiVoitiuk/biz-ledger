"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Session } from "next-auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import React from "react";
import { suppliersSchema } from "@/lib/validations";
import { createSupplier } from "@/lib/actions/supplier";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const SupplierForm = ({ session }: { session: Session }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userId = session?.user?.id;

  const form = useForm<z.infer<typeof suppliersSchema>>({
    resolver: zodResolver(suppliersSchema),
    defaultValues: {
      name: "",
      address: "",
      edrpou: "",
      phoneNumber: "",
      email: "",
      bankAccount: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof suppliersSchema>) => {
    setIsLoading(true);
    const result = await createSupplier(values, userId as string);
    setIsLoading(false);

    if (result.success) {
      toast("Success", {
        description: "Постачальника додано успішно",
      });

      router.push(`/suppliers/supplier/${result.data.id}`);
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
          name={"name"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xl font-bold text-[#11191f]">
                Повна назва постачальника
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Повна назва постачальника"
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
          name={"address"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xl font-bold text-[#11191f]">
                Адреса постачальника
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Адреса постачальника"
                  {...field}
                  className="w-full min-h-12 mt-1 text-xl font-bold 
                  placeholder:font-normal
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
          name={"edrpou"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xl font-bold text-[#11191f]">
                Код ЄДРПОУ постачальника
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Код ЄДРПОУ"
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
          name={"phoneNumber"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xl font-bold text-[#11191f]">
                Номер телефону постачальника
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Номер телефону постачальника"
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
          name={"email"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xl font-bold text-[#11191f]">
                Електронна адреса постачальника
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Електронна адреса постачальника"
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
          name={"bankAccount"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xl font-bold text-[#11191f]">
                Р/р постачальника (IBAN)
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Р/р постачальника (IBAN)"
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

        <Button
          type="submit"
          className="min-h-14 w-full font-bold text-xl mt-4 text-[#ffffff]"
          disabled={isLoading}
        >
          {isLoading ? (
            <ClipLoader color="#ffffff" size={20} />
          ) : (
            "Додати постачальника"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SupplierForm;
