import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { createSearchParamsMessageUrl } from "@/features/searchparams-message/createSearchParamsMessageUrl";
import { combineWithParentMetadata } from "@/lib/metadata";
import { getServerUrl } from "@/lib/server-url";
import { SiteConfig } from "@/site-config";
import type { LayoutParams } from "@/types/next";
import { redirect } from "next/navigation";

export const generateMetadata = combineWithParentMetadata({
  title: "Settings",
  description: "Manage your organization settings.",
});

export default async function RouteLayout(
  props: LayoutParams<{ productId: string; orgSlug: string }>,
) {
  const params = await props.params;
  if (SiteConfig.features.enableSingleMemberOrg) {
    redirect(
      createSearchParamsMessageUrl(`${getServerUrl()}org/${params.orgSlug}`, {
        type: "message",
        message: "You need to update your account settings.",
      }),
    );
  }

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Organization</LayoutTitle>
      </LayoutHeader>
      <LayoutContent>{props.children}</LayoutContent>
    </Layout>
  );
}
