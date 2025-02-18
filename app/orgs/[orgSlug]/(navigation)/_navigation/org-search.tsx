"use client";
import { useSidebar } from "@/components/ui/sidebar";
import { SearchBar } from "@/features/search-bar/search-bar";

export const OrgSearch = () => {
  const sidebarState = useSidebar();

  return <>{sidebarState.state === "collapsed" ? <SearchBar /> : null}</>;
};
