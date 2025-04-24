"use server";

import { db } from "@/database/drizzle";
import { customerAddresses, customers } from "@/database/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

async function fetchCustomers(userId: string): Promise<Customers[]> {
  try {
    const customersList = await db
      .select()
      .from(customers)
      .where(eq(customers.userId, userId));

    return customersList;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const getCustomers = async (userId: string) => {
  const cachedFetch = unstable_cache(
    () => fetchCustomers(userId),
    [`getCustomers:${userId}`],
    {
      revalidate: 3600,
      tags: [`customers:${userId}`],
    }
  );

  return cachedFetch();
};

async function fetchCustomerById(id: string): Promise<CustomerById | null> {
  try {
    const customerById = await db
      .select()
      .from(customers)
      .where(eq(customers.id, id));

    if (customerById.length === 0) {
      return null;
    }

    return customerById[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const getCustomerById = async (id: string) => {
  const cachedFetch = unstable_cache(
    () => fetchCustomerById(id),
    [`getCustomerById:${id}`],
    {
      revalidate: 3600,
      tags: [`customer:${id}`],
    }
  );

  return cachedFetch();
};

async function fetchCustomersAddressById(
  customersId: string
): Promise<CustomerAddressesById[]> {
  try {
    const customersList = await db
      .select()
      .from(customerAddresses)
      .where(eq(customerAddresses.customersId, customersId));

    return customersList.map((item) => ({
      id: item.id,
      userId: item.userId,
      customerId: item.customersId,
      institutionName: item.institutionName,
      deliveryAddress: item.deliveryAddress,
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const getCustomersAddressById = async (customersId: string) => {
  const cachedFetch = unstable_cache(
    () => fetchCustomersAddressById(customersId),
    [`getCustomersAddressById:${customersId}`],
    {
      revalidate: 3600,
      tags: [`customer-addresses:${customersId}`],
    }
  );

  return cachedFetch();
};

async function fetchCustomerForInvoice(
  userId: string
): Promise<Pick<Customers, "id" | "name">[]> {
  try {
    const customersList = await db
      .select({
        id: customers.id,
        name: customers.name,
      })
      .from(customers)
      .where(eq(customers.userId, userId));

    return customersList;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const getCustomersForInvoice = async (userId: string) => {
  const cachedFetch = unstable_cache(
    () => fetchCustomerForInvoice(userId),
    [`getCustomersForInvoice:${userId}`],
    {
      revalidate: 3600,
      tags: [`customers:${userId}`],
    }
  );

  return cachedFetch();
};

async function fetchCustomerAddressForInvoice(
  customerId: string
): Promise<
  Pick<CustomerAddressesById, "id" | "institutionName" | "deliveryAddress">[]
  > {
  if (!customerId) {
    return [];
  }
  
  try {
    const addresses = await db
      .select({
        id: customerAddresses.id,
        institutionName: customerAddresses.institutionName,
        deliveryAddress: customerAddresses.deliveryAddress,
      })
      .from(customerAddresses)
      .where(eq(customerAddresses.customersId, customerId));

    return addresses.map((address) => ({
      id: address.id,
      institutionName: address.institutionName,
      deliveryAddress: address.deliveryAddress,
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const getCustomerAddressForInvoice = async (customerId: string) => {
  const cachedFetch = unstable_cache(
    () => fetchCustomerAddressForInvoice(customerId),
    [`getCustomerAddressForInvoice:${customerId}`],
    {
      revalidate: 3600,
      tags: [`customer-addresses:${customerId}`],
    }
  );

  return cachedFetch();
};
