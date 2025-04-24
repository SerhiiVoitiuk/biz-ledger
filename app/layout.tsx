import type { Metadata } from "next";
import { Tinos } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const tinos = Tinos({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BIZ-LEDGER",
  description:
    "платформа для ефективного управління постачаннями: реєстр замовників і постачальників, оформлення договорів, створення накладних та моніторинг оплат",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();

  return (
    <html lang="uk" className={tinos.className}>
      <SessionProvider session={session}>
        <body className="antialiased">
          {children}

          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
};

export default RootLayout;
