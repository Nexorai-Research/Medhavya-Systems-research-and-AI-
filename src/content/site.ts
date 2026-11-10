/**
 * Company-level facts. Values marked TODO require founder input before launch
 * (Module 01 §14). Placeholders are never presented as verified contact details.
 */
export const site = {
  name: "Medhavya Systems",
  descriptor: "AI · Research · Technology",
  tagline: "Intelligent software. Practical impact.",
  positioning:
    "Medhavya Systems builds intelligent software products and delivers practical enterprise technology solutions that help organizations operate, adapt, and grow.",
  // TODO(founder): confirm public contact channels and office address.
  contact: {
    email: null as string | null,
    phone: null as string | null,
    address: null as string | null,
    hours: null as string | null,
    // TODO(founder): confirm the response-time commitment shown on contact and form pages.
    responseExpectation: "We aim to reply to enquiries within two business days.",
  },
  // TODO(founder): add approved social profile URLs.
  social: [] as { label: string; href: string }[],
} as const;

export const primaryNav = [
  { label: "Products", href: "/products", menu: "products" },
  { label: "Solutions", href: "/solutions" },
  { label: "Industries", href: "/industries", menu: "industries" },
  { label: "Enterprise Services", href: "/enterprise-solutions", menu: "enterprise" },
  { label: "Resources", href: "/resources" },
  { label: "Company", href: "/about", menu: "company" },
] as const;

export const companyLinks = [
  { label: "About", href: "/about", description: "Our story, mission and principles" },
  { label: "Technology", href: "/technology", description: "How we build and deliver" },
  { label: "Security", href: "/security", description: "Our security and privacy practices" },
  { label: "Careers", href: "/careers", description: "Work with Medhavya Systems" },
  { label: "Partners", href: "/partners", description: "Technology and channel partnerships" },
  { label: "Contact", href: "/contact", description: "Talk to our team" },
] as const;

export const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
  { label: "Accessibility", href: "/accessibility" },
] as const;
