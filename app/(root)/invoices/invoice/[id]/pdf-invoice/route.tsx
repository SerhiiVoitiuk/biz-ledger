import PrintableInvoice from "@/components/invoice/PrintableInvoice";
import { getInvoiceInfo } from "@/lib/data/invoice";

import { renderToStream } from "@react-pdf/renderer";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = (await params).id;
  const invoiceInfo = await getInvoiceInfo(id);
  const number = invoiceInfo?.number;
  const date = invoiceInfo?.data;

  if (!invoiceInfo) {
    return redirect("/404");
  }


  const stream = await renderToStream(<PrintableInvoice invoiceInfo={invoiceInfo} />);

  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="invoice-${number}-data-${date}.pdf"`,
    },
  });
}
