import { Typography } from "@/components/ui/typography";
import { SiteConfig } from "@/site-config";
import Image from "next/image";

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image.";

export default function SignUpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center lg:flex-row">
      <div className="hidden size-full justify-center bg-muted lg:flex lg:flex-col lg:justify-between">
        <div className="flex size-full items-center justify-center">
          <Image
            src="/assets/svg/Moon.svg"
            alt="Image"
            width="800"
            height="800"
            className="size-72 rotate-180"
          />
        </div>
        <div className="mb-20">
          <Typography
            variant="quote"
            className="text-left text-xl font-semibold"
          >
            {SiteConfig.description}
          </Typography>
        </div>
      </div>
      <div className="flex size-full items-center justify-center py-12">
        {children}
      </div>
    </div>
  );
}
