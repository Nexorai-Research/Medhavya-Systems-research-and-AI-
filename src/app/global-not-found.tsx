import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { site } from "@/content/site";
import { getCategories, getEnterpriseServices, getIndustries } from "@/lib/content";
import NotFound from "./(site)/not-found";
import "./(site)/globals.css";

// The app has two root layouts (website and CMS admin), so unmatched URLs and the proxy's
// unknown-slug rewrite render this standalone page, which mirrors the website shell.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `Page not found | ${site.name}`,
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  const data = {
    categories: getCategories().map(({ slug, name, tagline, icon }) => ({ slug, name, tagline, icon })),
    industries: getIndustries().map(({ slug, name }) => ({ slug, name })),
    services: getEnterpriseServices().map(({ slug, name, summary }) => ({ slug, name, summary })),
  };
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader data={data} />
        <main id="main" className="flex-1">
          <NotFound />
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
