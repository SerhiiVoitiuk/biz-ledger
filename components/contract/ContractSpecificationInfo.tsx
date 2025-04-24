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
import { deleteContractSpecification } from "@/lib/actions/сontract";
import { formatPrice, formatQuantity } from "@/lib/utils";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ContractSpecificationInfo = ({
  contractId,
  specification,
}: {
  contractId: string;
  specification: ContractSpecificationById[];
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const result = await deleteContractSpecification(id);
      if (result.success) {
        toast.success("Специфікацію успішно видалено");
        router.refresh();
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("ПОмилка при видаліені специфікації");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row gap-3">
        <Button
          className="rounded-lg w-70 px-3 py-3 text-xl font-bold bg-green-700"
          asChild
        >
          <Link
            href={`/contracts/contract/${contractId}/specification/edit`}
            className="text-[#ffffff] flex h-10 items-center"
          >
            Редагувати специфікацію
          </Link>
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-lg w-70 px-3 py-3 text-xl font-bold bg-red-700 text-[#ffffff] flex h-10 items-center">
              {isLoading ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : (
                "Видалити специфікацію"
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Видалити специфікацію</DialogTitle>
              <DialogDescription>
                Ви впевнені, що хочете видалити специфікацію до даного договору?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="bg-red-700 text-[#ffffff]"
                onClick={() => {
                  setOpen(false);
                  handleDelete(contractId);
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
          Специфікація
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-[#11191f] text-center">
                Найменування товару
              </TableHead>
              <TableHead className="font-bold text-[#11191f] text-center">
                Одиниця виміру
              </TableHead>
              <TableHead className="font-bold text-[#11191f] text-center">
                Кількість
              </TableHead>
              <TableHead className="font-bold text-[#11191f] text-center">
                Залишок
              </TableHead>
              <TableHead className="font-bold text-[#11191f] text-center">
                Ціна за одиницю товару
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {specification.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-normal text-center text-[#1f2124]">
                  {item.productName}
                </TableCell>
                <TableCell className="font-normal text-center text-[#1f2124]">
                  {item.unit}
                </TableCell>
                <TableCell className="font-normal text-center text-[#1f2124]">
                  {formatQuantity(item.quantity)}
                </TableCell>
                <TableCell className="font-normal text-center text-[#1f2124]">
                  {item.quantityDifference}
                </TableCell>
                <TableCell className="font-normal text-center text-[#1f2124]">
                  {formatPrice(item.pricePerUnit)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ContractSpecificationInfo;
