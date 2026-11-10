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
  {
    slug: "web-application-development",
    name: "Web Application Development",
    summary: "Secure, accessible web applications and portals for customers, partners and internal teams.",
    problems: [
      "Customers or partners still depend on email and phone for routine requests",
      "An existing web application is slow, hard to change or inaccessible",
      "A new digital product needs a dependable first release",
    ],
    capabilities: ["Customer and partner portals", "Dashboards and workflow applications", "Accessible, responsive front ends", "API-backed web platforms"],
    boundaries: ["Scope and acceptance criteria agreed before build", "Accessibility (WCAG 2.2 AA) is a delivery requirement, not an extra"],
    deliverables: ["Prototype and design system", "Tested web application", "API and deployment documentation", "Hand-over runbook"],
    seo: { title: "Web Application Development", description: "Secure, accessible web applications and portals." },
  },
  {
    slug: "mobile-application-development",
    name: "Mobile Application Development",
    summary: "Mobile applications for field teams, customers and operations, designed for real-world connectivity.",
    problems: [
      "Field staff record work on paper and re-enter it later",
      "Customers expect a mobile experience the current system cannot give",
      "Connectivity is unreliable where the work happens",
    ],
    capabilities: ["Field-data capture applications", "Customer-facing mobile experiences", "Offline-tolerant workflows", "Integration with back-office systems"],
    boundaries: ["Platform choice (native, cross-platform or progressive web app) is justified in the discovery phase", "App-store publishing needs client-owned developer accounts"],
    deliverables: ["Mobile prototype", "Tested application build", "Release and support plan", "Source code and documentation"],
    seo: { title: "Mobile Application Development", description: "Mobile applications for field teams and customers." },
  },
  {
    slug: "cloud-devops",
    name: "Cloud & DevOps",
    summary: "Reliable delivery pipelines, infrastructure and monitoring for software that has to stay available.",
    problems: ["Releases are manual, slow or risky", "Nobody is sure what the cloud environment costs or contains", "Outages are discovered by users before the team"],
    capabilities: ["Continuous integration and delivery pipelines", "Infrastructure as code", "Monitoring, logging and alerting", "Backup and recovery planning"],
    boundaries: ["Hosting region and data residency are agreed with the client before provisioning", "Cost estimates are stated as estimates with their assumptions"],
    deliverables: ["Environment and pipeline design", "Automated deployment", "Monitoring dashboards", "Recovery runbook"],
    seo: { title: "Cloud & DevOps", description: "Delivery pipelines, infrastructure and monitoring." },
  },
  {
    slug: "data-engineering-analytics",
    name: "Data Engineering & Analytics",
    summary: "Clean, connected data and decision-ready reporting built on your existing systems.",
    problems: ["Reports disagree because every team counts differently", "Data sits in separate systems and spreadsheets", "Leaders wait days for numbers they need today"],
    capabilities: ["Data pipelines and warehousing", "Data quality checks", "Dashboards and operational reporting", "Foundations for machine-learning use cases"],
    boundaries: ["Metric definitions are agreed and documented with the business owner", "Personal data is minimised and access is role-based"],
    deliverables: ["Data inventory and model", "Automated pipelines", "Dashboards with documented definitions", "Data quality report"],
    seo: { title: "Data Engineering & Analytics", description: "Data pipelines, quality and decision-ready reporting." },
  },
  {
    slug: "consulting-digital-transformation",
    name: "Consulting & Digital Transformation",
    summary: "Practical technology roadmaps that connect business goals to what is realistic to build and run.",
    problems: ["There are many technology ideas but no agreed priority", "Past projects stalled after the pilot", "Leadership needs an honest view of options, cost and risk"],
    capabilities: ["Technology and process assessment", "Roadmaps with phased priorities", "Build, buy or integrate analysis", "Programme governance support"],
    boundaries: ["Recommendations state their assumptions and uncertainty", "We say so when an off-the-shelf tool is the better choice"],
    deliverables: ["Assessment report", "Prioritised roadmap", "Business case with stated assumptions", "Governance model"],
    seo: { title: "Consulting & Digital Transformation", description: "Honest technology roadmaps and transformation support." },
  },
  {
    slug: "maintenance-support",
    name: "Maintenance & Support",
    summary: "Ongoing care for delivered software: fixes, updates, security patches and improvements.",
    problems: ["Software was delivered but nobody owns its upkeep", "Dependencies and security patches fall behind", "Small changes take too long to get done"],
    capabilities: ["Defect resolution", "Dependency and security updates", "Performance and reliability reviews", "Planned enhancement releases"],
    boundaries: ["Support hours and response targets are written into the agreement", "Work on software we did not build starts with an assessment"],
    deliverables: ["Support agreement", "Monthly maintenance report", "Patched and tested releases", "Updated documentation"],
    seo: { title: "Maintenance & Support", description: "Ongoing maintenance, security updates and improvements." },
  },
];

export const deliveryLifecycle = [
  { step: "Discover", description: "Understand the process, people, constraints and success measures before proposing a solution." },
  { step: "Design", description: "Prototype the experience and architecture; agree scope and acceptance criteria." },
  { step: "Build", description: "Deliver in short, demonstrable increments with automated tests." },
  { step: "Integrate", description: "Connect to existing systems and migrate data with validation." },
  { step: "Improve", description: "Measure in production, hand over cleanly and keep improving." },
] as const;
