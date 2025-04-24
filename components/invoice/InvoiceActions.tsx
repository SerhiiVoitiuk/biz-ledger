"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { deleteInvoice } from "@/lib/actions/invoice";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";

interface Props {
  invoiceId: string;
}

const InvoiceActions = ({ invoiceId }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteInvoice(id);
      toast.success("Накладну видалено успішно");
      router.refresh();
      setOpen(false);
    } catch (error) {
      toast.error("Помилка при видаленні накладної");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center cursor-pointer">
      <DropdownMenuItem className="cursor-pointer">
        <Link href={`/invoices/invoice/${invoiceId}`} passHref>
          Переглянути накладну
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer">
        <Link href={`/invoices/edit/${invoiceId}`} passHref>
          Редагувати накладну
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="cursor-pointer"
          >
            Видалити накладну
          </DropdownMenuItem>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Підтвердити видалення</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Ви точно хочете видалити дану накладну? Цю дію не можна скасувати.
          </p>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                setOpen(false);
                handleDelete(invoiceId);
              }}
            >
              Так, видалити
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DropdownMenuSeparator />
    </div>
  );
};

export default InvoiceActions;
