import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (session) redirect("/");

  return (
    <main className="relative flex flex-col-reverse sm:flex-row">
      <section className="my-auto flex h-full min-h-screen flex-1 bg-[#11191f] items-center px-5 py-10">
        <div className="mx-auto">
          {children}
        </div>
      </section>
    </main>
  );
};

export default Layout;
