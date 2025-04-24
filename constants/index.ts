export const FIELD_NAMES = {
  fullName: "Full name",
  email: "Email",
  password: "Password",
};

export const FIELD_TYPES = {
  fullName: "text",
  email: "email",
  password: "password",
};

export const sideBarLinks = [
  {
    img: "/icons/home.svg",
    route: "/",
    text: "Головна",
  },
  {
    img: "/icons/suppliers.svg",
    route: "/suppliers",
    text: "Постачальники",
  },
  {
    img: "/icons/customer.svg",
    route: "/customers",
    text: "Замовники",
  },
  {
    img: "/icons/contract.svg",
    route: "/contracts",
    text: "Договора",
  },
  {
    img: "/icons/invoice.svg",
    route: "/invoices",
    text: "Накладні",
  },
];

export const unitValues: UnitOption[] = [
  { id: 1, name: "кг", fullName: "Кілограм" },
  { id: 2, name: "г", fullName: "Грам" },
  { id: 3, name: "т", fullName: "Тонна" },
  { id: 4, name: "л", fullName: "Літр" },
  { id: 5, name: "шт", fullName: "Штука" },
];

export const buttons = [
  {
    label: "Додати постачальника",
    href: "/suppliers/create",
  },
  {
    label: "Додати замовника",
    href: "/customers/create",
  },
  {
    label: "Додати договір",
    href: "/contracts/create",
  },
  {
    label: "Додати накладну",
    href: "/invoices/create",
  },
];

export const years = Array.from({ length: 2045 - 2025 + 1 }, (_, i) => (2025 + i).toString());