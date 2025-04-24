"use client";

import { Session } from "next-auth";
import Image from "next/image";
import { sideBarLinks } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";


const Sidebar = ({ session }: { session: Session }) => {
  const pathname = usePathname();

  return (
    <div>
      <div className="flex flex-row min-w-45 items-center gap-2 border-b justify-center border-dashed border-[#25388C]/20">
        <Link
          href='/'
        >
          <h1 className="text-[#ffffff] font-bold text-xl">BIZ-LEDGER</h1>
        </Link>
      </div>

      <div className="mt-15 flex flex-col gap-2">
        {sideBarLinks.map((link) => {
          const isSelected =
            (link.route !== "/" &&
              pathname.includes(link.route) &&
              link.route.length > 1) ||
            pathname === link.route;

          return (
            <Link href={link.route} key={link.route}>
              <div
                className={cn(
                  "flex flex-row items-center w-full gap-5 rounded-lg px-3 py-2 max-md:justify-center",
                  isSelected && "bg-[#ffffff] shadow-sm"
                )}
              >
                <div className="relative size-5">
                  <Image
                    src={link.img}
                    alt="icon"
                    fill
                    className={`${
                      isSelected ? "invert brightness-0" : ""
                    }  object-contain filter invert-0 contrast-0`}
                  />
                </div>

                <p
                  className={cn(
                    "text-base",
                    isSelected ? "text-[#11191f] font-bold" : "text-[#ffffff]"
                  )}
                >
                  {link.text}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
