
import { InvoiceTable } from "@/components/invoice/InvoiceTable";
import { columns } from "@/components/invoice/InvoiceColumns";
import NotFounPendingInvoice from "@/components/NotFounPendingInvoice";
import { getPendingInvoices } from "@/lib/data/invoice";

export async function PendingInvoicesTable({ userId }: { userId: string }) {
  const invoicesPendingList = await getPendingInvoices(userId);
  

  if (!invoicesPendingList || invoicesPendingList.length === 0) {
    return <NotFounPendingInvoice />;
  }

  return (
    <div className="mt-7 w-full overflow-hidden bg-white p-4 rounded-2xl">
      <InvoiceTable data={invoicesPendingList} columns={columns} />
    </div>
  );
}