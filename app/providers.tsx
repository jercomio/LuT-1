"use client";

import { Toaster } from "@/components/ui/sonner";
import { AlertDialogRenderer } from "@/features/alert-dialog/alert-dialog-renderer";
import { GlobalDialogLazy } from "@/features/global-dialog/global-dialog-lazy";
import { SearchParamsMessageToastSuspended } from "@/features/searchparams-message/search-params-message-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";
import { Settings } from "./settings";

const queryClient = new QueryClient();

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <Settings>
            <Toaster />
            <AlertDialogRenderer />
            <GlobalDialogLazy />
            <SearchParamsMessageToastSuspended />
            {children}
          </Settings>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};
