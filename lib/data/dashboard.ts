"use server";


import { fetchTotalContractsSumBySupplier } from "./contract";
import { getTotalSumWithStatus } from "./invoice";

export async function getDashboardInfo(userId: string, year: string) {
  const [supplierSum, unpaidSum, paidSum] = await Promise.all([
    fetchTotalContractsSumBySupplier(userId, year),
    getTotalSumWithStatus(userId, "Неоплачена", year),
    getTotalSumWithStatus(userId, "Оплачена", year),
  ]);

  return { supplierSum, unpaidSum, paidSum };
}