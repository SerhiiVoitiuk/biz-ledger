"use server";

import { db } from "@/database/drizzle";
import { invoices, invoiceSpecification } from "@/database/schema";
import { eq, inArray } from "drizzle-orm";
import { ContractSpecificationInsert } from "./сontract";
import { revalidateTag } from "next/cache";

const revalidateInvoiceTags = async (
  contractId: string,
  userId: string,
  invoiceId: string
) => {
  await Promise.all([
    revalidateTag(`specification:${contractId}`),
    revalidateTag(`invoices:${userId}`),
    revalidateTag(`invoice:${invoiceId}`),
    revalidateTag(`pendingInvoices:${userId}`),
  ]);
};

export const createInvoice = async (params: Invoice, userId: string) => {
  try {
    const [invoice] = await db
      .insert(invoices)
      .values({
        userId,
        customerId: params.customerId,
        supplierId: params.supplierId,
        customerAddressId: params.customerAddressId,
        contractId: params.contractId,
        number: params.number,
        data: params.data,
        status: params.status,
        paymentDate: params.paymentDate ?? null,
      })
      .returning({ id: invoices.id });

    const invoiceId = invoice.id;
    const contractId = params.contractId;

    const parseNumber = (value: string) => {
      const parsed = parseFloat(value.replace(/\s/g, "").replace(",", "."));
      if (isNaN(parsed)) throw new Error("Invalid quantity or price format");
      return parsed.toString();
    };

    const invoiceSpec = params.specification.map((spec) => ({
      userId,
      invoiceId,
      contractSpecificationId: spec.contractSpecificationId,
      unit: spec.unit as ContractSpecificationInsert["unit"],
      quantity: parseNumber(spec.quantity),
      pricePerUnit: parseNumber(spec.pricePerUnit),
    }));

    await db.insert(invoiceSpecification).values(invoiceSpec);

    await revalidateInvoiceTags(contractId, userId, invoiceId);

    return {
      success: true,
      data: { id: invoiceId },
    };
  } catch (error) {
    console.error("Create invoice error:", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const deleteInvoice = async (invoiceId: string) => {
  try {
    const invoice = await db
      .select({
        contractId: invoices.contractId,
        userId: invoices.userId,
      })
      .from(invoices)
      .where(eq(invoices.id, invoiceId))
      .limit(1);

    if (invoice.length === 0) {
      return {
        success: false,
      };
    }

    const contractId = invoice[0].contractId;
    const userId = invoice[0].userId;

    await db.delete(invoices).where(eq(invoices.id, invoiceId));

    await revalidateInvoiceTags(contractId, userId, invoiceId);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while deleting invoice",
    };
  }
};

export const updateInvoice = async (
  params: Invoice,
  invoiceId: string,
  deletedProductId: string[],
  userId: string
) => {
  try {
    const currentInvoice = await db
      .select({
        number: invoices.number,
        data: invoices.data,
        status: invoices.status,
        paymentDate: invoices.paymentDate,
      })
      .from(invoices)
      .where(eq(invoices.id, invoiceId))
      .limit(1)
      .then((res) => res[0]);

    const updates: Partial<Invoice> = {};
    const contractId = params.contractId;

    if (currentInvoice.number !== params.number) {
      updates.number = params.number;
    }
    if (currentInvoice.data !== params.data) {
      updates.data = params.data;
    }
    if (currentInvoice.status !== params.status) {
      updates.status = params.status;
    }

    if (currentInvoice.paymentDate !== params.paymentDate) {
      updates.paymentDate = params.paymentDate ?? null;
    }

    if (Object.keys(updates).length > 0) {
      await db.update(invoices).set(updates).where(eq(invoices.id, invoiceId));
    }

    const parseNumber = (value: string) => {
      const parsed = parseFloat(value.replace(/\s/g, "").replace(",", "."));
      if (isNaN(parsed)) throw new Error("Invalid quantity or price format");
      return parsed.toString();
    };

    const updatedSpecifications = params.specification.map((item) => {
      if (item.id) {
        return {
          ...item,
          unit: item.unit as ContractSpecificationInsert["unit"],
          quantity: parseNumber(item.quantity),
          pricePerUnit: parseNumber(item.pricePerUnit),
        };
      } else {
        return {
          ...item,
          userId,
          invoiceId,
          unit: item.unit as ContractSpecificationInsert["unit"],
          quantity: parseNumber(item.quantity),
          pricePerUnit: parseNumber(item.pricePerUnit),
        };
      }
    });

    await Promise.all(
      updatedSpecifications.map(async (spec) => {
        if (spec.id) {
          await db
            .update(invoiceSpecification)
            .set({
              unit: spec.unit,
              quantity: spec.quantity,
              pricePerUnit: spec.pricePerUnit,
            })
            .where(eq(invoiceSpecification.id, spec.id));
        } else {
          await db.insert(invoiceSpecification).values({
            contractSpecificationId: spec.contractSpecificationId,
            unit: spec.unit,
            quantity: spec.quantity,
            pricePerUnit: spec.pricePerUnit,
            userId: userId,
            invoiceId: invoiceId,
          });
        }
      })
    );

    if (deletedProductId.length > 0) {
      await db
        .delete(invoiceSpecification)
        .where(inArray(invoiceSpecification.id, deletedProductId))
        .execute();
    }

    await revalidateInvoiceTags(contractId, userId, invoiceId);

    return { success: true };
  } catch (error) {
    console.error("Update invoice error:", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
