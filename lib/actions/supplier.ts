"use server";

import { db } from "@/database/drizzle";
import { contracts, invoices, suppliers } from "@/database/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export const createSupplier = async (params: Supplier, userId: string) => {
  try {
    const existingSupplier = await db
      .select({ edrpou: suppliers.edrpou })
      .from(suppliers)
      .where(
        and(eq(suppliers.edrpou, params.edrpou), eq(suppliers.userId, userId))
      )
      .limit(1);

    if (existingSupplier.length > 0) {
      return {
        success: false,
        message: "Постачальник з таким кодом ЄДРПОУ вже існує",
      };
    }

    const newSupplier = await db
      .insert(suppliers)
      .values({
        userId,
        ...params,
      })
      .returning();

    const supplierId = newSupplier[0].id;

    await revalidateTag(`suppliers:${userId}`);
    await revalidateTag(`supplier:${supplierId}`);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newSupplier[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while creating the Supplier",
    };
  }
};

export const deleteSupplier = async (supplierId: string, userId: string) => {
  try {
    const contractCount = await db
      .select({ supplierId: contracts.suppliersId })
      .from(contracts)
      .where(eq(contracts.suppliersId, supplierId));
    
    const invoiceCount = await db
      .select({ supplierId: invoices.supplierId })
      .from(invoices)
      .where(eq(invoices.supplierId, supplierId));


    if (contractCount.length > 0 || invoiceCount.length > 0) {
      return {
        success: false,
        message:
          "Не можливо видалити постачальника так як його дані використовуються в договорах чи накладних.",
      };
    }

    const result = await db
      .delete(suppliers)
      .where(eq(suppliers.id, supplierId));

    await revalidateTag(`suppliers:${userId}`);
    await revalidateTag(`supplier:${supplierId}`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while deleting supplier",
    };
  }
};

export const updatedSupplier = async (
  supplierId: string,
  params: Supplier,
  userId: string
) => {
  try {
    const result = await db
      .update(suppliers)
      .set({
        name: params.name,
        address: params.address,
        edrpou: params.edrpou,
        phoneNumber: params.phoneNumber,
        email: params.email,
        bankAccount: params.bankAccount,
      })
      .where(eq(suppliers.id, supplierId));

    await revalidateTag(`suppliers:${userId}`);
    await revalidateTag(`supplier:${supplierId}`);

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to update supplier" };
  }
};
