import { formatPrice } from "@/lib/utils";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EyeIcon } from "@heroicons/react/24/outline";

const TotalCardSum = ({
  totalSumBySupplier,
  label,
  quarterlySum,
  showTooltip,
}: {
  totalSumBySupplier: totalSumBySupplier[];
  quarterlySum?: quarterlySumBySupplier[];
  label: string;
  showTooltip?: boolean;
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

          <div className="relative">
            <div className="text-lg p-1.5 text-center rounded-2xl text-[#ffffff] bg-[#233038]">
              {label}{" "}
              <p className="font-bold">{formatPrice(item.totalPrice)} грн</p>
              {showTooltip && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute top-2 right-2 cursor-pointer">
                      <EyeIcon className="h-5 w-5" />
                    </div>
                  </TooltipTrigger>

                  <TooltipContent>
                    <div className="flex flex-col gap-1">
                      {["1", "2", "3", "4"].map((q) => {
                        const quarterData = quarterlySum?.find(
                          (qs) =>
                            qs.supplierId === item.supplierId &&
                            qs.quarter?.toString() === q
                        );

                        return (
                          <div
                            key={`${item.supplierId}-${q}`}
                            className="flex justify-between gap-2"
                          >
                            <span>За {q} квартал:</span>
                            <span>
                              {quarterData
                                ? formatPrice(quarterData.totalPrice)
                                : "0.00"}{" "}
                              грн
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TotalCardSum;
