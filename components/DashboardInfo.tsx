"use client";

import React, { useState, useTransition } from "react";

import TotalCardSum from "@/components/TotalCardSum";
import HomeButtons from "@/components/HomeButtons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { years } from "@/constants";
import { TotalCardSumSkeleton } from "./TotalCardSumSkeleton";
import { getDashboardInfo } from "@/lib/data/dashboard";


type DashboardData = {
  supplierSum: totalSumBySupplier[];
  unpaidSum: totalSumBySupplier[];
  paidSum: totalSumBySupplier[];
  quarterlySum: quarterlySumBySupplier[];
};

export function DashboardInfo({
  userId,
  initialData,
}: {
  userId: string;
  initialData: DashboardData;
}) {
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [data, setData] = useState<DashboardData>(initialData);
  const [isPending, startTransition] = useTransition();

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    startTransition(async () => {
      const newData = await getDashboardInfo(userId, year);
      setData(newData);
    });
  };

  const contractsYearSumLabel = `Cума договорів за ${selectedYear} рік:`;
  const paidInvoiceYearSumLabel = `Оплачені накладні за ${selectedYear} рік:`;
  const unPaidInvoiceYearSumLabel = `Неоплачені накладні за ${selectedYear} рік:`;

  return (
    <>
      <div className="flex flex-row justify-between mt-7">
        <Select value={selectedYear} onValueChange={handleYearChange}>
          <SelectTrigger className="flex rounded-lg w-45 font-bold bg-[#11191f] text-white placeholder:text-white cursor-pointer">
            <SelectValue placeholder="Виберіть рік" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto font-bold text-[#11191f]">
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <HomeButtons />
      </div>

      <div className="flex flex-row w-full gap-3">
        {isPending ? (
          <>
            <TotalCardSumSkeleton />
            <TotalCardSumSkeleton />
            <TotalCardSumSkeleton />
          </>
        ) : (
          <>
            <TotalCardSum
              label={contractsYearSumLabel}
              totalSumBySupplier={data.supplierSum}
            />
            <TotalCardSum
              label={paidInvoiceYearSumLabel}
              totalSumBySupplier={data.paidSum}
              quarterlySum={data.quarterlySum}
              showTooltip={true}
            />
            <TotalCardSum
              label={unPaidInvoiceYearSumLabel}
              totalSumBySupplier={data.unpaidSum}
            />
          </>
        )}
      </div>
    </>
  );
}
