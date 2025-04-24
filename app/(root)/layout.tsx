import React, { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import LogOut from "@/components/LogOut";


const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  
  if (!session) redirect("/sign-in");

  return (
    <main className="flex min-h-screen w-full flex-row">
      <div className="sticky left-0 top-0 flex h-dvh flex-col justify-between bg-[#11191f] px-10 pb-10 pt-5">
        <Sidebar session={session}/>
        <LogOut />
      </div>

      <div className="w-full pt-5 bg-[#eae9e0]">{children}</div>
    </main>
  );
};

export default Layout;
