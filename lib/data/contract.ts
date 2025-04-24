"use server";

import { db } from "@/database/drizzle";
import {
  contracts,
  contractSpecification,
  customers,
  invoices,
  invoiceSpecification,
  suppliers,
} from "@/database/schema";
import { eq, sql, and } from "drizzle-orm";
import { formatPrice, getUnitValue } from "../utils";
import { unstable_cache } from "next/cache";

async function fetchContracts(userId: string): Promise<ContractTables[]> {
  try {
    const contractsList = await db
      .select({
        id: contracts.id,
        customerId: contracts.customersId,
        supplierId: contracts.suppliersId,
        number: contracts.number,
        data: contracts.data,
        subject: contracts.subject,
        price: contracts.price,
        executionPeriod: contracts.executionPeriod,
        customerName: customers.name,
        supplierName: suppliers.name,
        userId: contracts.userId,
      })
      .from(contracts)
      .innerJoin(customers, eq(contracts.customersId, customers.id))
      .innerJoin(suppliers, eq(contracts.suppliersId, suppliers.id))
      .where(eq(contracts.userId, userId));

    return contractsList;
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return [];
  }
}

export const getContracts = async (userId: string) => {
  const cachedFetch = unstable_cache(
    () => fetchContracts(userId),
    [`getContracts:${userId}`],
    {
      revalidate: 3600,
      tags: [`contracts:${userId}`],
    }
  );

  return cachedFetch();
};

async function fetchContractById(id: string): Promise<ContractTables | null> {
  try {
    const contract = await db
      .select({
        id: contracts.id,
        customerId: contracts.customersId,
        supplierId: contracts.suppliersId,
        number: contracts.number,
        data: contracts.data,
        subject: contracts.subject,
        price: contracts.price,
        executionPeriod: contracts.executionPeriod,
        customerName: customers.name,
        supplierName: suppliers.name,
        userId: contracts.userId,
      })
      .from(contracts)
      .innerJoin(customers, eq(contracts.customersId, customers.id))
      .innerJoin(suppliers, eq(contracts.suppliersId, suppliers.id))
      .where(eq(contracts.id, id));

    if (contract.length === 0) {
      return null;
    }

    return contract[0];
  } catch (error) {
    console.error("Error fetching contract:", error);
    return null;
  }
}

export const getContractById = async (id: string) => {
  const cachedFetch = unstable_cache(
    () => fetchContractById(id),
    [`getContractById:${id}`],
    {
      revalidate: 3600,
      tags: [`contract:${id}`],
    }
  );

  return cachedFetch();
};

async function fetchContractInfo(
  contractId: string
): Promise<ContractInfo | null> {
  try {
    const contract = await db
      .select({
        id: contracts.id,
        customerId: contracts.customersId,
        supplierId: contracts.suppliersId,
        number: contracts.number,
        data: contracts.data,
        subject: contracts.subject,
        price: contracts.price,
        executionPeriod: contracts.executionPeriod,
        customer: customers,
        supplier: suppliers,
      })
      .from(contracts)
      .where(eq(contracts.id, contractId))
      .innerJoin(customers, eq(contracts.customersId, customers.id))
      .innerJoin(suppliers, eq(contracts.suppliersId, suppliers.id));

    if (contract.length === 0) {
      return null;
    }

    return contract[0];
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return null;
  }
}

export const getContractInfo = async (contractId: string) => {
  const cachedFetch = unstable_cache(
    () => fetchContractInfo(contractId),
    [`getContractInfo:${contractId}`],
    {
      revalidate: 3600,
      tags: [`contract:${contractId}`],
    }
  );

  return cachedFetch();
};

export async function fetchTotalContractsSumBySupplier(
  userId: string,
  year: string
) {
  try {
    const result = await db
      .select({
        supplierId: suppliers.id,
        supplierName: suppliers.name,
        totalPrice: sql<number>`coalesce(sum(${contracts.price}), 0)`.as(
          "totalPrice"
        ),
      })
      .from(suppliers)
      .leftJoin(
        contracts,
        and(
          eq(contracts.suppliersId, suppliers.id),
          eq(contracts.userId, userId),
          sql`substring(${contracts.executionPeriod} from '\\d{2}\\.\\d{2}\\.(\\d{4})') = ${year}`
        )
      )
      .where(eq(suppliers.userId, userId))
      .groupBy(suppliers.id, suppliers.name);

    return result;
  } catch (error) {
    console.error("Error fetching contract totals by supplier:", error);
    return [];
  }
}

export const getTotalContractsSumBySupplier = async (
  userId: string,
  year: string
) => {
  const cachedFetch = unstable_cache(
    () => fetchTotalContractsSumBySupplier(userId, year),
    [`getTotalContractsSumBySupplier:${userId}:${year}`],
    {
      revalidate: 3600,
      tags: [`total-contracts-sum:${userId}:${year}`],
    }
  );

  return cachedFetch();
};

async function fetchContractsForInvoice(
  customerId: string,
  supplierId: string
): Promise<
  Pick<ContractTables, "id" | "supplierId" | "number" | "data" | "subject">[]
> {
  try {
    if (!customerId || !supplierId) {
      return [];
    }

    const contractsList = await db
      .select({
        id: contracts.id,
        supplierId: contracts.suppliersId,
        number: contracts.number,
        data: contracts.data,
        subject: contracts.subject,
      })
      .from(contracts)
      .where(eq(contracts.customersId, customerId));

    const filteredContracts = contractsList.filter(
      (contract) => contract.supplierId === supplierId
    );

    return filteredContracts;
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return [];
  }
}

export const getContractsForInvoice = async (
  customerId: string,
  supplierId: string
) => {
  const cachedFetch = unstable_cache(
    () => fetchContractsForInvoice(customerId, supplierId),
    [`getContractsForInvoice:${customerId}:${supplierId}`],
    {
      revalidate: 3600,
      tags: [`contracts:${customerId}`, `contracts:${supplierId}`],
    }
  );

  return cachedFetch();
};

async function fetchContractSpecificationForInvoice(
  contractId: string
): Promise<
  Pick<
    ContractSpecificationById,
    "id" | "productName" | "unit" | "quantity" | "pricePerUnit"
  >[]
> {
  if (!contractId) {
    return [];
  }

  try {
    const specification = await db
      .select({
        id: contractSpecification.id,
        productName: contractSpecification.productName,
        unit: contractSpecification.unit,
        quantity: contractSpecification.quantity,
        pricePerUnit: contractSpecification.pricePerUnit,
      })
      .from(contractSpecification)
      .where(eq(contractSpecification.contractId, contractId));

    return specification.map((item) => ({
      id: item.id,
      productName: item.productName,
      unit: item.unit,
      quantity: item.quantity,
      pricePerUnit: formatPrice(item.pricePerUnit),
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const getContractSpecificationForInvoice = async (
  contractId: string
) => {
  const cachedFetch = unstable_cache(
    () => fetchContractSpecificationForInvoice(contractId),
    [`getContractSpecificationForInvoice:${contractId}`],
    {
      revalidate: 3600,
      tags: [`specification:${contractId}`],
    }
  );

  return cachedFetch();
};

async function fetchContractSpecification(
  contractId: string
): Promise<ContractSpecificationById[]> {
  try {
    const specification = await db
      .select({
        id: contractSpecification.id,
        userId: contractSpecification.userId,
        contractId: contractSpecification.contractId,
        productName: contractSpecification.productName,
        unit: contractSpecification.unit,
        quantity: contractSpecification.quantity,
        pricePerUnit: contractSpecification.pricePerUnit,
        invoiceQuantity: sql<number>`
          coalesce(sum(${invoiceSpecification.quantity}), 0)
        `.as("invoiceQuantity"),
      })
      .from(contractSpecification)
      .leftJoin(
        invoiceSpecification,
        eq(
          contractSpecification.id,
          invoiceSpecification.contractSpecificationId
        )
      )
      .leftJoin(invoices, eq(invoiceSpecification.invoiceId, invoices.id))
      .where(eq(contractSpecification.contractId, contractId))
      .groupBy(
        contractSpecification.id,
        contractSpecification.userId,
        contractSpecification.contractId,
        contractSpecification.productName,
        contractSpecification.unit,
        contractSpecification.quantity,
        contractSpecification.pricePerUnit
      );

    return specification.map((item) => ({
      id: item.id,
      userId: item.userId,
      contractId: item.contractId,
      productName: item.productName,
      unit: getUnitValue(item.unit),
      quantity: item.quantity,
      pricePerUnit: item.pricePerUnit,
      quantityDifference: +(
        Number(item.quantity) - Number(item.invoiceQuantity ?? 0)
      ).toFixed(2),
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const getContractSpecification = async (contractId: string) => {
  const cachedFetch = unstable_cache(
    () => fetchContractSpecification(contractId),
    [`getContractSpecification:${contractId}`],
    {
      revalidate: 3600,
      tags: [`specification:${contractId}`],
    }
  );

  return cachedFetch();
};
