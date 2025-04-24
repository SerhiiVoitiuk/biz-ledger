import { auth } from "@/auth";
import Breadcrumbs from "@/components/Breadcrumbs";
import CustomersList from "@/components/customer/CustomersList";
import NotFoundCustomers from "@/components/customer/NotFoundCustomers";
import { Button } from "@/components/ui/button";
import { getCustomers } from "@/lib/data/customer";

import Link from "next/link";
import React from "react";

const Page = async () => {
  const session = await auth();

  const customersList = await getCustomers(session?.user?.id as string);

  return (
    <section className="w-full flex flex-col px-5 md:px-10 lg:px-10 pb-5 md:pb-10 lg:pb-20">
      <Breadcrumbs />
      <div className="mt-10">
        <Button
          className="rounded-lg px-3 py-3 text-lg font-bold bg-[#11191f]"
          asChild
        >
          <Link
            href="/customers/create"
            className="text-[#ffffff] flex h-10 items-center"
          >
            Додати замовника
          </Link>
        </Button>
      </div>

      {customersList.length === 0 ? (
        <NotFoundCustomers />
      ) : (
        <CustomersList customersList={customersList} />
      )}
    </section>
  );
};

export default Page;
