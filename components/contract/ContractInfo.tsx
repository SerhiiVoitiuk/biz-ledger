import { formatPrice } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { PencilIcon } from "@heroicons/react/24/outline";
import NotFoundContractSpecification from "./NotFoundContractSpecification";
import ContractSpecificationInfo from "./ContractSpecificationInfo";
import { getContractSpecification } from "@/lib/data/contract";
import {
  getPaidSumByContract,
  getUnpaidSumByContract,
} from "@/lib/data/invoice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ContractInfo = async ({
  contractInfo,
  userId,
}: {
  contractInfo: ContractInfo;
  userId: string;
}) => {
  const price = parseFloat(contractInfo.price);
  const formattedPrice = formatPrice(price.toString());
  const specification = await getContractSpecification(contractInfo.id);
  const paidTotal = await getPaidSumByContract(userId, contractInfo.id);
  const unpaidTotal = await getUnpaidSumByContract(userId, contractInfo.id);

  return (
    <div className="flex flex-col w-full justify-between">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row justify-between">
          <h2 className="text-xl text-[#11191f] font-bold uppercase">
            Договір
          </h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/contracts/edit/${contractInfo.id}`} passHref>
                  <PencilIcon className="w-6 h-6" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>Редагувати контракт</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <h2 className="font-bold text-[#11191f]">
          Номер договору:{" "}
          <span className="font-normal text-[#1f2124]">
            {contractInfo.number}
          </span>
        </h2>
        <h2 className="font-bold text-[#11191f]">
          Дата договору:{" "}
          <span className="font-normal text-[#1f2124]">
            {contractInfo.data}
          </span>
        </h2>
        <h2 className="font-bold text-[#11191f]">
          Замовник:{" "}
          <span className="font-normal text-[#1f2124]">
            {contractInfo.customer.name}
          </span>
        </h2>
        <h2 className="font-bold text-[#11191f]">
          Постачальник:{" "}
          <span className="font-normal text-[#1f2124]">
            {contractInfo.supplier.name}
          </span>
        </h2>
        <h2 className="font-bold text-[#11191f]">
          Предмет договору:{" "}
          <span className="font-normal text-[#1f2124]">
            {contractInfo.subject}
          </span>
        </h2>
        <h2 className="font-bold text-[#11191f]">
          Сума договору:{" "}
          <span className="font-normal text-[#1f2124]">
            {formattedPrice} грн
          </span>
        </h2>
        <h2 className="font-bold text-[#11191f]">
          Строк виконання договору:{" "}
          <span className="font-normal text-[#1f2124]">
            до {contractInfo.executionPeriod}
          </span>
        </h2>
        <h2 className="font-bold text-[#11191f]">
          Сума оплати за договором:{" "}
          <span className="font-normal text-[#1f2124]">
            {formatPrice(paidTotal)} грн
          </span>
        </h2>
        <h2 className="font-bold text-[#11191f]">
          Сума неоплачених накладних:{" "}
          <span className="font-normal text-[#1f2124]">
            {formatPrice(unpaidTotal)} грн
          </span>
        </h2>
      </div>

      <div className="mt-5">
        {!specification || specification.length === 0 ? (
          <>
            <Button
              className="rounded-lg px-3 py-3 text-xl font-bold bg-[#11191f]"
              asChild
            >
              <Link
                href={`/contracts/contract/${contractInfo.id}/specification/create`}
                className="text-[#ffffff] flex h-10 items-center"
              >
                Додати специцифікацію
              </Link>
            </Button>

            <NotFoundContractSpecification />
          </>
        ) : (
          <ContractSpecificationInfo
            specification={specification}
            contractId={contractInfo.id}
          />
        )}
      </div>
    </div>
  );
};

export default ContractInfo;
