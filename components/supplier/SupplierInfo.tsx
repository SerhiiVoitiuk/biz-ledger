import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { PencilIcon } from "@heroicons/react/24/outline";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSupplierCar, getSupplierDriver } from "@/lib/data/supplier";
import NotFoundDrivers from "./NotFoundDrivers";
import DriversInfo from "./DriversInfo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import NotFoundCars from "./NotFoundCars";
import CarsInfo from "./CarsInfo";

const SupplierInfo = async ({
  supplierInfo,
}: {
  supplierInfo: SupplierById;
}) => {
  const supplierDriver = await getSupplierDriver(supplierInfo.id);
  const supplierCar = await getSupplierCar(supplierInfo.id);

  return (
    <div className="flex flex-col w-full justify-between">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row justify-between">
          <h2 className="text-xl text-[#11191f] font-bold uppercase">
            Постачальник
          </h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/suppliers/edit/${supplierInfo.id}`} passHref>
                  <PencilIcon className="w-6 h-6" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>Редагувати постачальника</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className="font-bold text-[#1f2124]">{supplierInfo.name}</span>
        <h2 className="font-bold text-[#11191f]">
          Адреса:{" "}
          <span className="font-normal text-[#1f2124]">
            {supplierInfo.address}
          </span>
        </h2>
        <h2 className="font-bold text-[#11191f]">
          Код ЄДРПОУ:{" "}
          <span className="font-normal text-[#1f2124]">
            {supplierInfo.edrpou}
          </span>
        </h2>
        <h2 className="font-bold text-[#11191f]">
          Телефон:{" "}
          <span className="font-normal text-[#1f2124]">
            {supplierInfo.phoneNumber}
          </span>
        </h2>
        <h2 className="font-bold text-[#11191f]">
          Електронна адреса:{" "}
          <span className="font-normal text-[#1f2124]">
            {supplierInfo.email}
          </span>
        </h2>
      </div>

      <div className="mt-5">
        <Accordion type="single" collapsible>
          <AccordionItem value="Drivers">
            <AccordionTrigger>
              <h2 className="text-xl text-[#11191f] font-bold uppercase">
                Водій (-ї) постачальника
              </h2>
            </AccordionTrigger>
            <AccordionContent>
              {!supplierDriver || supplierDriver.length === 0 ? (
                <>
                  <Button
                    className="rounded-lg px-3 py-3 text-xl font-bold bg-[#11191f]"
                    asChild
                  >
                    <Link
                      href={`/suppliers/supplier/${supplierInfo.id}/drivers/create`}
                      className="text-[#ffffff] flex h-10 items-center"
                    >
                      Додати водія
                    </Link>
                  </Button>

                  <NotFoundDrivers />
                </>
              ) : (
                <DriversInfo
                  supplierDriver={supplierDriver}
                  supplierInfoId={supplierInfo.id}
                />
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="Cars">
            <AccordionTrigger>
              <h2 className="text-xl text-[#11191f] font-bold uppercase">
                Автомобіль (-і) постачальника
              </h2>
            </AccordionTrigger>
            <AccordionContent>
              {!supplierCar || supplierCar.length === 0 ? (
                <>
                  <Button
                    className="rounded-lg px-3 py-3 text-xl font-bold bg-[#11191f]"
                    asChild
                  >
                    <Link
                      href={`/suppliers/supplier/${supplierInfo.id}/car/create`}
                      className="text-[#ffffff] flex h-10 items-center"
                    >
                      Додати автомобіль
                    </Link>
                  </Button>

                  <NotFoundCars />
                </>
              ) : (
                <CarsInfo
                  supplierCars={supplierCar}
                  supplierInfoId={supplierInfo.id}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default SupplierInfo;
