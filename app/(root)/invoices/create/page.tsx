import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import { getCustomersForInvoice } from "@/lib/data/customer";
import { getSuppliersForInvoice } from "@/lib/data/supplier";

const Page = async () => {
  const session = await auth();
  const customersList = await getCustomersForInvoice(
    session?.user?.id as string
  );
  const suppliersList = await getSuppliersForInvoice(
    session?.user?.id as string
  );

  if (!session) redirect("/sign-in");

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

      <div className="w-full max-w-12xl mx-auto bg-[#fdfdf8] p-4 rounded-2xl">
        <InvoiceForm
          session={session}
          customersList={customersList}
          suppliersList={suppliersList}
        />
      </div>
    </section>
  );
};

export default Page;
