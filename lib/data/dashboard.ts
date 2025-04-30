"use server";


import { fetchTotalContractsSumBySupplier } from "./contract";
import { getTotalSumWithStatus, getQuarterlyPaidInvoiceSumsBySupplier } from "./invoice";

export async function getDashboardInfo(userId: string, year: string) {
  const [supplierSum, unpaidSum, paidSum, quarterlySum] = await Promise.all([
    fetchTotalContractsSumBySupplier(userId, year),
    getTotalSumWithStatus(userId, "Неоплачена", year),
    getTotalSumWithStatus(userId, "Оплачена", year),
    getQuarterlyPaidInvoiceSumsBySupplier(userId, year),
  ]);

  return { supplierSum, unpaidSum, paidSum, quarterlySum };
}