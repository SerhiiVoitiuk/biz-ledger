"use server";

import { db } from "@/database/drizzle";
import { contracts, contractSpecification, invoices, invoiceSpecification } from "@/database/schema";
import { eq, inArray, InferInsertModel } from "drizzle-orm";
import { revalidateTag } from "next/cache";

const revalidateContractTags = async (
  contractId: string,
  userId: string,
  customerId: string,
  supplierId: string,
  year: string
) => {
  await Promise.all([
    revalidateTag(`contracts:${userId}`),
    revalidateTag(`contract:${contractId}`),
    revalidateTag(`total-contracts-sum:${userId}:${year}`),
    revalidateTag(`contracts:${customerId}`),
    revalidateTag(`contracts:${supplierId}`),
  ]);
};

export const createContract = async (params: Contract, userId: string) => {
  const parsedPrice = parseFloat(
    params.price.replace(/\s/g, "").replace(",", ".")
  );
  const customerId = params.customerId;
  const supplierId = params.supplierId;
  if (isNaN(parsedPrice)) {
    return {
      success: false,
      message: "Invalid price format",
    };
  }

  try {
    const newContract = await db
      .insert(contracts)
      .values({
        userId,
        suppliersId: params.supplierId,
        customersId: params.customerId,
        number: params.number,
        data: params.data,
        subject: params.subject,
        price: parsedPrice.toString(),
        executionPeriod: params.executionPeriod,
      })
      .returning();

    const contractId = newContract[0].id;
    const year = newContract[0].executionPeriod.match(/\d{4}$/)?.[0] as string;

    await revalidateContractTags(
      contractId,
      userId,
      customerId,
      supplierId,
      year
    );

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newContract[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while creating the Contract",
    };
  }
};

export const deleteContract = async (contractId: string, userId: string) => {
  try {
    const contract = await db
      .select({
        executionPeriod: contracts.executionPeriod,
        customerId: contracts.customersId,
        supplierId: contracts.suppliersId,
      })
      .from(contracts)
      .where(eq(contracts.id, contractId))
      .limit(1);

    if (contract.length === 0) {
      return {
        success: false,
        message: "Contract not found",
      };
    }

    const invoiceCount = await db
      .select({ contractId: invoices.contractId })
      .from(invoices)
      .where(eq(invoices.contractId, contractId));

    if (invoiceCount.length > 0) {
      return {
        success: false,
        message:
          "Не можливо видалити договір так як його дані використовуються в накладних.",
      };
    }

    const year = contract[0].executionPeriod.match(/\d{4}$/)?.[0];
    const customerId = contract[0].customerId;
    const supplierId = contract[0].supplierId;

    if (!year) {
      return {
        success: false,
        message: "Invalid execution period format in contract",
      };
    }

    const result = await db
      .delete(contracts)
      .where(eq(contracts.id, contractId));

    await revalidateContractTags(
      contractId,
      userId,
      customerId,
      supplierId,
      year
    );

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while deleting contract",
    };
  }
};

export const updateContract = async (
  params: Contract,
  contractId: string,
  userId: string
) => {
  const parsedPrice = parseFloat(
    params.price.replace(/\s/g, "").replace(",", ".")
  );
  const customerId = params.customerId;
  const supplierId = params.supplierId;
  const year = params.executionPeriod.match(/\d{4}$/)?.[0] as string;
  if (isNaN(parsedPrice)) {
    return {
      success: false,
      message: "Invalid price format",
    };
  }

  try {
    const result = await db
      .update(contracts)
      .set({
        suppliersId: params.supplierId,
        customersId: params.customerId,
        number: params.number,
        data: params.data,
        subject: params.subject,
        price: parsedPrice.toString(),
        executionPeriod: params.executionPeriod,
      })
      .where(eq(contracts.id, contractId));

    await revalidateContractTags(
      contractId,
      userId,
      customerId,
      supplierId,
      year
    );

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to update сontract" };
  }
};

export type ContractSpecificationInsert = InferInsertModel<
  typeof contractSpecification
>;

export const createContractSpecification = async (
  params: ContractSpecification,
  userId: string,
  contractId: string
) => {
  try {
    const parsedSpecifications = params.specification.map((specification) => {
      const parsedQuantity = parseFloat(
        specification.quantity.replace(/\s/g, "").replace(",", ".")
      );
      const parsedPricePerUnit = parseFloat(
        specification.pricePerUnit.replace(/\s/g, "").replace(",", ".")
      );

      if (isNaN(parsedQuantity) || isNaN(parsedPricePerUnit)) {
        throw new Error("Invalid quantity or price format");
      }

      return {
        userId,
        contractId,
        productName: specification.productName,
        unit: specification.unit as ContractSpecificationInsert["unit"],
        quantity: parsedQuantity.toString(),
        pricePerUnit: parsedPricePerUnit.toString(),
      };
    });

    const newContractSpecification = await db
      .insert(contractSpecification)
      .values(parsedSpecifications)
      .returning();

    revalidateTag(`specification:${contractId}`);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newContractSpecification)),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while creating the specification",
    };
  }
};

export const deleteContractSpecification = async (id: string) => {
  try {
    const invoiceCount = await db
      .select({ contractId: invoices.contractId })
      .from(invoices)
      .where(eq(invoices.contractId, id));

    if (invoiceCount.length > 0) {
      return {
        success: false,
        message:
          "Не можливо видалити специфікацію так як товари з неї використовуються в накладних.",
      };
    }

    const result = await db
      .delete(contractSpecification)
      .where(eq(contractSpecification.contractId, id));

    revalidateTag(`specification:${id}`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while deleting specification",
    };
  }
};

export const updateContractSpecification = async (
  params: ContractSpecificationById[],
  deletedProducts: string[]
) => {
  try {
    const contractId = params[0]?.contractId;

    if (deletedProducts.length > 0) {
      const usedInInvoices = await db
        .select({ id: invoiceSpecification.contractSpecificationId })
        .from(invoiceSpecification)
        .where(
          inArray(invoiceSpecification.contractSpecificationId, deletedProducts)
        );

      if (usedInInvoices.length > 0) {
        return {
          success: false,
          message:
            "Не можна видалити товар(и) зі специфікації, оскільки вони вже використовуються в накладних.",
        };
      }

      await db
        .delete(contractSpecification)
        .where(inArray(contractSpecification.id, deletedProducts))
        .execute();
    }

    const parseNumber = (value: string) => {
      const parsed = parseFloat(value.replace(/\s/g, "").replace(",", "."));
      if (isNaN(parsed)) throw new Error("Invalid quantity or price format");
      return parsed.toString();
    };

    const newProducts = params.filter((item) => !item.id);
    if (newProducts.length > 0) {
      const parsedNewSpecifications = newProducts.map((specification) => ({
        userId: specification.userId,
        contractId: specification.contractId,
        productName: specification.productName,
        unit: specification.unit as ContractSpecificationInsert["unit"],
        quantity: parseNumber(specification.quantity),
        pricePerUnit: parseNumber(specification.pricePerUnit),
      }));

      await db
        .insert(contractSpecification)
        .values(parsedNewSpecifications)
        .execute();
    }

    const existingProducts = params.filter((item) => !!item.id);
    if (existingProducts.length > 0) {
      const parsedExistingSpecifications = existingProducts.map(
        (specification) => ({
          id: specification.id,
          userId: specification.userId,
          contractId: specification.contractId,
          productName: specification.productName,
          unit: specification.unit as ContractSpecificationInsert["unit"],
          quantity: parseNumber(specification.quantity),
          pricePerUnit: parseNumber(specification.pricePerUnit),
        })
      );

      await Promise.all(
        parsedExistingSpecifications.map(({ id, ...product }) =>
          db
            .update(contractSpecification)
            .set(product)
            .where(eq(contractSpecification.id, id))
            .execute()
        )
      );
    }

    revalidateTag(`specification:${contractId}`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update contract specifications",
    };
  }
};
