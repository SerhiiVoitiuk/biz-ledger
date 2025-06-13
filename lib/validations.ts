import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const suppliersSchema = z.object({
  name: z.string().trim().min(2).max(1000),
  address: z.string().trim().min(2).max(100),
  edrpou: z.string().trim().min(2).max(100),
  phoneNumber: z.string().trim().min(2).max(100),
  email: z.string().trim().min(2).max(100),
  bankAccount: z.string().trim().min(2).max(100),
});

export const customersSchema = z.object({
  name: z.string().trim().min(3, "Required").max(1000),
  address: z.string().trim().min(1, "Required").max(100),
  edrpou: z.string().trim().min(6, "Required").max(100),
  phoneNumber: z.string().trim().min(5, "Required").max(100),
  email: z.string().trim().min(5, "Required").max(100),
});

export const contractsSchema = z.object({
  customerId: z.string().trim().min(2).max(1000),
  supplierId: z.string().trim().min(2).max(1000),
  number: z.string().trim().min(1, "Required").max(100),
  data: z.string().trim().min(2).max(100),
  subject: z.string().trim().min(1, "Required").max(1000),
  price: z.string().trim().min(1, "Required").max(1000),
  executionPeriod: z.string().trim().min(1, "Required").max(100),
});

export const customerAddressesSchema = z.object({
  addresses: z.array(
    z.object({
      institutionName: z.string().min(1, "Required"),
      deliveryAddress: z.string().min(1, "Required"),
    })
  ),
});

export const customerAddressesEditSchema = z.object({
  addresses: z.array(
    z.object({
      id: z.string().min(1, "ID is required"),
      userId: z.string().min(1, "User ID is required"),
      customerId: z.string().min(1, "Customer ID is required"),
      institutionName: z.string().min(1, "Required"),
      deliveryAddress: z.string().min(1, "Required"),
    })
  ),
});

export const unitEnumValues = ["кг", "г", "т", "л", "шт"] as const;

export const contractSpecificationSchema = z.object({
  specification: z.array(
    z.object({
      productName: z.string().trim().min(1, "Required"),
      unit: z.enum(unitEnumValues, { message: "Invalid unit" }),
      quantity: z.string().min(1, "Required"),
      pricePerUnit: z.string().min(1, "Required"),
    })
  ),
});

export const contractSpecificationEditSchema = z.object({
  specification: z.array(
    z.object({
      id: z.string().min(1, "ID is required"),
      userId: z.string().min(1, "User ID is required"),
      contractId: z.string().min(1, "Customer ID is required"),
      productName: z.string().trim().min(1, "Required"),
      unit: z.enum(unitEnumValues, { message: "Invalid unit" }),
      quantity: z.string().min(1, "Required"),
      pricePerUnit: z.string().min(1, "Required"),
    })
  ),
});

const invoiceStatusEnum = z.enum(["Неоплачена", "Оплачена"]);

export const invoicesSchema = z
  .object({
    customerId: z.string().min(1, "Customer ID is required"),
    supplierId: z.string().min(1, "Supplier ID is required"),
    customerAddressId: z.string().min(1, "Customer Address  ID is required"),
    contractId: z.string().min(1, "Contract ID is required"),
    number: z.string().trim().min(1, "Required").max(100),
    data: z.string().trim().min(2).max(100),
    status: invoiceStatusEnum.default("Неоплачена"),
    paymentDate: z.string().optional(),
    specification: z.array(
      z.object({
        contractSpecificationId: z
          .string()
          .min(1, "Contract Specification ID is required"),
        unit: z.enum(unitEnumValues, { message: "Invalid unit" }),
        quantity: z.string().min(1, "Required"),
        pricePerUnit: z.string().min(1, "Required"),
      })
    ),
  })
  .refine(
    (data) => {
      if (data.status === "Оплачена") {
        return !!data.paymentDate && data.paymentDate.length > 0;
      }
      return true;
    },
    {
      message: "Дата оплати обов'язкова, якщо рахунок оплачено",
      path: ["paymentDate"],
    }
  );

export const supplierDriversSchema = z.object({
  drivers: z.array(
    z.object({
      lastName: z.string().min(1, "Required"),
      firstName: z.string().min(1, "Required"),
      middleName: z.string().min(1, "Required"),
      driverLicense: z.string().min(1, "Required"),
    })
  ),
});

export const supplierDriversSchemaEditSchema = z.object({
  drivers: z.array(
    z.object({
      id: z.string().min(1, "ID is required"),
      userId: z.string().min(1, "User ID is required"),
      supplierId: z.string().min(1, "Customer ID is required"),
      lastName: z.string().min(1, "Required"),
      firstName: z.string().min(1, "Required"),
      middleName: z.string().min(1, "Required"),
      driverLicense: z.string().min(1, "Required"),
    })
  ),
});

export const supplierCarsSchema = z.object({
  cars: z.array(
    z.object({
      name: z.string().min(1, "Required"),
      registration: z.string().min(1, "Required"),
      owner: z.string().min(1, "Required"),
      ownerAddress: z.string().min(1, "Required"),
    })
  ),
});


export const supplierCarsEditSchema = z.object({
  cars: z.array(
    z.object({
      id: z.string().min(1, "ID is required"),
      userId: z.string().min(1, "User ID is required"),
      supplierId: z.string().min(1, "Customer ID is required"),
      name: z.string().min(1, "Required"),
      registration: z.string().min(1, "Required"),
      owner: z.string().min(1, "Required"),
      ownerAddress: z.string().min(1, "Required"),
    })
  ),
});

export const ttnSchema = z.object({
  carId: z.string().min(1, "Car ID is required"),
  driverId: z.string().min(1, "Driver ID is required"),
});