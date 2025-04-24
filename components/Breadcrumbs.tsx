"use client"

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Breadcrumbs = () => {
  const pathname = usePathname();
  const pathParts = pathname.split('/').filter((part) => part !== '');

  const generateBreadcrumbLinks = () => {
    const translations: Record<string, string> = {
      invoices: "Накладні",
      contracts: "Договора",
      customers: "Замовники",
      suppliers: "Постачальники",
    };
  
    const breadcrumbLinks = pathParts.map((part, index) => {
      const href = "/" + pathParts.slice(0, index + 1).join("/");
      const isLast = index === pathParts.length - 1;
  
      const translatedPart = translations[part] || decodeURIComponent(part);
  
      return (
        <BreadcrumbItem key={href}>
          {isLast ? (
            <BreadcrumbPage className="capitalize text-[#11191f]">
              {translatedPart}
            </BreadcrumbPage>
          ) : (
            <BreadcrumbLink href={href} className="capitalize text-[#11191f]">
              {translatedPart}
            </BreadcrumbLink>
          )}
          {!isLast && <BreadcrumbSeparator />}
        </BreadcrumbItem>
      );
    });
  
    return breadcrumbLinks;
  };

  return (
    <Breadcrumb>
      <BreadcrumbList className='text-1xl'>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="capitalize">Головна</BreadcrumbLink>
        </BreadcrumbItem>

        {pathParts.length > 0 && <BreadcrumbSeparator />}

        {generateBreadcrumbLinks()}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
