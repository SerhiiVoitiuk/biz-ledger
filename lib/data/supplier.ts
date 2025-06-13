import { db } from "@/database/drizzle";
import { supplierCars, supplierDrivers, suppliers } from "@/database/schema";
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

async function fetchSupplierDrivers(
  supplierId: string
): Promise<SupplierDriversById[]> {
  try {
    const driversList = await db
      .select()
      .from(supplierDrivers)
      .where(eq(supplierDrivers.supplierId, supplierId));

    return driversList.map((item) => ({
      id: item.id,
      userId: item.userId,
      supplierId: item.supplierId,
      driverLicense: item.driverLicense,
      lastName: item.lastName,
      firstName: item.firstName,
      middleName: item.middleName,
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const getSupplierDriver = async (supplierId: string) => {
  const cachedFetch = unstable_cache(
    () => fetchSupplierDrivers(supplierId),
    [`getSupplierDriver:${supplierId}`],
    {
      revalidate: 3600,
      tags: [`driver:${supplierId}`],
    }
  );

  return cachedFetch();
};

async function fetchSupplierDriverById(driverId: string): Promise<SupplierDriversById | null> {
  try {
    const driverById = await db
      .select()
      .from(supplierDrivers)
      .where(eq(supplierDrivers.id, driverId));

    if (driverById.length === 0) {
      return null;
    }

    return driverById[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getSupplierDriverById= async (driverId: string) => {
  const cachedFetch = unstable_cache(
    () => fetchSupplierDriverById(driverId),
    [`getSupplierDriverById:${driverId}`],
    {
      revalidate: 3600,
      tags: [`cars:${driverId}`],
    }
  );

  return cachedFetch();
};

async function fetchSupplierCars(
  supplierId: string
): Promise<SupplierCarsById[]> {
  try {
    const carsList = await db
      .select()
      .from(supplierCars)
      .where(eq(supplierCars.supplierId, supplierId));

    return carsList.map((item) => ({
      id: item.id,
      userId: item.userId,
      supplierId: item.supplierId,
      name: item.name,
      registration: item.registration,
      owner: item.owner,
      ownerAddress: item.ownerAddress,
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const getSupplierCar = async (supplierId: string) => {
  const cachedFetch = unstable_cache(
    () => fetchSupplierCars(supplierId),
    [`getSupplierCar:${supplierId}`],
    {
      revalidate: 3600,
      tags: [`cars:${supplierId}`],
    }
  );

  return cachedFetch();
};

async function fetchSupplierCarById(carId: string): Promise<SupplierCarsById | null> {
  try {
    const [carById] = await db
      .select()
      .from(supplierCars)
      .where(eq(supplierCars.id, carId));

    if (!carById) {
      return null;
    }

    return carById;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getSupplierCarById = async (carId: string) => {
  const cachedFetch = unstable_cache(
    () => fetchSupplierCarById(carId),
    [`getSupplierCarById:${carId}`],
    {
      revalidate: 3600,
      tags: [`cars:${carId}`],
    }
  );

  return cachedFetch();
};