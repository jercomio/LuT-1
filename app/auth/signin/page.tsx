import { LogoSvg } from "@/components/svg/logo-svg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth/helper";
import { SiteConfig } from "@/site-config";
import type { PageParams } from "@/types/next";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getError } from "../error/auth-error-mapping";
import { SignInProviders } from "./sign-in-providers";

export default async function AuthSignInPage(props: PageParams) {
  const searchParams = await props.searchParams;
  const { errorMessage, error } = getError(searchParams.error);

  const user = await auth();

  if (user) {
    redirect("/account");
  }

  return (
    <div className="flex size-full flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center gap-2">
          <Image
            src={SiteConfig.appIcon}
            alt="app logo"
            width={32}
            height={32}
            className="rotate-180"
          />
          <Link href="/" className="text-xl font-bold">
            {SiteConfig.title}
          </Link>
        </div>
      </header>
      {/* <HeaderBase /> */}
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col items-center justify-center gap-2">
            <LogoSvg />
            <CardTitle>Sign in to your account</CardTitle>
          </CardHeader>
          <CardContent className="mt-8">
            <SignInProviders />
          </CardContent>
          {error ? (
            <Alert>
              <AlertTriangle size={16} />
              <AlertDescription>{error}</AlertDescription>
              <AlertTitle>{errorMessage}</AlertTitle>
            </Alert>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
