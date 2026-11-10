"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { CategoryIcon } from "@/components/CategoryIcon";
import { buttonClass } from "@/components/ui/Button";
import { companyLinks, primaryNav } from "@/content/site";
import type { CategoryIcon as IconKey } from "@/content/types";
import { cn } from "@/lib/cn";

export interface NavData {
  categories: { slug: string; name: string; tagline: string; icon: IconKey }[];
  industries: { slug: string; name: string }[];
  services: { slug: string; name: string; summary: string }[];
}

type MenuKey = "products" | "industries" | "enterprise" | "company";

export function SiteHeader({ data }: { data: NavData }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // Close menus whenever the route changes. Adjusting state during render avoids an extra effect pass.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || mobileOpen ? "border-line bg-white/90 shadow-[0_1px_0_rgb(16_26_45/0.02)] backdrop-blur-md" : "border-transparent bg-canvas/70 backdrop-blur-sm",
      )}
    >
      <a
        href="#main"
        className="sr-only z-[60] rounded-md bg-midnight px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <div ref={navRef} className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => {
              const key = "menu" in item ? (item.menu as MenuKey) : null;
              const active = isActive(item.href) || (key === "products" && pathname.startsWith("/product-categories"));
              if (!key) {
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                        active ? "text-primary" : "text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              const expanded = open === key;
              return (
                <li key={item.href} className="relative">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`${menuId}-${key}`}
                    onClick={() => setOpen(expanded ? null : key)}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                      active || expanded ? "text-primary" : "text-ink",
                    )}
                  >
                    {item.label}
                    <ChevronDown aria-hidden className={cn("size-3.5 transition-transform duration-200", expanded && "rotate-180")} />
                  </button>
                  <div
                    id={`${menuId}-${key}`}
                    hidden={!expanded}
                    className={cn(
                      "absolute top-full mt-3 animate-rise rounded-[var(--radius-lg)] border border-line bg-white p-2 shadow-[var(--shadow-lift)]",
                      key === "products" ? "-left-40 w-[720px]" : "left-0 w-[340px]",
                    )}
                  >
                    <MenuPanel kind={key} data={data} />
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/search" className="inline-flex size-11 items-center justify-center rounded-full text-midnight hover:text-primary">
            <Search aria-hidden className="size-5" />
            <span className="sr-only">Search the site</span>
          </Link>
          <span className="hidden sm:block">
            <Link href="/request-demo" className={buttonClass("primary", "whitespace-nowrap")}>
              Request a demo
            </Link>
          </span>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-white text-midnight xl:hidden"
            aria-expanded={mobileOpen}
            aria-controls={`${menuId}-mobile`}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      {/* Reading progress — CSS scroll-driven, hidden where unsupported or reduced motion */}
      <span aria-hidden className="scroll-progress absolute inset-x-0 -bottom-px h-[2px] bg-gradient-to-r from-primary via-cyan to-gold" />

      <div id={`${menuId}-mobile`} hidden={!mobileOpen} className="menu-panel h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-white xl:hidden">
        <MobileMenu data={data} />
      </div>
    </header>
  );
}

function MenuPanel({ kind, data }: { kind: MenuKey; data: NavData }) {
  if (kind === "products") {
    return (
      <div className="grid grid-cols-[1fr_220px] gap-2">
        <ul className="grid grid-cols-2 gap-1">
          {data.categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/product-categories/${c.slug}`} className="flex gap-3 rounded-[var(--radius-md)] p-3 transition-colors hover:bg-canvas">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <CategoryIcon icon={c.icon} className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-midnight">{c.name}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-muted">{c.tagline}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex flex-col justify-between rounded-[var(--radius-md)] bg-midnight p-5 text-white">
          <div>
            <p className="font-mono text-[0.65rem] tracking-[0.18em] text-cyan uppercase">Portfolio</p>
            <p className="mt-3 text-sm leading-relaxed text-white/80">Purpose-built products across eight categories, each with an honest lifecycle status.</p>
          </div>
          <Link href="/products" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-cyan">
            Explore all products <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    );
  }
  const items =
    kind === "industries"
      ? [...data.industries.map((i) => ({ href: `/industries/${i.slug}`, label: i.name, description: "" })), { href: "/industries", label: "All industries", description: "" }]
      : kind === "enterprise"
        ? [
            ...data.services.map((s) => ({ href: `/enterprise-solutions/${s.slug}`, label: s.name, description: s.summary })),
            { href: "/enterprise-solutions", label: "Enterprise overview", description: "Engagement model and delivery lifecycle" },
          ]
        : companyLinks.map((l) => ({ href: l.href, label: l.label, description: l.description }));
  return (
    <ul className="grid gap-0.5">
      {items.map((i) => (
        <li key={i.href}>
          <Link href={i.href} className="block rounded-[var(--radius-md)] px-3 py-2.5 transition-colors hover:bg-canvas">
            <span className="block text-sm font-semibold text-midnight">{i.label}</span>
            {i.description && <span className="mt-0.5 block text-xs leading-snug text-muted">{i.description}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MobileMenu({ data }: { data: NavData }) {
  const groups = [
    { title: "Products", links: [{ href: "/products", label: "All products" }, ...data.categories.map((c) => ({ href: `/product-categories/${c.slug}`, label: c.name }))] },
    { title: "Solutions", links: [{ href: "/solutions", label: "Solutions overview" }, ...data.industries.map((i) => ({ href: `/industries/${i.slug}`, label: i.name }))] },
    { title: "Enterprise Services", links: [{ href: "/enterprise-solutions", label: "Overview" }, ...data.services.map((s) => ({ href: `/enterprise-solutions/${s.slug}`, label: s.name }))] },
    { title: "Company", links: [...companyLinks.map((l) => ({ href: l.href, label: l.label })), { href: "/resources", label: "Resources" }] },
  ];
  return (
    <nav aria-label="Mobile" className="px-4 pt-4 pb-10">
      {groups.map((g) => (
        <details key={g.title} className="group border-b border-line py-1 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex min-h-12 cursor-pointer items-center justify-between text-base font-semibold text-midnight">
            {g.title}
            <ChevronDown aria-hidden className="size-4 transition-transform group-open:rotate-180" />
          </summary>
          <ul className="pb-3">
            {g.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="flex min-h-11 items-center pl-2 text-sm text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      ))}
      <div className="mt-6 grid gap-3">
        <Link href="/request-demo" className={buttonClass("primary", "w-full")}>
          Request a demo
        </Link>
        <Link href="/enterprise-solutions#consult" className={buttonClass("secondary", "w-full")}>
          Discuss an enterprise project
        </Link>
      </div>
    </nav>
  );
}
