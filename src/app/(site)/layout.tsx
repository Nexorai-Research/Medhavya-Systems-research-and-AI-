import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader, type NavData } from "@/components/layout/SiteHeader";
import { MotionEffects } from "@/components/motion/MotionEffects";
import { site } from "@/content/site";
import { getCategories, getEnterpriseServices, getIndustries } from "@/lib/content";
import { env, siteUrl } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.positioning,
  applicationName: site.name,
  robots: env().SITE_INDEXABLE === "true" ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#F6F8FC",
};

function navData(): NavData {
  return {
    categories: getCategories().map(({ slug, name, tagline, icon }) => ({ slug, name, tagline, icon })),
    industries: getIndustries().map(({ slug, name }) => ({ slug, name })),
    services: getEnterpriseServices().map(({ slug, name, summary }) => ({ slug, name, summary })),
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.name,
            description: site.positioning,
            url: siteUrl(),
            logo: `${siteUrl()}/brand/medhavya-logo-full.png`,
          }}
        />
        <MotionEffects />
        <SiteHeader data={navData()} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
