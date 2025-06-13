import PrintableTtnForInvoice from "@/components/invoice/PrintableTtnForInvoice";
import { getInvoiceInfo } from "@/lib/data/invoice";
import { getSupplierCarById, getSupplierDriverById } from "@/lib/data/supplier";
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

  const vehicleId = url.searchParams.get("vehicle");
  const driverId = url.searchParams.get("driver");
  const driver = await getSupplierDriverById(driverId as string);
  const car = await getSupplierCarById(vehicleId as string);

  if (!invoiceInfo || !driver || !car) {
    return redirect("/404");
  }

  const buffer = await renderToBuffer(
    <PrintableTtnForInvoice
      invoiceInfo={invoiceInfo}
      driver={driver}
      car={car}
    />
  );

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="ttn-for-invoice-${number}-data-${date}.pdf"`,
    },
  });
}
