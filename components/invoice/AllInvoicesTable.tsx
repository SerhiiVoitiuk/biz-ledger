import { getInvoices } from '@/lib/data/invoice';
import React from 'react'
import NotFoundInvoices from './NotFoundInvoices';
import { columns } from "@/components/invoice/InvoiceColumns";
import { InvoiceTable } from "@/components/invoice/InvoiceTable";

const AllInvoicesTable = async ({ userId }: { userId: string }) => {
  const invoicesList = await getInvoices(userId);

  if (!invoicesList || invoicesList.length === 0) {
    return <NotFoundInvoices />;
  }

  return (
    <div className="mt-7 w-full overflow-hidden bg-white p-4 rounded-2xl">
      <InvoiceTable data={invoicesList} columns={columns} />
    </div>
  )
}

export default AllInvoicesTable;

