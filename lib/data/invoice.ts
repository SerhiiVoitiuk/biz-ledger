"use server";

import { db } from "@/database/drizzle";
import {
  contracts,
  contractSpecification,
  customerAddresses,
  customers,
  invoices,
  invoiceSpecification,
  suppliers,
} from "@/database/schema";
import { eq, sql, asc, and } from "drizzle-orm";
import { unstable_cache } from "next/cache";

async function fetchInvoices(userId: string): Promise<InvoiceTable[]> {
  try {
    const invoicesList = await db
      .select({
        id: invoices.id,
        data: invoices.data,
        number: invoices.number,
        supplierId: invoices.supplierId,
        customerId: invoices.customerId,
        status: invoices.status,
        customerName: customers.name,
        supplierName: suppliers.name,
        totalAmount: sql<number>`sum(${invoiceSpecification.pricePerUnit} * ${invoiceSpecification.quantity})`,
      })
      .from(invoices)
      .leftJoin(customers, eq(invoices.customerId, customers.id))
      .leftJoin(suppliers, eq(invoices.supplierId, suppliers.id))
      .leftJoin(
        invoiceSpecification,
        eq(invoices.id, invoiceSpecification.invoiceId)
      )
      .where(eq(invoices.userId, userId))
      .groupBy(invoices.id, customers.name, suppliers.name)
      .orderBy(asc(invoices.id));

    return invoicesList;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
}

export const getInvoices = async (userId: string) => {
  const cachedFetch = unstable_cache(
    () => fetchInvoices(userId),
    [`getInvoices:${userId}`],
    {
      revalidate: 3600,
      tags: [`invoices:${userId}`],
    }
  );

  return cachedFetch();
};

async function fetchInvoiceById(
  invoiceId: string
): Promise<InvoiceById | null> {
  try {
    const [invoice] = await db
      .select({
        id: invoices.id,
        userId: invoices.userId,
        data: invoices.data,
        number: invoices.number,
        supplierId: invoices.supplierId,
        customerId: invoices.customerId,
        customerAddressId: invoices.customerAddressId,
        institutionName: customerAddresses.institutionName,
        deliveryAddress: customerAddresses.deliveryAddress,
        contractId: invoices.contractId,
        status: invoices.status,
        paymentDate: invoices.paymentDate,
        customerName: customers.name,
        supplierName: suppliers.name,
        contractData: contracts.data,
        contractNumber: contracts.number,
        contractSubject: contracts.subject,
      })
      .from(invoices)
      .innerJoin(customers, eq(invoices.customerId, customers.id))
      .innerJoin(suppliers, eq(invoices.supplierId, suppliers.id))
      .innerJoin(contracts, eq(invoices.contractId, contracts.id))
      .innerJoin(
        customerAddresses,
        eq(invoices.customerAddressId, customerAddresses.id)
      )
      .where(eq(invoices.id, invoiceId));

    if (!invoice) {
      return null;
    }

    const invoiceSpec = await db
      .select({
        id: invoiceSpecification.id,
        userId: invoiceSpecification.userId,
        contractSpecificationId: invoiceSpecification.contractSpecificationId,
        unit: invoiceSpecification.unit,
        quantity: invoiceSpecification.quantity,
        pricePerUnit: invoiceSpecification.pricePerUnit,
      })
      .from(invoiceSpecification)
      .where(eq(invoiceSpecification.invoiceId, invoiceId));

    return {
      ...invoice,
      specification: invoiceSpec,
    };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return null;
  }
}

export const getInvoiceById = async (invoiceId: string) => {
  const cachedFetch = unstable_cache(
    () => fetchInvoiceById(invoiceId),
    [`getInvoiceById:${invoiceId}`],
    {
      revalidate: 3600,
      tags: [`invoice:${invoiceId}`],
    }
  );

  return cachedFetch();
};

async function fetchInvoiceInfo(
  invoiceId: string
): Promise<InvoiceById | null> {
  try {
    const [invoice] = await db
      .select({
        id: invoices.id,
        data: invoices.data,
        number: invoices.number,
        supplierId: invoices.supplierId,
        supplierName: suppliers.name,
        supplierAddress: suppliers.address,
        supplierBankAccount: suppliers.bankAccount,
        supplierEDRPOU: suppliers.edrpou,
        supplierPhoneNumber: suppliers.phoneNumber,
        customerId: invoices.customerId,
        customerName: customers.name,
        customerAddressId: invoices.customerAddressId,
        institutionName: customerAddresses.institutionName,
        deliveryAddress: customerAddresses.deliveryAddress,
        contractId: invoices.contractId,
        contractData: contracts.data,
        contractNumber: contracts.number,
        totalAmount: sql<number>`
          SUM(${invoiceSpecification.pricePerUnit}::numeric * ${invoiceSpecification.quantity}::numeric)
        `,
      })
      .from(invoices)
      .innerJoin(customers, eq(invoices.customerId, customers.id))
      .innerJoin(suppliers, eq(invoices.supplierId, suppliers.id))
      .innerJoin(contracts, eq(invoices.contractId, contracts.id))
      .innerJoin(
        customerAddresses,
        eq(invoices.customerAddressId, customerAddresses.id)
      )
      .innerJoin(
        invoiceSpecification,
        eq(invoices.id, invoiceSpecification.invoiceId)
      )
      .where(eq(invoices.id, invoiceId))
      .groupBy(
        invoices.id,
        suppliers.id,
        customers.id,
        contracts.id,
        customerAddresses.id
      );

    if (!invoice) {
      return null;
    }

    const invoiceSpec = await db
      .select({
        id: invoiceSpecification.id,
        contractSpecificationId: invoiceSpecification.contractSpecificationId,
        productName: contractSpecification.productName,
        unit: invoiceSpecification.unit,
        quantity: invoiceSpecification.quantity,
        pricePerUnit: invoiceSpecification.pricePerUnit,
        sum: sql<number>`
          ${invoiceSpecification.pricePerUnit}::numeric * ${invoiceSpecification.quantity}::numeric
        `,
      })
      .from(invoiceSpecification)
      .where(eq(invoiceSpecification.invoiceId, invoiceId))
      .innerJoin(
        contractSpecification,
        eq(
          invoiceSpecification.contractSpecificationId,
          contractSpecification.id
        )
      );

    return {
      ...invoice,
      specification: invoiceSpec,
    };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return null;
  }
}

export const getInvoiceInfo = async (invoiceId: string) => {
  const cachedFetch = unstable_cache(
    () => fetchInvoiceInfo(invoiceId),
    [`getInvoiceInfo:${invoiceId}`],
    {
      revalidate: 3600,
      tags: [`invoice:${invoiceId}`],
    }
  );

  return cachedFetch();
};

async function fetchPendingInvoices(userId: string): Promise<InvoiceTable[]> {
  try {
    const invoicesList = await db
      .select({
        id: invoices.id,
        data: invoices.data,
        number: invoices.number,
        supplierId: invoices.supplierId,
        customerId: invoices.customerId,
        status: invoices.status,
        customerName: customers.name,
        supplierName: suppliers.name,
        totalAmount: sql<number>`sum(${invoiceSpecification.pricePerUnit} * ${invoiceSpecification.quantity})`,
      })
      .from(invoices)
      .leftJoin(customers, eq(invoices.customerId, customers.id))
      .leftJoin(suppliers, eq(invoices.supplierId, suppliers.id))
      .leftJoin(
        invoiceSpecification,
        eq(invoices.id, invoiceSpecification.invoiceId)
      )
      .where(
        and(eq(invoices.userId, userId), eq(invoices.status, "Неоплачена"))
      )
      .groupBy(invoices.id, customers.name, suppliers.name)
      .orderBy(asc(invoices.id));

    return invoicesList;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
}

export const getPendingInvoices = async (
  userId: string
) => {
  const cachedFetch = unstable_cache(
    () => fetchPendingInvoices(userId),
    [`getPendingInvoices:${userId}`],
    {
      revalidate: 3600,
      tags: [`pendingInvoices:${userId}`],
    }
  );

  return cachedFetch();
};


export const getTotalSumWithStatus = async (
  userId: string,
  status: InvoiceStatus,
  year: string
) => {
  try {
    const dateField =
      status === "Оплачена" ? invoices.paymentDate : invoices.data;

    const result = await db
      .select({
        supplierId: suppliers.id,
        supplierName: suppliers.name,
        totalPrice: sql<number>`
          coalesce(sum(${invoiceSpecification.pricePerUnit} * ${invoiceSpecification.quantity}), 0)
        `.as("totalPrice"),
      })
      .from(suppliers)
      .leftJoin(
        invoices,
        and(
          eq(invoices.supplierId, suppliers.id),
          eq(invoices.userId, userId),
          eq(invoices.status, status),
          sql`substring(${dateField} from '\\d{2}\\.\\d{2}\\.(\\d{4})') = ${year}`
        )
      )
      .leftJoin(
        invoiceSpecification,
        eq(invoices.id, invoiceSpecification.invoiceId)
      )
      .where(eq(suppliers.userId, userId))
      .groupBy(suppliers.id, suppliers.name);

    return result;
  } catch (error) {
    console.error(
      `Error fetching ${status} invoice totals by supplier:`,
      error
    );
    return [];
  }
};

export const getPaidSumByContract = async (
  userId: string,
  contractId: string
) => {
  try {
    const result = await db
      .select({
        totalPaid: sql<number>`
          coalesce(sum(${invoiceSpecification.pricePerUnit} * ${invoiceSpecification.quantity}), 0)
        `.as("totalPaid"),
      })
      .from(invoices)
      .leftJoin(
        invoiceSpecification,
        eq(invoices.id, invoiceSpecification.invoiceId)
      )
      .where(
        and(
          eq(invoices.userId, userId),
          eq(invoices.contractId, contractId),
          eq(invoices.status, "Оплачена")
        )
      )
      .limit(1);

    return result[0]?.totalPaid ?? 0;
  } catch (error) {
    console.error("Error fetching paid sum by contract:", error);
    return 0;
  }
};

export const getUnpaidSumByContract = async (
  userId: string,
  contractId: string
) => {
  try {
    const result = await db
      .select({
        totalUnpaid: sql<number>`
          coalesce(sum(${invoiceSpecification.pricePerUnit} * ${invoiceSpecification.quantity}), 0)
        `.as("totalUnpaid"),
      })
      .from(invoices)
      .leftJoin(
        invoiceSpecification,
        eq(invoices.id, invoiceSpecification.invoiceId)
      )
      .where(
        and(
          eq(invoices.userId, userId),
          eq(invoices.contractId, contractId),
          eq(invoices.status, "Неоплачена")
        )
      )
      .limit(1);

    return result[0]?.totalUnpaid ?? 0;
  } catch (error) {
    console.error("Error fetching unpaid sum by contract:", error);
    return 0;
  }
};
