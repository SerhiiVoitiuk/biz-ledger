import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UserProfile from "@/components/UserProfile";
import Breadcrumbs from "@/components/Breadcrumbs";

import { Suspense } from "react";

import { DashboardInfo } from "@/components/DashboardInfo";
import SkeletonDashboardInfo from "@/components/SkeletonDashboardInfo";
import SkeletonTable from "@/components/SkeletonTable";
import { PendingInvoicesTable } from "@/components/invoice/PendingInvoicesTable";
import { getDashboardInfo } from "@/lib/data/dashboard";
import { getPendingInvoices } from "@/lib/data/invoice";

const Home = async () => {
  const session = await auth();
  const userId = session?.user?.id as string;
  const initialDashboardData = await getDashboardInfo(
    userId,
    new Date().getFullYear().toString()
  );
  const invoicesPendingList = await getPendingInvoices(userId);
  const invoiceCount = Math.min(invoicesPendingList.length, 5);

  if (!session) redirect("/sign-in");

  return (
    <section className="w-full flex flex-col px-5 md:px-10 lg:px-10 pb-5 md:pb-10 lg:pb-20">
      <Breadcrumbs />
      <UserProfile session={session} />

      <Suspense fallback={<SkeletonDashboardInfo />}>
        <DashboardInfo userId={userId} initialData={initialDashboardData} />
      </Suspense>

      <Suspense fallback={<SkeletonTable rowCount={invoiceCount} />}>
        <PendingInvoicesTable userId={userId} />
      </Suspense>
    </section>
  );
};

export default Home;
