import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { buttons } from "@/constants";

const HomeButtons = () => {
  return (
    <div className="flex flex-row justify-end w-full gap-3 ">
      {buttons.map((button) => (
        <Button
          key={button.href}
          className="flex justify-center text-center rounded-lg w-45 font-bold bg-[#11191f]"
          asChild
        >
          <Link
            href={button.href}
            className="text-[#ffffff] tracking-wider flex items-center"
          >
            {button.label}
          </Link>
        </Button>
      ))}
    </div>
  );
};

export default HomeButtons;
