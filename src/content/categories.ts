import type { ProductCategory } from "./types";

export const categories: ProductCategory[] = [
  {
    slug: "agriculture",
    name: "Agriculture Software",
    shortName: "Agriculture",
    tagline: "Field-to-market visibility for growers and agri-businesses.",
    description:
      "Software that helps farms, producer organisations and agri-businesses plan seasons, record field activity and make better decisions with the data they already collect.",
    context: [
      "Farm records are often spread across notebooks, messaging apps and spreadsheets.",
      "Advisory, input supply and procurement teams need a shared, timely view of field activity.",
      "Solutions must work in low-connectivity environments and in more than one language.",
    ],
    icon: "agriculture",
    displayOrder: 1,
    publication: "Published",
    seo: {
      title: "Agriculture Software",
      description: "Farm operations, crop planning and agri-business software from Medhavya Systems.",
    },
  },
  {
    slug: "retail-business",
    name: "Retail & Business Software",
    shortName: "Retail & Business",
    tagline: "Customer, sales and day-to-day business operations in one place.",
    description:
      "Practical tools for growing businesses to manage customers, sales pipelines, billing, inventory and teams without stitching together disconnected apps.",
    context: [
      "Small and mid-sized businesses outgrow spreadsheets before they can justify heavy enterprise suites.",
      "Owners need clear daily reporting, not complex configuration.",
      "Teams work across counters, field visits and mobile devices.",
    ],
    icon: "retail",
    displayOrder: 2,
    publication: "Published",
    seo: {
      title: "Retail & Business Software",
      description: "CRM and business management software for growing organisations.",
    },
  },
  {
    slug: "ai-automation",
    name: "AI & Automation",
    shortName: "AI & Automation",
    tagline: "Automate repetitive work with reviewable, governed AI.",
    description:
      "Applied AI and workflow automation that reads documents, routes work and assists teams — with human review, audit trails and clear limits on what the system decides.",
    context: [
      "High-volume document and request handling consumes skilled people’s time.",
      "AI output must be explainable and reviewable before it changes business records.",
      "Automation should connect to existing systems instead of replacing them.",
    ],
    icon: "ai",
    displayOrder: 3,
    publication: "Published",
    seo: {
      title: "AI & Automation Software",
      description: "Document intelligence and workflow automation with human review.",
    },
  },
  {
    slug: "financial-intelligence",
    name: "Financial Intelligence & Trading",
    shortName: "Financial Intelligence",
    tagline: "Research, analytics and monitoring for financial decisions.",
    description:
      "Analytics and research tooling for finance teams and market participants. Our software supports analysis; it does not provide investment advice or execute trades on a user’s behalf.",
    context: [
      "Analysts combine market data, internal records and research notes by hand.",
      "Risk and exposure views need to be timely and traceable.",
      "Regulatory expectations require careful data handling and clear disclaimers.",
    ],
    icon: "finance",
    displayOrder: 4,
    publication: "Published",
    seo: {
      title: "Financial Intelligence Software",
      description: "Financial analytics and research tooling from Medhavya Systems.",
    },
  },
  {
    slug: "enterprise",
    name: "Enterprise Software",
    shortName: "Enterprise",
    tagline: "Connected planning, finance and operations for complex organisations.",
    description:
      "Enterprise resource planning and operations software designed for multi-location organisations that need consistent processes, approvals and reporting.",
    context: [
      "Finance, procurement, inventory and HR often run on separate systems.",
      "Leaders need consolidated reporting without manual reconciliation.",
      "Rollouts must respect existing processes, integrations and data migration needs.",
    ],
    icon: "enterprise",
    displayOrder: 5,
    publication: "Published",
    seo: {
      title: "Enterprise Software",
      description: "ERP and enterprise operations software from Medhavya Systems.",
    },
  },
  {
    slug: "education",
    name: "Education Software",
    shortName: "Education",
    tagline: "School operations, learning and family communication, connected.",
    description:
      "Software for schools and education groups covering admissions, academics, attendance, fees and communication with families.",
    context: [
      "School administration relies on many disconnected registers and tools.",
      "Teachers need to spend time teaching, not re-entering data.",
      "Student data requires strict access control and privacy handling.",
    ],
    icon: "education",
    displayOrder: 6,
    publication: "Published",
    seo: {
      title: "Education Software",
      description: "School management and learning software from Medhavya Systems.",
    },
  },
  {
    slug: "healthcare",
    name: "Healthcare Software",
    shortName: "Healthcare",
    tagline: "AI-assisted workflows that give clinicians time back.",
    description:
      "Healthcare software that supports clinical and administrative teams with documentation, scheduling and operational insight. Clinical decisions always remain with qualified professionals.",
    context: [
      "Clinicians spend a large share of their day on documentation and administration.",
      "Patient flow and resource visibility are often limited to manual updates.",
      "Health data demands the highest standard of privacy, consent and access control.",
    ],
    icon: "healthcare",
    displayOrder: 7,
    publication: "Published",
    seo: {
      title: "Healthcare Software",
      description: "AI-assisted healthcare workflow software from Medhavya Systems.",
    },
  },
  {
    slug: "other",
    name: "Other Industry Solutions",
    shortName: "Other Industries",
    tagline: "Logistics, field operations and sector-specific systems.",
    description:
      "Solutions for industries beyond our core categories, starting with logistics and field operations, where visibility and coordination drive results.",
    context: [
      "Dispatch, tracking and proof-of-delivery are often managed over phone calls.",
      "Customers expect accurate status updates without chasing.",
      "Fleet and partner networks need one shared operational picture.",
    ],
    icon: "other",
    displayOrder: 8,
    publication: "Published",
    seo: {
      title: "Logistics & Other Industry Solutions",
      description: "Logistics and sector-specific software from Medhavya Systems.",
    },
  },
];
