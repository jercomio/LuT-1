"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarMenuButtonLink } from "@/components/ui/sidebar-utils";
import { UserDropdown } from "@/features/auth/user-dropdown";
import type { NavigationGroup } from "@/features/navigation/navigation.type";
import { SearchBar } from "@/features/search-bar/search-bar";
import type { OrganizationMembershipRole } from "@prisma/client";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { getOrganizationNavigation } from "./org-navigation.links";
import { OrgsSelect } from "./orgs-select";

export function OrgSidebar({
  slug,
  userOrgs,
  roles,
}: {
  slug: string;
  roles: OrganizationMembershipRole[] | undefined;
  userOrgs: {
    id: string;
    slug: string;
    name: string;
    image: string | null;
  }[];
}) {
  const links: NavigationGroup[] = getOrganizationNavigation(slug, roles);
  const sidebarState = useSidebar();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex flex-col gap-2">
        <OrgsSelect orgs={userOrgs} currentOrgSlug={slug} />
        {sidebarState.state === "expanded" ? <SearchBar /> : null}
      </SidebarHeader>
      <SidebarContent>
        {links.map((link) => (
          <ItemCollapsing
            defaultOpenStartPath={link.defaultOpenStartPath}
            key={link.title}
          >
            <SidebarGroup key={link.title}>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  {link.title}
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
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
              </CollapsibleContent>
            </SidebarGroup>
          </ItemCollapsing>
        ))}
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2">
        {/* To display the upgrade card in sidebar */}
        {/* {sidebarState.state === "expanded" ? <UpgradeCard /> : null} */}
        <UserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

const UserButton = () => {
  const session = useSession();
  const data = session.data?.user;
  // const sidebarState = useSidebar();
  return (
    <UserDropdown>
      {/* <Button variant="outline">
        <Avatar className="size-6">
          <AvatarFallback>{data?.name?.[0] ?? "-"}</AvatarFallback>
          {data?.image && <AvatarImage src={data.image} />}
        </Avatar>
        {sidebarState.state === "expanded" ? <span>{data?.name}</span> : null}
      </Button> */}

      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Avatar className="size-8 rounded-lg">
          <AvatarImage src={data?.image ?? ""} alt={data?.name?.[0]} />
          <AvatarFallback className="rounded-lg">
            {data?.name?.[0] ?? "U"}
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

const ItemCollapsing = (
  props: PropsWithChildren<{ defaultOpenStartPath?: string }>,
) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isOpen = props.defaultOpenStartPath
    ? pathname.startsWith(props.defaultOpenStartPath)
    : true;

  useEffect(() => {
    if (isOpen) {
      setOpen(isOpen);
    }
  }, [isOpen]);
  return (
    <Collapsible
      defaultOpen={isOpen}
      onOpenChange={setOpen}
      open={open}
      className="group/collapsible"
    >
      {props.children}
    </Collapsible>
  );
};
