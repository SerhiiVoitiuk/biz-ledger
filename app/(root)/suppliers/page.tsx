import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/auth";

import SuppliersList from "@/components/supplier/SuppliersList";
import NotFoundSuppliers from "@/components/supplier/NotFoundSuppliers";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getSuppliers } from "@/lib/data/supplier";

const Page = async () => {
  const session = await auth();
  const userId = session?.user?.id as string;
  const suppliersList = await getSuppliers(userId);

  return (
    <section className="w-full flex flex-col px-5 md:px-10 lg:px-10 pb-5 md:pb-10 lg:pb-20">
      <Breadcrumbs />

      <div className="mt-10">
        <Button
          className="rounded-lg px-3 py-3 text-lg font-bold bg-[#11191f]"
          asChild
        >
          <Link
            href="/suppliers/create"
            className="text-[#ffffff] flex h-10 items-center"
          >
            Додати постачальника
          </Link>
        </Button>
      </div>

      {suppliersList.length === 0 ? (
        <NotFoundSuppliers />
      ) : (
          <SuppliersList suppliersList={suppliersList} />
      )}
    </section>
  );
};

export default Page;
