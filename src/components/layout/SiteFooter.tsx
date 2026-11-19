import { CookiePreferences } from "@/components/CookiePreferences";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Section";
import { companyLinks, legalLinks, site } from "@/content/site";
import { ArrowRight } from "lucide-react";
import { telHref } from "@/lib/contact-links";
import { getCategories, getEnterpriseServices, getIndustries } from "@/lib/content";

export function SiteFooter() {
  const tel = telHref(site.contact.phone);
  const columns = [
    { title: "Products", links: [{ href: "/products", label: "All products" }, ...getCategories().map((c) => ({ href: `/product-categories/${c.slug}`, label: c.shortName }))] },
    { title: "Industries", links: [{ href: "/solutions", label: "Solutions" }, ...getIndustries().map((i) => ({ href: `/industries/${i.slug}`, label: i.name }))] },
    {
      title: "Enterprise",
      links: [{ href: "/enterprise-solutions", label: "Overview" }, ...getEnterpriseServices().map((s) => ({ href: `/enterprise-solutions/${s.slug}`, label: s.name }))],
    },
    { title: "Company", links: [...companyLinks.map((l) => ({ href: l.href, label: l.label })), { href: "/resources", label: "Resources" }, { href: "/request-demo", label: "Request a demo" }] },
  ];

  return (
    <footer className="dark-section relative overflow-hidden bg-midnight text-white">
      <div aria-hidden className="bg-grid-dark absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      <Container className="relative pt-16 pb-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div>
            <Link href="/" aria-label="Medhavya Systems — home" className="inline-flex items-center gap-3">
              <Image src="/brand/medhavya-mark.png" alt="" width={218} height={192} className="h-12 w-auto" />
              <span className="flex flex-col leading-none">
                <span className="text-xl font-extrabold tracking-[0.06em]">MEDHAVYA</span>
                <span className="mt-1.5 text-[0.62rem] font-medium tracking-[0.42em] text-white/70">SYSTEMS</span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/70">{site.positioning}</p>
            <p className="mt-6 font-mono text-xs tracking-[0.2em] text-cyan uppercase">{site.descriptor}</p>
            {/* Contact details render only once the founder supplies them (see content/site.ts); never placeholders. */}
            <ul className="mt-6 space-y-1 text-sm text-white/80">
              {site.contact.email && (
                <li>
                  <a href={`mailto:${site.contact.email}`} className="inline-block py-1 hover:text-white">
                    {site.contact.email}
                  </a>
                </li>
              )}
              {tel && (
                <li>
                  <a href={tel} className="inline-block py-1 hover:text-white">
                    {site.contact.phone}
                  </a>
                </li>
              )}
              {site.contact.address && <li className="py-1">{site.contact.address}</li>}
              <li>
                <Link href="/contact" className="inline-flex items-center gap-1.5 py-1 font-semibold text-white hover:text-cyan">
                  Contact us <ArrowRight aria-hidden className="size-4" />
                </Link>
              </li>
            </ul>
            {site.social.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-x-4">
                {site.social.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} rel="noopener noreferrer" className="inline-block py-1 text-sm text-white/70 hover:text-white">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:grid-cols-[repeat(4,max-content)] lg:gap-x-12">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">{col.title}</h2>
                <ul className="mt-3 space-y-0.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="inline-block py-1.5 text-sm text-white/80 transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <p aria-hidden className="text-outline mt-14 mb-8 text-center text-[13vw] leading-none font-extrabold tracking-[0.04em] whitespace-nowrap select-none lg:text-[11.5rem]">
          MEDHAVYA
        </p>
        <div className="relative flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {site.name}. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-block py-1.5 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <CookiePreferences />
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
