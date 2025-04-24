"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteCustomerAddress } from "@/lib/actions/customer";
import { ClipLoader } from "react-spinners";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const CustomersAddressInfo = ({
  customerAddress,
  customerInfoId,
}: {
  customerAddress: CustomerAddressesById[];
  customerInfoId: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async (customerId: string) => {
    try {
      setIsLoading(true);
      const result = await deleteCustomerAddress(customerId);
      if (result.success) {
        toast.success("Адреси доставки видалено успішно");
        router.refresh();
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Помилка при видаленні адрес доставки");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row gap-3">
        <Button
          className="rounded-lg px-3 py-3 text-xl w-50 font-bold bg-green-700"
          asChild
        >
          <Link
            href={`/customers/customer/${customerInfoId}/deliveryAddress/edit`}
            className="text-[#ffffff] flex h-10 items-center"
          >
            Редагувати адреси
          </Link>
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-lg px-3 py-3 w-50 text-xl font-bold bg-red-700 text-[#ffffff] flex h-10 items-center">
              {isLoading ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : (
                "Видалити адреси"
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Видалити адреси доставки</DialogTitle>
              <DialogDescription>
                Ви впевнені, що хочете видалити адреси доставки?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="bg-red-700 text-[#ffffff]"
                onClick={() => {
                  setOpen(false);
                  handleDelete(customerInfoId);
                }}
              >
                Видалити
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <h2 className="text-xl text-[#11191f] font-bold uppercase">
          Адреси доставки
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-[#11191f] text-center">
                Найменування установи
              </TableHead>
              <TableHead className="font-bold text-[#11191f] text-center">
                Адреса знаходження
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerAddress.map((address) => (
              <TableRow key={address.id}>
                <TableCell className="font-normal text-[#1f2124] break-words whitespace-normal">
                  {address.institutionName}
                </TableCell>
                <TableCell className="font-normal text-[#1f2124] break-words whitespace-normal">
                  {address.deliveryAddress}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomersAddressInfo;
