import { auth } from "@/auth";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import SkeletonTable from "@/components/SkeletonTable";
import AllInvoicesTable from "@/components/invoice/AllInvoicesTable";
import { getInvoices } from "@/lib/data/invoice";

const Page = async () => {
  const session = await auth();
  const userId = session?.user?.id as string;
  const invoicesList = await getInvoices(userId);
  const invoiceCount = Math.min(invoicesList.length, 5);

  return (
    <section className="w-full flex flex-col px-5 md:px-10 lg:px-10 pb-5 md:pb-10 lg:pb-20">
      <Breadcrumbs />

      <div className="mt-10">
        <Button
          className="rounded-lg px-3 py-3 text-lg font-bold bg-[#11191f]"
          asChild
        >
          <Link
            href="/invoices/create"
            className="text-[#ffffff] flex h-10 items-center"
          >
            Додати накладну
          </Link>
        </Button>
      </div>

      <Suspense fallback={<SkeletonTable rowCount={invoiceCount} />}>
        <AllInvoicesTable userId={userId} />
      </Suspense>
    </section>
  );
};

export default Page;
