import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSupplierCar, getSupplierDriver } from "@/lib/data/supplier";
import SupplierСarEditForm from "@/components/supplier/SupplierСarEditForm";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();
  const cars = await getSupplierCar(id);

  if (!session) redirect("/sign-in");

  return (
    <section className="px-5 md:px-10 lg:px-20 pb-5 md:pb-10 lg:pb-20">
      <Button
        asChild
        className="mb-10 w-fit border border-light-300 bg-[#11191f] text-xs font-medium text-[#ffffff]"
      >
        <Link
          href={`/suppliers/supplier/${id}`}
          className="flex items-center gap-2 px-4 py-2"
        >
          <ArrowLongLeftIcon className="w-6 h-6" />
          Go Back
        </Link>
      </Button>

      <div className="w-full bg-[#fdfdf8] p-4 rounded-2xl">
        <SupplierСarEditForm
          session={session}
          supplierId={id}
          cars={cars}
        />
        ,
      </div>
    </section>
  );
};

export default Page;
