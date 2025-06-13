import {
  varchar,
  uuid,
  text,
  pgTable,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const suppliers = pgTable("suppliers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  edrpou: text("edrpou").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  bankAccount: text("bank_account").notNull(),
});

export const supplierDrivers = pgTable("supplier_drivers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  supplierId: uuid("supplier_id")
    .references(() => suppliers.id)
    .notNull(),
  lastName: text("driver_lastName").notNull(),
  firstName: text("driver_firstName").notNull(),
  middleName: text("driver_middleName").notNull(),
  driverLicense: text("driver_license").notNull(),
});

export const supplierCars = pgTable("supplier_cars", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  supplierId: uuid("supplier_id")
    .references(() => suppliers.id)
    .notNull(),
  name: text("car_name").notNull(),
  registration: text("car_registration").notNull(),
  owner: text("car_owner").notNull(),
  ownerAddress: text("owner_owner").notNull(),
});

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  edrpou: text("edrpou").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
});

export const contracts = pgTable("contracts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  suppliersId: uuid("suppliers_id")
    .references(() => suppliers.id)
    .notNull(),
  customersId: uuid("customers_id")
    .references(() => customers.id)
    .notNull(),
  number: text("number").notNull(),
  data: text("data").notNull(),
  subject: text("subject").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  executionPeriod: text("execution_period").notNull(),
});

export const customerAddresses = pgTable("customer_addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  customersId: uuid("customers_id")
    .references(() => customers.id)
    .notNull(),
  institutionName: text("institution_name").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
});

export const unitEnum = pgEnum("unit", ["кг", "г", "т", "л", "шт"]);

export const contractSpecification = pgTable("contract_specification", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  contractId: uuid("contract_id")
    .notNull()
    .references(() => contracts.id, { onDelete: "cascade" }),
  productName: text("product_name").notNull(),
  unit: unitEnum("unit").notNull(),
  quantity: numeric("quantity", {
    precision: 10,
    scale: 2,
  }).notNull(),
  pricePerUnit: numeric("price_per_unit", {
    precision: 10,
    scale: 2,
  }).notNull(),
});

export const invoiceStatus = pgEnum("invoice_status", [
  "Неоплачена",
  "Оплачена",
]);

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  data: text("data").notNull(),
  number: text("number").notNull(),
  supplierId: uuid("supplier_id")
    .references(() => suppliers.id)
    .notNull(),
  customerId: uuid("customer_id")
    .references(() => customers.id)
    .notNull(),
  customerAddressId: uuid("customer_address_id")
    .references(() => customerAddresses.id)
    .notNull(),
  contractId: uuid("contract_id")
    .references(() => contracts.id)
    .notNull(),
  status: invoiceStatus("invoice_status").default("Неоплачена"),
  paymentDate: text("payment_date"),
});

export const invoiceSpecification = pgTable("invoice_specification", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  invoiceId: uuid("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  contractSpecificationId: uuid("contract_specification_id")
    .references(() => contractSpecification.id)
    .notNull(),
  unit: unitEnum("unit").notNull(),
  quantity: numeric("quantity", {
    precision: 10,
    scale: 2,
  }).notNull(),
  pricePerUnit: numeric("price_per_unit", {
    precision: 10,
    scale: 2,
  }).notNull(),
});
