import { Alert, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BreadCrumb } from "@/features/breadcrumb";
import { Layout } from "@/features/page/layout";
import { getUsersOrgs } from "@/query/org/get-users-orgs.query";
import { CircleAlert } from "lucide-react";
import type { PropsWithChildren } from "react";
import { AccountSidebar } from "./account-sidebar";
import { VerifyEmailButton } from "./account/verify-email/verify-email-button";

export async function AccountNavigation({
  children,
  emailVerified,
}: PropsWithChildren<{ emailVerified?: boolean | null }>) {
  const userOrganizations = await getUsersOrgs();

  return (
    <SidebarProvider>
      <AccountSidebar userOrgs={userOrganizations} />
      <SidebarInset className="border border-accent">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-16">
          <Layout size="xl">
            <div className="flex w-full items-center gap-4">
              <SidebarTrigger className="" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <BreadCrumb />
              {/* <OrgSearch /> */}
            </div>
          </Layout>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {!emailVerified ? (
            <Layout className="my-0 h-fit">
              <Alert>
                <CircleAlert size={16} />
                <AlertTitle>
                  Email not verified. Please verify your email.
                </AlertTitle>
                <VerifyEmailButton
                  variant="invert"
                  className="ml-auto flex h-6 w-fit items-center gap-1 rounded-md px-3 text-sm"
                />
              </Alert>
            </Layout>
          ) : null}
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
