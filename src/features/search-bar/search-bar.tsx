"use client";

import { ORGANIZATION_LINKS } from "@/../app/orgs/[orgSlug]/(navigation)/_navigation/org-navigation.links";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  CmdOrOption,
  KeyboardShortcut,
} from "@/components/ui/keyboard-shortcut";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useKey } from "react-use";

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const orgSlug = typeof params.orgSlug === "string" ? params.orgSlug : "";
  const sidebarState = useSidebar();

  const down = () => {
    setOpen((open) => !open);
  };

  useKey(
    (event) => (event.ctrlKey || event.metaKey) && event.key === "k",
    down,
    {
      event: "keydown",
      options: {
        capture: true,
      },
    },
  );

  return (
    <>
      <div className={cn("relative", sidebarState.open ? "w-full" : "w-96")}>
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full appearance-none bg-background pl-8 shadow-none"
          onClick={() => {
            setOpen(true);
          }}
        />
        <div className="pointer-events-none absolute right-2.5 top-2.5 inline-flex h-5 select-none items-center gap-1">
          <KeyboardShortcut eventKey="cmd">
            <CmdOrOption />
          </KeyboardShortcut>
          <KeyboardShortcut eventKey="k">K</KeyboardShortcut>
        </div>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {ORGANIZATION_LINKS.map((link, index) => (
            <CommandGroup heading={link.title} key={index}>
              {link.links.map((link) => (
                <CommandItem
                  key={link.href}
                  onSelect={() => {
                    router.push(
                      link.href.replace(":organizationSlug", orgSlug),
                    );
                  }}
                >
                  <link.Icon className="mr-2 size-4" />
                  <span>{link.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
