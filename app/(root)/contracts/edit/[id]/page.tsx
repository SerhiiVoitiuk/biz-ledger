import { Button } from "@/components/ui/button";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { auth } from "@/auth";
import Link from "next/link";
import React from "react";
import ContractEditForm from "@/components/contract/ContractEditForm";
import { redirect } from "next/navigation";
import { getContractById } from "@/lib/data/contract";
import { getCustomers } from "@/lib/data/customer";
import { getSuppliers } from "@/lib/data/supplier";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  const id = (await params).id;
  const contract = await getContractById(id);
  const customersList = await getCustomers(session?.user?.id as string);
  const suppliersList = await getSuppliers(session?.user?.id as string);

  if (!contract) redirect("/404");
 
  return (
    <section className="px-5 md:px-10 lg:px-20 pb-5 md:pb-10 lg:pb-20">
      <Button
        asChild
        className="mb-10 w-fit border border-light-300 bg-[#11191f] text-xs font-medium text-[#ffffff]"
      >
        <Link href="/contracts" className="flex items-center gap-2 px-4 py-2">
          <ArrowLongLeftIcon className="w-6 h-6" />
          Go Back
        </Link>
      </Button>

      <div className="w-full bg-[#fdfdf8] p-4 rounded-2xl">
        <ContractEditForm
          contract={contract}
          customersList={customersList}
          suppliersList={suppliersList}
        />
      </div>
    </section>
  );
};

export default Page;
