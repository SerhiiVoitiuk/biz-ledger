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
import { deleteSupplierCars } from "@/lib/actions/supplier";

const CarsInfo = ({
  supplierCars,
  supplierInfoId,
}: {
  supplierCars: SupplierCarsById[];
  supplierInfoId: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async (supplierId: string) => {
    try {
      setIsLoading(true);
      const result = await deleteSupplierCars(supplierId);
      if (result.success) {
        toast.success("Автомобіль (-і) успішно видалено");
        router.refresh();
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Помилка при видаленні автомобіля (-ів)");
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
            href={`/suppliers/supplier/${supplierInfoId}/car/edit`}
            className="text-[#ffffff] flex h-10 items-center"
          >
            Редагувати
          </Link>
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-lg px-3 py-3 w-50 text-xl font-bold bg-red-700 text-[#ffffff] flex h-10 items-center">
              {isLoading ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : (
                "Видалити"
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Видалити автомобіль (-і)</DialogTitle>
              <DialogDescription>
                Ви впевнені, що хочете видалити автомобіль (-і)?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="bg-red-700 text-[#ffffff]"
                onClick={() => {
                  setOpen(false);
                  handleDelete(supplierInfoId);
                }}
              >
                Видалити
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-[#11191f] text-center">
                Найменування автомобіля
              </TableHead>
              <TableHead className="font-bold text-[#11191f] text-center">
                Номерний знак автомобіля
              </TableHead>
              <TableHead className="font-bold text-[#11191f] text-center">
                Дані власника автомобіля (ПІБ)
              </TableHead>
              <TableHead className="font-bold text-[#11191f] text-center">
                Адреса власника автомобіля
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supplierCars.map((car) => (
              <TableRow key={car.id}>
                <TableCell className="font-normal text-[#1f2124] break-words whitespace-normal text-center">
                  {car.name}
                </TableCell>
                <TableCell className="font-normal text-[#1f2124] break-words whitespace-normal text-center">
                  {car.registration}
                </TableCell>
                <TableCell className="font-normal text-[#1f2124] break-words whitespace-normal text-center">
                  {car.owner}
                </TableCell>
                <TableCell className="font-normal text-[#1f2124] break-words whitespace-normal text-center">
                  {car.ownerAddress}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CarsInfo;
