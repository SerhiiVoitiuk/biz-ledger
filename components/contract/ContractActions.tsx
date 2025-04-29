"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { deleteContract } from "@/lib/actions/сontract";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface Props {
  contractId: string;
  userId: string;
  dropdownCloseRef: React.MutableRefObject<(() => void) | undefined>;
}

const ContractActions = ({ contractId, userId, dropdownCloseRef }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleDelete = async (id: string, userId: string) => {
    try {
      const result = await deleteContract(id, userId);
      if (result.success) {
        toast.success("Договір успішно видалено");
        router.refresh();
        setOpen(false);
        dropdownCloseRef.current?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Помилка при видалені договору");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <DropdownMenuItem className="cursor-pointer">
        <Link href={`/contracts/contract/${contractId}`} passHref>
          Переглягути договір
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer">
        <Link href={`/contracts/edit/${contractId}`} passHref>
          Редагувати договір
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="cursor-pointer"
          >
            Видалити договір
          </DropdownMenuItem>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Підтвердити видалення</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Ви точно хочете видалити цей договір? Цю дію не можна скасувати.
          </p>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                setOpen(false);
                handleDelete(contractId, userId);
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

export default ContractActions;
