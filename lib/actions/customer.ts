"use server";

import { db } from "@/database/drizzle";
import {
  contracts,
  customerAddresses,
  customers,
  invoices,
} from "@/database/schema";
import { eq, inArray, and } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export const createCustomer = async (params: Customer, userId: string) => {
  try {
    const existingCustomer = await db
      .select({ edrpou: customers.edrpou })
      .from(customers)
      .where(
        and(eq(customers.edrpou, params.edrpou), eq(customers.userId, userId))
      )
      .limit(1);

    if (existingCustomer.length > 0) {
      return {
        success: false,
        message: "Замовник з таким кодом ЄДРПОУ вже існує",
      };
    }

    const newCustomer = await db
      .insert(customers)
      .values({
        userId,
        ...params,
      })
      .returning();

    revalidateTag(`customers:${userId}`);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newCustomer[0])),
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while creating the Customer",
    };
  }
};

export const deleteCustomer = async (customerId: string, userId: string) => {
  try {
    const contractCount = await db
      .select({ customerId: contracts.customersId })
      .from(contracts)
      .where(eq(contracts.customersId, customerId));

    const invoiceCount = await db
      .select({ customerId: invoices.customerId })
      .from(invoices)
      .where(eq(invoices.customerId, customerId));

    if (contractCount.length > 0 || invoiceCount.length > 0) {
      return {
        success: false,
        message:
          "Не можливо видалити Замовника так як його дані використовуються в договорах чи накладних.",
      };
    }

    const result = await db
      .delete(customers)
      .where(eq(customers.id, customerId));

    await revalidateTag(`customer:${customerId}`);
    await revalidateTag(`customers:${userId}`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        "Помилка при видалені замовника, можлива причина в тому тому, що дані замовника використовуються в накладних або договорах",
    };
  }
};

export const updatedCustomer = async (
  customerId: string,
  params: Customer,
  userId: string
) => {
  try {
    const result = await db
      .update(customers)
      .set({
        name: params.name,
        address: params.address,
        edrpou: params.edrpou,
        phoneNumber: params.phoneNumber,
        email: params.email,
      })
      .where(eq(customers.id, customerId));

    await revalidateTag(`customers:${userId}`);
    await revalidateTag(`customer:${customerId}`);

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Помилка при редагуванні замовника" };
  }
};

export const createCustomerAddress = async (
  params: CustomerAddresses,
  userId: string,
  customerId: string
) => {
  try {
    const newCustomerAddresses = await db
      .insert(customerAddresses)
      .values(
        params.addresses.map((address) => ({
          customersId: customerId,
          userId: userId,
          institutionName: address.institutionName,
          deliveryAddress: address.deliveryAddress,
        }))
      )
      .returning();

    await revalidateTag(`customer-addresses:${customerId}`);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newCustomerAddresses)),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Помилка при створенні адреси доставки",
    };
  }
};

export const deleteCustomerAddress = async (customerId: string) => {
  try {
    const addresses = await db
      .select({ id: customerAddresses.id })
      .from(customerAddresses)
      .where(eq(customerAddresses.customersId, customerId));
    
      if (addresses.length > 0) {
        const addressIds = addresses.map((address) => address.id);
      
        const invoicesUsingAddresses = await db
          .select({ id: invoices.id })
          .from(invoices)
          .where(inArray(
            invoices.customerAddressId,
            addressIds
          ));
      
        if (invoicesUsingAddresses.length > 0) {
          return {
            success: false,
            message: "Не можливо видалити адреси доставки, бо адреси даного замовника використовується в накладних",
          };
        }
      }
    

    const result = await db
      .delete(customerAddresses)
      .where(eq(customerAddresses.customersId, customerId));

    await revalidateTag(`customer-addresses:${customerId}`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        "Помилка при видаленні адреси доставки, можлива причина в тому, що дані адреси доставки використовуються в накладних",
    };
  }
};

export const updateCustomerAddress = async (
  params: CustomerAddressesById[],
  deletedAddresses: string[]
) => {
  try {
    if (deletedAddresses.length > 0) {
      await db
        .delete(customerAddresses)
        .where(inArray(customerAddresses.id, deletedAddresses))
        .execute();
    }

    const newAddresses = params.filter((item) => !item.id);

    if (newAddresses.length > 0) {
      await db
        .insert(customerAddresses)
        .values(
          newAddresses.map(({ id, ...address }) => ({
            ...address,
            customersId: address.customerId,
          }))
        )
        .execute();
    }

    const existingAddresses = params.filter((item) => !!item.id);

    if (existingAddresses.length > 0) {
      await Promise.all(
        existingAddresses.map(({ id, ...address }) =>
          db
            .update(customerAddresses)
            .set(address)
            .where(eq(customerAddresses.id, id))
            .execute()
        )
      );
    }

    if (params.length > 0) {
      const customerId = params[0].customerId;
      await revalidateTag(`customer-addresses:${customerId}`);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message:
        "Помилка при редагуванні адреси доставки, можлива причина в тому, що дані адреси доставки використовуються в накладних",
    };
  }
};
