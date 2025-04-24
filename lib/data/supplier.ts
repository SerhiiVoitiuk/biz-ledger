import { db } from "@/database/drizzle";
import { suppliers } from "@/database/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

async function fetchSuppliers(userId: string): Promise<Suppliers[]> {
  try {
    const supplierList = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.userId, userId));

    return supplierList;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const getSuppliers = async (userId: string) => {
  const cachedFetch = unstable_cache(
    () => fetchSuppliers(userId),
    [`getSuppliers:${userId}`],
    {
      revalidate: 3600,
      tags: [`suppliers:${userId}`],
    }
  );

  return cachedFetch();
};

async function fetchSupplierById(id: string): Promise<SupplierById | null> {
  try {
    const supplierById = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.id, id));

    if (supplierById.length === 0) {
      return null;
    }

    return supplierById[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getSupplierById = async (id: string) => {
  const cachedFetch = unstable_cache(
    () => fetchSupplierById(id),
    [`getSupplierById:${id}`],
    {
      revalidate: 3600,
      tags: [`supplier:${id}`],
    }
  );

  return cachedFetch();
};

async function fetchSuppliersForInvoice(
  userId: string
): Promise<Pick<Suppliers, "id" | "name">[]> {
  try {
    const supplierList = await db
      .select({
        id: suppliers.id,
        name: suppliers.name,
      })
      .from(suppliers)
      .where(eq(suppliers.userId, userId));

    return supplierList;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const getSuppliersForInvoice = async (userId: string) => {
  const cachedFetch = unstable_cache(
    () => fetchSuppliersForInvoice(userId),
    [`getSuppliersForInvoice:${userId}`],
    {
      revalidate: 3600,
      tags: [`suppliers:${userId}`],
    }
  );

  return cachedFetch();
}