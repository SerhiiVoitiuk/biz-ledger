"use server";

import { db } from "@/database/drizzle";
import { contracts, invoices, supplierCars, supplierDrivers, suppliers } from "@/database/schema";
import { eq, and, inArray, sql } from "drizzle-orm";
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

export const createSupplierDrivers = async (
  params: SupplierDrivers,
  userId: string,
  supplierId: string
) => {
  try {
    const newSupplierDrivers = await db
      .insert(supplierDrivers)
      .values(
        params.drivers.map((driver) => ({
          supplierId: supplierId,
          userId: userId,
          lastName: driver.lastName,
          firstName: driver.firstName,
          middleName: driver.middleName,
          driverLicense: driver.driverLicense,
        }))
      )
      .returning();

    await revalidateTag(`driver:${supplierId}`);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newSupplierDrivers)),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Помилка при створенні адреси доставки",
    };
  }
};


export const deleteSupplierDrivers = async (supplierId: string) => {
  try {   
    const result = await db
      .delete(supplierDrivers)
      .where(eq(supplierDrivers.supplierId, supplierId));

    await revalidateTag(`driver:${supplierId}`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        "Помилка при видаленні водія(-їв)",
    };
  }
};

export const updateSupplierDrivers = async (
  params: SupplierDriversById[],
  deletedDrivers: string[]
) => {
  try {
    if (deletedDrivers.length > 0) {
      await db
        .delete(supplierDrivers)
        .where(inArray(supplierDrivers.id, deletedDrivers))
        .execute();
    }

    const newDrivers = params.filter((item) => !item.id);

    if (newDrivers.length > 0) {
      await db
        .insert(supplierDrivers)
        .values(
          newDrivers.map(({ id, ...drivers }) => ({
            ...drivers,
            supplierId: drivers.supplierId,
          }))
        )
        .execute();
    }

    const existingDrivers = params.filter((item) => !!item.id);

    if (existingDrivers.length > 0) {
      await Promise.all(
        existingDrivers.map(({ id, ...drivers }) =>
          db
            .update(supplierDrivers)
            .set(drivers)
            .where(eq(supplierDrivers.id, id))
            .execute()
        )
      );
    }

    if (params.length > 0) {
      const supplierId = params[0].supplierId;
      await revalidateTag(`driver:${supplierId}`);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message:
        "Помилка при редагуванні водія(-їв)",
    };
  }
};

export const createSupplierCars = async (
  params: SupplierCars,
  userId: string,
  supplierId: string
) => {
  try {
    const newSupplierCars = await db
      .insert(supplierCars)
      .values(
        params.cars.map((car) => ({
          supplierId: supplierId,
          userId: userId,
          name: car.name,
          registration: car.registration,
          owner: car.owner,
          ownerAddress: car.ownerAddress,
        }))
      )
      .returning();

    await revalidateTag(`cars:${supplierId}`);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newSupplierCars)),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Помилка при створенні адреси доставки",
    };
  }
};

export const deleteSupplierCars = async (supplierId: string) => {
  try { 
    const result = await db
      .delete(supplierCars)
      .where(eq(supplierCars.supplierId, supplierId));

    await revalidateTag(`cars:${supplierId}`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        "Помилка при видаленні автомобіля(-ів)",
    };
  }
};

export const updateSupplierCars = async (
  params: SupplierCarsById[],
  deletedCars: string[]
) => {
  try {
    if (deletedCars.length > 0) {
      await db
        .delete(supplierCars)
        .where(inArray(supplierCars.id, deletedCars))
        .execute();
    }

    const newCars = params.filter((item) => !item.id);

    if (newCars.length > 0) {
      await db
        .insert(supplierCars)
        .values(
          newCars.map(({ id, ...cars }) => ({
            ...cars,
            supplierId: cars.supplierId,
          }))
        )
        .execute();
    }

    const existingCars = params.filter((item) => !!item.id);

    if (existingCars.length > 0) {
      await Promise.all(
        existingCars.map(({ id, ...cars }) =>
          db
            .update(supplierCars)
            .set(cars)
            .where(eq(supplierCars.id, id))
            .execute()
        )
      );
    }

    if (params.length > 0) {
      const supplierId = params[0].supplierId;
      await revalidateTag(`cars:${supplierId}`);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message:
        "Помилка при редагуванні автомобіля (-ів) постачальника",
    };
  }
};