import type { Resource } from "./types";

/** Demonstration articles describing approach only — no client or performance claims. */
export const resources: Resource[] = [
  {
    slug: "reviewable-ai-in-operations",
    title: "Reviewable AI: putting people in the loop by design",
    type: "Insight",
    author: "Medhavya Systems",
    excerpt: "Why every AI suggestion that changes a business record should be visible, explainable and approved by a person.",
    body: [
      { paragraphs: ["AI can remove a great deal of repetitive work from operations teams. But when an AI system writes directly into business records, mistakes become expensive and hard to trace.", "Our approach is to treat AI output as a proposal. It is shown to a person, with the source it came from, and only committed when approved."] },
      { heading: "What reviewability means in practice", paragraphs: ["Each suggestion carries its source document and the fields it affects. Reviewers can accept, correct or reject it. Corrections are recorded, and correction rates are monitored so teams can see where automation helps and where it does not."] },
      { heading: "Where we draw the line", paragraphs: ["In clinical, legal and credit contexts, AI assists people; it does not decide for them. These limits are part of the design, not an afterthought."] },
    ],
    tags: ["AI", "Governance"],
    publishedAt: "2026-10-20",
    readingMinutes: 4,
    isDemo: true,
    publication: "Published",
    seo: { title: "Reviewable AI in Operations", description: "Designing AI systems that keep people in the loop." },
  },
  {
    slug: "phased-delivery-for-enterprise-software",
    title: "Phased delivery: how we keep enterprise projects honest",
    type: "Guide",
    author: "Medhavya Systems",
    excerpt: "Discover, design, build, integrate and improve — and why each phase ends with something you can see and test.",
    body: [
      { paragraphs: ["Large software projects fail quietly when progress is reported but not demonstrated. We structure work so that each phase ends with an artefact the client can review: a discovery report, a prototype, a tested increment."] },
      { heading: "Acceptance criteria first", paragraphs: ["Before building, we agree how each requirement will be accepted. This turns vague expectations into checks both sides can verify."] },
      { heading: "Integration is a phase, not a footnote", paragraphs: ["Most enterprise value comes from connecting systems. We plan integration and data migration explicitly, with validation and rollback steps."] },
    ],
    tags: ["Delivery", "Enterprise"],
    publishedAt: "2026-10-12",
    readingMinutes: 5,
    isDemo: true,
    publication: "Published",
    seo: { title: "Phased Delivery for Enterprise Software", description: "How phased, demonstrable delivery reduces project risk." },
  },
  {
    slug: "privacy-first-product-design",
    title: "Privacy-first product design for schools and clinics",
    type: "Article",
    author: "Medhavya Systems",
    excerpt: "Student and patient data deserve stricter defaults. Here is how we approach access, consent and data minimisation.",
    body: [
      { paragraphs: ["Education and healthcare software holds some of the most sensitive data an organisation manages. We start from least-privilege access, collect only what a workflow needs, and record consent where it applies."] },
      { heading: "Defaults matter", paragraphs: ["Roles are scoped narrowly by default, so a teacher sees their classes and a parent sees their own child. Broader access must be granted deliberately and is logged."] },
    ],
    tags: ["Privacy", "Education", "Healthcare"],
    publishedAt: "2026-09-28",
    readingMinutes: 3,
    isDemo: true,
    publication: "Published",
    seo: { title: "Privacy-First Product Design", description: "Access, consent and data minimisation in sensitive sectors." },
  },
];
