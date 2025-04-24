import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { redirect } from "next/navigation";
import CustomerInfo from "@/components/customer/CustomerInfo";
import { getCustomerById } from "@/lib/data/customer";


const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const customerInfo = await getCustomerById(id);
  
 
  if (!customerInfo) redirect("/404");

  return (
    <section className="px-5 md:px-10 lg:px-20 pb-5 md:pb-10 lg:pb-20">
      <Button
        asChild
        className="mb-10 w-fit border border-light-300 bg-[#11191f] text-xs font-medium text-[#ffffff]"
      >
        <Link href="/customers" className="flex items-center gap-2 px-4 py-2">
          <ArrowLongLeftIcon className="w-6 h-6" />
          Go Back
        </Link>
      </Button>

      <div className="bg-[#ffffff] p-4 rounded-2xl">
        <CustomerInfo customerInfo={customerInfo} />
      </div>
    </section>
  );
};

export default Page;