"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export const BreadCrumb = () => {
  const pathname = usePathname();

  const pathElements = pathname.split("/").slice(1);

  return (
    <Breadcrumb className="flex w-full flex-nowrap">
      <BreadcrumbList>
        {pathElements.map((pathElement, idx) => {
          if (pathElement === "" || idx === 0) {
            return null;
          }
          const currentPath = `/${pathElements.slice(0, idx + 1).join("/")}`;
          return (
            <div key={idx} className="flex items-center gap-4">
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={currentPath}
                  className={cn(
                    idx === pathElements.length - 1 ? "font-bold" : null,
                  )}
                >
                  {pathElement}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </div>
          );
        })}
        {/* <BreadcrumbSeparator className="hidden md:block" /> */}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
