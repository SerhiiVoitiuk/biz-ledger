import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ButtonSupplier from "@/components/supplier/ButtonSupplier";

const SuppliersList = ({ suppliersList }: { suppliersList: Suppliers[] }) => {
  const userId = suppliersList[0]?.userId as string;

  return (
    <div className="mt-7 overflow-hidden bg-[#ffffff] p-4 rounded-2xl">
      <Accordion type="single" collapsible>
        {suppliersList.map((supplier) => (
          <AccordionItem key={supplier.id} value={supplier.id}>
            <AccordionTrigger>
              <div className="flex flex-row w-full justify-between">
                <h2 className="text-xl text-[#11191f] font-bold">
                  {supplier.name}
                </h2>
                <ButtonSupplier supplierId={supplier.id} userId={userId} />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <h2 className="text-xl font-bold text-[#11191f]">
                Адреса:{" "}
                <span className="font-normal text-[#1f2124]">
                  {supplier.address}
                </span>
              </h2>
              <h2 className="text-xl font-bold text-[#11191f]">
                Код ЄДРПОУ:{" "}
                <span className="font-normal text-[#1f2124]">
                  {supplier.edrpou}
                </span>
              </h2>
              <h2 className="text-xl font-bold text-[#11191f]">
                Телефон:{" "}
                <span className="font-normal text-[#1f2124]">
                  {supplier.phoneNumber}
                </span>
              </h2>
              <h2 className="text-xl font-bold text-[#11191f]">
                Електронна адреса:{" "}
                <span className="font-normal text-[#1f2124]">
                  {supplier.email}
                </span>
              </h2>
              <h2 className="text-xl font-bold text-[#11191f]">
                р/р:{" "}
                <span className="font-normal text-[#1f2124]">
                  {supplier.bankAccount}
                </span>
              </h2>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default SuppliersList;
