"use client";

import { TrashIcon, PencilIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteSupplier } from "@/lib/actions/supplier";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Props {
  supplierId: string;
  userId: string;
}

const ButtonSupplier = ({ supplierId, userId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleDelete = async (id: string, userId: string) => {
    try {
      setIsLoading(true);
      const result = await deleteSupplier(id, userId);
      if (result.success) {
        toast.success("Постачальника видалено успішно");
        router.refresh();
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Помилка при видалені постачальника");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (id: string) => {
    router.push(`/suppliers/edit/${id}`);
  };

  return (
    <div className="flex flex-row">
      <Button
        className="p-2 text-dark hover:text-dark bg-white hover:bg-white"
        variant="ghost"
        asChild
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Link
          href={`/suppliers/supplier/${supplierId}`}
          className="flex items-center gap-2"
        >
          <EyeIcon className="h-5 w-10" />
        </Link>
      </Button>

      <Button
        className="p-2 text-green-500 hover:text-green-700 bg-white hover:bg-white cursor-pointer"
        variant="ghost"
        asChild
        onClick={(e) => {
          e.stopPropagation();
          handleUpdate(supplierId);
        }}
      >
        <span className="relative inline-flex items-center justify-center w-10 h-5">
          <PencilIcon className="h-5 w-10" />
        </span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={(e) => e.stopPropagation()}
            className="p-2 text-red-500 hover:text-red-700 bg-white hover:bg-white cursor-pointer"
            variant="ghost"
            asChild
          >
            <span className="relative inline-flex items-center justify-center w-10 h-5">
              {isLoading ? (
                <ClipLoader color="#11191f" size={20} />
              ) : (
                <TrashIcon className="h-5 w-10" />
              )}
            </span>
          </Button>
        </DialogTrigger>

        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Підтвердження видалення</DialogTitle>
            <DialogDescription>
              Ви впевнені, що хочете видалити цього постачальника? Цю дію не
              можна буде скасувати.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} asChild>
              Відмінити
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setOpen(false);
                handleDelete(supplierId, userId);
              }}
              disabled={isLoading}
            >
              {isLoading ? "Видалення..." : "Видалити"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ButtonSupplier;
