interface Auth {
  fullName: string;
  email: string;
  password: string;
}

interface Supplier {
  name: string;
  address: string;
  edrpou: string;
  phoneNumber: string;
  email: string;
  bankAccount: string;
}

interface Suppliers extends Supplier {
  id: string;
  userId?: string;
}

interface SupplierById extends Supplier {
  id: string;
  userId: string;
}

interface Customer {
  name: string;
  address: string;
  edrpou: string;
  phoneNumber: string;
  email: string;
}

interface Customers extends Customer {
  userId?: string;
  id: string;
}

interface CustomerById extends Customer {
  id: string;
  userId: string;
}

interface Contract {
  customerId: string;
  supplierId: string;
  number: string;
  data: string;
  subject: string;
  price: string;
  executionPeriod: string;
}

interface ContractTables extends Contract { 
  id: string;
  userId: string;
  customerName: string;
  supplierName: string;
}

interface ContractById extends Contract {
  id: string;
}

interface ContractInfo extends Contract {
  id: string;
  customer: CustomerById;
  supplier: SupplierById;
}

interface Driver {
  id?: string;
  lastName: string;
  firstName: string;
  middleName: string;
  driverLicense: string;
}

interface Car {
  id?: string;
  name: string;
  registration: string;
  owner: string;
  ownerAddress: string;
}

interface SupplierCars {
  cars: Car[];
}

interface SupplierCarsById extends Car {
  id: string;
  userId: string;
  supplierId: string;
}

interface SupplierDrivers {
  drivers: Driver[];
}

interface SupplierDriversById extends Driver {
  id: string;
  userId: string;
  supplierId: string;
}


interface Address {
  id?: string;
  institutionName: string;
  deliveryAddress: string;
}

interface CustomerAddresses {
  addresses: Address[];
}

interface CustomerAddressesById extends Address {
  id: string;
  userId: string;
  customerId: string;
}


type UnitType = typeof unitEnumValues[number];

interface Specification {
  productName: string;
  unit: UnitType;
  quantity: string;
  pricePerUnit: string
}

interface ContractSpecification{
  specification: Specification[];
}

interface ContractSpecificationById extends Specification {
  id: string;
  userId: string;
  contractId: string;
  quantityDifference?: number;
}

type UnitOption = {
  id: number;
  name: string;
  fullName: string;
};

interface SpecificationForInvoice {
  id?: string;
  userId?: string;
  contractSpecificationId: string;
  productName?: string;
  unit: UnitType;
  quantity: string;
  pricePerUnit: string;
  sum?: number;
};

type InvoiceStatus = "Неоплачена" | "Оплачена";

interface Invoice {
  customerId: string;
  supplierId: string;
  customerAddressId: string;
  contractId: string;
  number: string;
  data: string;
  status?: InvoiceStatus;
  paymentDate?: string | null;
  specification: SpecificationForInvoice[];
};

interface InvoiceTable {
  id: string;
  number: string;
  data: string;
  supplierId: string;
  customerId: string;
  status: InvoiceStatus | null;
  customerName: string | null;
  supplierName: string | null;
  totalAmount: number;
}

interface InvoiceById extends Invoice {
  id: string;
  userId?: string;
  status?: InvoiceStatus | null;
  customerName: string;
  supplierName: string;
  supplierAddress?: string;
  supplierBankAccount?: string;
  supplierEDRPOU?: string;
  supplierPhoneNumber?: string;
  institutionName: string;
  deliveryAddress: string;
  contractData: string;
  contractNumber: string;
  contractSubject?: string;
  totalAmount?: number;
}

interface totalSumBySupplier {
  supplierId: string;
  supplierName: string;
  totalPrice: number;
}

interface quarterlySumBySupplier {
  supplierId: string;
  supplierName: string;
  quarter: number;
  totalPrice: number;
}