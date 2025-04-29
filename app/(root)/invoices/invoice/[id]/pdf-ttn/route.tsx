import PrintableTtnForInvoice from "@/components/invoice/PrintableTtnForInvoice";
import { getInvoiceInfo } from "@/lib/data/invoice";
import { renderToBuffer, renderToStream } from "@react-pdf/renderer";
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
  const url = new URL(request.url);
  const vehicleName = url.searchParams.get("vehicle");

  if (!invoiceInfo) {
    return redirect("/404");
  }

  // const stream = await renderToStream(<PrintableTtnForInvoice invoiceInfo={invoiceInfo} vehicleName={vehicleName as string} />);

  // return new NextResponse(stream as unknown as ReadableStream, {
  //   headers: {
  //     "Content-Type": "application/pdf",
  //     "Content-Disposition": `inline; filename="ttn-for-invoice-${number}-data-${date}.pdf"`,
  //   },
  // });

  const buffer = await renderToBuffer(
    <PrintableTtnForInvoice
      invoiceInfo={invoiceInfo}
      vehicleName={vehicleName as string}
    />
  );

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="ttn-for-invoice-${number}-data-${date}.pdf"`,
    },
  });
}
