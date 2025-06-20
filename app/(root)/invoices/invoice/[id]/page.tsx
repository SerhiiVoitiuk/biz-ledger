import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { redirect } from "next/navigation";

import InvoiceInfo from "@/components/invoice/InvoiceInfo";
import { getInvoiceInfo } from "@/lib/data/invoice";
import { getSupplierCar, getSupplierDriver } from "@/lib/data/supplier";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const invoiceInfo = await getInvoiceInfo(id);


  if (!invoiceInfo) redirect("/404");
  const supplierDriver = await getSupplierDriver(invoiceInfo.supplierId);
  const supplierCar = await getSupplierCar(invoiceInfo.supplierId);

  return (
    <section className="px-5 md:px-10 lg:px-20 pb-5 md:pb-10 lg:pb-20">
      <Button
        asChild
        className="mb-10 w-fit border border-light-300 bg-[#11191f] text-xs font-medium text-[#ffffff]"
      >
        <Link href="/invoices" className="flex items-center gap-2 px-4 py-2">
          <ArrowLongLeftIcon className="w-6 h-6" />
          Go Back
        </Link>
      </Button>

      <div className="bg-[#ffffff] p-4 rounded-2xl">
        <InvoiceInfo invoiceInfo={invoiceInfo} supplierDriver={supplierDriver} supplierCar={supplierCar} />
      </div>
    </section>
  );
};

export default Page;
