import type { EnterpriseService } from "./types";

/**
 * Enterprise service descriptions. Capability boundaries are written conservatively;
 * the founder must confirm scope before launch (Module 01 §10).
 */
export const enterpriseServices: EnterpriseService[] = [
  {
    slug: "custom-software",
    name: "Custom Software",
    summary: "Purpose-built web and mobile applications for workflows that off-the-shelf products do not fit.",
    problems: [
      "Core processes run on spreadsheets that have outgrown their purpose",
      "Packaged software forces workarounds for a distinctive process",
      "An internal tool needs to become a reliable, supported product",
    ],
    capabilities: ["Web applications and portals", "Mobile-friendly field applications", "Internal tools and dashboards", "Product engineering for new software products"],
    boundaries: ["We scope work in phases and agree acceptance criteria before build", "We do not take on projects without a named client-side owner"],
    deliverables: ["Discovery report and scope", "Design prototypes", "Tested, documented source code", "Deployment and hand-over runbook"],
    seo: { title: "Custom Software Development", description: "Purpose-built enterprise software, delivered in phases." },
  },
  {
    slug: "ai-automation",
    name: "AI & Automation",
    summary: "Applied AI and workflow automation, designed with review, measurement and clear limits.",
    problems: [
      "Teams spend hours on repetitive document and data handling",
      "AI pilots never move beyond a demo",
      "Leaders need to know what an AI system can and cannot be trusted to do",
    ],
    capabilities: ["Document extraction and classification", "Workflow automation and routing", "Assistants grounded in your own content", "Evaluation and monitoring of AI output"],
    boundaries: ["Human review for consequential decisions", "No automated decisions in clinical, legal or credit contexts without explicit approval", "Your data is not used to train shared models"],
    deliverables: ["Use-case assessment", "Evaluated prototype", "Production integration", "Monitoring and quality reports"],
    seo: { title: "AI & Automation Services", description: "Governed applied AI and workflow automation." },
  },
  {
    slug: "integration-modernization",
    name: "Integration & Modernization",
    summary: "Connecting systems, migrating data and modernising legacy applications without disrupting operations.",
    problems: [
      "Data is re-keyed between systems that do not talk to each other",
      "A legacy application is hard to change and risky to run",
      "A migration must happen without stopping the business",
    ],
    capabilities: ["API design and system integration", "Data migration and validation", "Incremental legacy modernisation", "Cloud readiness assessment"],
    boundaries: ["Incremental change over big-bang rewrites", "Rollback plans for every cut-over"],
    deliverables: ["Integration architecture", "Migration plan with validation checks", "Modernised components", "Operational runbooks"],
    seo: { title: "Integration & Modernization", description: "System integration, data migration and legacy modernisation." },
  },
];

export const deliveryLifecycle = [
  { step: "Discover", description: "Understand the process, people, constraints and success measures before proposing a solution." },
  { step: "Design", description: "Prototype the experience and architecture; agree scope and acceptance criteria." },
  { step: "Build", description: "Deliver in short, demonstrable increments with automated tests." },
  { step: "Integrate", description: "Connect to existing systems and migrate data with validation." },
  { step: "Improve", description: "Measure in production, hand over cleanly and keep improving." },
] as const;
