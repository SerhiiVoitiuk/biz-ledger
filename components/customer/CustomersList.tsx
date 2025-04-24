import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ButtonCustomer from "@/components/customer/ButtonCustomer";

const CustomersList = ({ customersList }: { customersList: Customers[] }) => {
  const userId = customersList[0]?.userId as string;

  return (
    <div className="mt-7 overflow-hidden bg-[#ffffff] p-4 rounded-2xl">
      <Accordion type="single" collapsible>
        {customersList.map((customers) => (
          <AccordionItem key={customers.id} value={customers.id}>
            <AccordionTrigger className="pr-0 [&>svg]:hidden">
              <div className="flex flex-row w-full justify-between">
                <h2 className="text-xl text-[#11191f] font-bold">
                  {customers.name}
                </h2>
                <ButtonCustomer customersId={customers.id} userId={userId}/>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <h2 className="text-xl font-bold text-[#11191f]">
                Адреса:{" "}
                <span className="font-normal text-[#1f2124]">
                  {customers.address}
                </span>
              </h2>
              <h2 className="text-xl font-bold text-[#11191f]">
                Код ЄДРПОУ:{" "}
                <span className="font-normal text-[#1f2124]">
                  {customers.edrpou}
                </span>
              </h2>
              <h2 className="text-xl font-bold text-[#11191f]">
                Телефон:{" "}
                <span className="font-normal text-[#1f2124]">
                  {customers.phoneNumber}
                </span>
              </h2>
              <h2 className="text-xl font-bold text-[#11191f]">
                Електронна адреса:{" "}
                <span className="font-normal text-[#1f2124]">
                  {customers.email}
                </span>
              </h2>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CustomersList;
