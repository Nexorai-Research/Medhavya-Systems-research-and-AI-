import type { MetadataRoute } from "next";
import { env, siteUrl } from "@/lib/env";

/** Staging and local deployments are never indexable; production opts in with SITE_INDEXABLE=true. */
export default function robots(): MetadataRoute.Robots {
  if (env().SITE_INDEXABLE !== "true") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/cms-api/"] },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
