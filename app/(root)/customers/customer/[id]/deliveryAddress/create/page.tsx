import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CustomerAddressForm from "@/components/customer/CustomerAddressForm";


const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  const customerId = (await params).id;


  if (!session) redirect("/sign-in");

  return (
    <section className="px-5 md:px-10 lg:px-20 pb-5 md:pb-10 lg:pb-20">
      <Button
        asChild
        className="mb-10 w-fit border border-light-300 bg-[#11191f] text-xs font-medium text-[#ffffff]"
      >
        <Link href={`/customers/customer/${customerId}`} className="flex items-center gap-2 px-4 py-2">
          <ArrowLongLeftIcon className="w-6 h-6" />
          Go Back
        </Link>
      </Button>

      <div className="w-full bg-[#fdfdf8] p-4 rounded-2xl">
        <CustomerAddressForm customerId={customerId} session={session}  />
      </div>
    </section>
  );
};

export default Page;