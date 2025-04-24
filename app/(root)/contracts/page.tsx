import { auth } from "@/auth";
import Breadcrumbs from "@/components/Breadcrumbs";
import { columns } from "@/components/contract/ContractColumns";
import { ContractTable } from "@/components/contract/ContractTable";
import NotFoundContracts from "@/components/contract/NotFoundContracts";
import SkeletonTable from "@/components/SkeletonTable";
import { Button } from "@/components/ui/button";
import { getContracts } from "@/lib/data/contract";

import Link from "next/link";
import React, { Suspense } from "react";

const Page = async () => {
  const session = await auth();
  const contractsList = await getContracts(session?.user?.id as string);
  const invoiceCount = Math.min(contractsList.length, 5);

  return (
    <section className="w-full flex flex-col px-5 md:px-10 lg:px-10 pb-5">
      <Breadcrumbs />
      <div className="mt-10">
        <Button
          className="rounded-lg px-3 py-3 text-lg font-bold bg-[#11191f]"
          asChild
        >
          <Link
            href="/contracts/create"
            className="text-[#ffffff] flex h-10 items-center"
          >
            Додати договір
          </Link>
        </Button>
      </div>

      {!contractsList || contractsList.length === 0 ? (
        <NotFoundContracts />
      ) : (
        <div className="mt-7 w-full overflow-hidden bg-[#ffffff] p-4 rounded-2xl">
          <Suspense fallback={<SkeletonTable rowCount={invoiceCount} />}>
            <ContractTable columns={columns} data={contractsList} />
          </Suspense>
        </div>
      )}
    </section>
  );
};

export default Page;
