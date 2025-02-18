import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BreadCrumb } from "@/features/breadcrumb";
import { Layout } from "@/features/page/layout";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { getUsersOrgs } from "@/query/org/get-users-orgs.query";
import type { PropsWithChildren } from "react";
import { OrgSearch } from "./org-search";
import { OrgSidebar } from "./org-sidebar";

export async function OrgNavigation({ children }: PropsWithChildren) {
  const { org, roles } = await getRequiredCurrentOrgCache();

  const userOrganizations = await getUsersOrgs();

  return (
    <SidebarProvider>
      <OrgSidebar slug={org.slug} roles={roles} userOrgs={userOrganizations} />
      <SidebarInset className="border border-accent">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-16">
          <Layout size="xl">
            <div className="flex w-full items-center gap-4">
              <SidebarTrigger className="" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <BreadCrumb />
              <OrgSearch />
            </div>
          </Layout>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
