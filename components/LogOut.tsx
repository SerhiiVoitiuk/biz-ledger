import { Button } from "./ui/button";
import Image from "next/image";
import { signOut } from "@/auth";

const LogOut = () => {
  return (
    <div className="flex w-full flex-row justify-between items-center rounded-lg bg-[#ffffff] shadow-sm">
      <form
        action={async () => {
          "use server";

          await signOut();
        }}
        className="flex w-full flex-row justify-center items-center"
      >
        <Button
          variant="ghost"
          className="p-2 hover:bg-transparent flex flex-row items-center gap-5"
        >
          <div className="size-5 relative">
            <Image
              src="/icons/logout.svg"
              alt="icon"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-base text-[#11191f] font-bold">Вихід</div>
        </Button>
      </form>
    </div>
  );
};

export default LogOut;
