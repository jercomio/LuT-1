"use client";
import { globalSettings } from "@/settings/global-settings";
import { useQuery } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";

if (globalSettings.length === 0) {
  console.log("globalSettings is not defined");
}

export const Settings = ({ children }: PropsWithChildren) => {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      return globalSettings;
    },
  });

  return (
    <div data-settings={JSON.stringify(settings?.map((s) => s.app.name))}>
      {children}
    </div>
  );
};
