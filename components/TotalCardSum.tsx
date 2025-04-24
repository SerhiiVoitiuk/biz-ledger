import { formatPrice } from "@/lib/utils";
import React from "react";

const TotalCardSum = ({
  totalSumBySupplier,
  label,
}: {
  totalSumBySupplier: totalSumBySupplier[];
  label: string;
}) => {
  return (
    <div className="flex flex-col gap-3 mt-7 basis-0 flex-grow">
      {totalSumBySupplier.map((item) => (
        <div
          key={item.supplierId}
          className="rounded-2xl bg-[#ffffff] p-3 shadow-sm space-y-2"
        >
          <h2 className="text-xl font-bold text-center text-[#11191f]">
            {item.supplierName}
          </h2>
          <div className="text-lg p-1.5 text-center rounded-2xl text-[#ffffff] bg-[#233038]">
            {label}{" "}
            <p className="font-bold">{formatPrice(item.totalPrice)} грн</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TotalCardSum;
