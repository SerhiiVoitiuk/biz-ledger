import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { PencilIcon } from "@heroicons/react/24/outline";
import CustomersAddressInfo from "./CustomersAddressInfo";
import NotFoundCustomerAddress from "./NotFoundCustomerAddress";
import { getCustomersAddressById } from "@/lib/data/customer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CustomerInfo = async ({
  customerInfo,
}: {
  customerInfo: CustomerById;
}) => {
  const customerAddress = await getCustomersAddressById(customerInfo.id);

  return (
    <div className="flex flex-col w-full justify-between">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row justify-between">
          <h2 className="text-xl text-[#11191f] font-bold uppercase">
            Замовник
          </h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/customers/edit/${customerInfo.id}`} passHref>
                  <PencilIcon className="w-6 h-6" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>Редагувати замовника</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className="font-bold text-[#1f2124]">{customerInfo.name}</span>
        <h2 className="font-bold text-[#11191f]">
          Адреса:{" "}
          <span className="font-normal text-[#1f2124]">
            {customerInfo.address}
          </span>
        </h2>
        <h2 className="font-bold text-[#11191f]">
          Код ЄДРПОУ:{" "}
          <span className="font-normal text-[#1f2124]">
            {customerInfo.edrpou}
          </span>
        </h2>
        <h2 className="font-bold text-[#11191f]">
          Телефон:{" "}
          <span className="font-normal text-[#1f2124]">
            {customerInfo.phoneNumber}
          </span>
        </h2>
        <h2 className="font-bold text-[#11191f]">
          Електронна адреса:{" "}
          <span className="font-normal text-[#1f2124]">
            {customerInfo.email}
          </span>
        </h2>
      </div>

      <div className="mt-5">
        {!customerAddress || customerAddress.length === 0 ? (
          <>
            <Button
              className="rounded-lg px-3 py-3 text-xl font-bold bg-[#11191f]"
              asChild
            >
              <Link
                href={`/customers/customer/${customerInfo.id}/deliveryAddress/create`}
                className="text-[#ffffff] flex h-10 items-center"
              >
                Додати адресу доставки
              </Link>
            </Button>

            <NotFoundCustomerAddress />
          </>
        ) : (
          <CustomersAddressInfo
            customerAddress={customerAddress}
            customerInfoId={customerInfo.id}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerInfo;
