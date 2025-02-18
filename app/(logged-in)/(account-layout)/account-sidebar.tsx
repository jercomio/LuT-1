"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarMenuButtonLink } from "@/components/ui/sidebar-utils";
import { UserDropdown } from "@/features/auth/user-dropdown";
import type { NavigationGroup } from "@/features/navigation/navigation.type";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { OrgsSelect } from "../../orgs/[orgSlug]/(navigation)/_navigation/orgs-select";
import { getAccountNavigation } from "./account.links";

export function AccountSidebar({
  userOrgs,
}: {
  userOrgs: {
    id: string;
    slug: string;
    name: string;
    image: string | null;
  }[];
}) {
  const links: NavigationGroup[] = getAccountNavigation();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex flex-col gap-2">
        <OrgsSelect orgs={userOrgs} />
      </SidebarHeader>
      <SidebarContent>
        {links.map((link) => (
          <SidebarGroup key={link.title}>
            <SidebarGroupLabel>
              {link.title}
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {link.links.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButtonLink href={item.href}>
                      <item.Icon />
                      <span>{item.label}</span>
                    </SidebarMenuButtonLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2">
        <UserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

const UserButton = () => {
  const session = useSession();
  const data = session.data?.user;
  return (
    <UserDropdown>
      {/* <Button variant="outline">
        <Avatar className="size-6">
          <AvatarFallback>{data?.name?.[0] ?? "-"}</AvatarFallback>
          {data?.image && <AvatarImage src={data.image} />}
        </Avatar>
      </Button> */}

      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Avatar className="size-8 rounded-lg">
          <AvatarImage src={data?.image ?? ""} alt={data?.name?.[0]} />
          <AvatarFallback className="rounded-lg">
            {data?.name?.[0] ?? "-"}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{data?.name}</span>
          <span className="truncate text-xs">{data?.email}</span>
        </div>
        <ChevronsUpDown className="ml-auto size-4" />
      </SidebarMenuButton>
    </UserDropdown>
  );
};
