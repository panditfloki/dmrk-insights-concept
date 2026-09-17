// Services, industries and page copy transcribed from the CLIENT'S OWN live pages
// (about/services/industries/contact + the four service pages), pulled 2026-09-13.
// Nothing on this file is invented. Where their page had no copy, the field is absent
// rather than filled in.

export interface Service {
  slug: string;
  name: string;
  menuBlurb: string;
  h1: string;
  intro: string;
  sectionTitle: string;
  sectionIntro: string;
  capabilities: { title: string; body: string }[];
}

export const services: Service[] = [
  {
    slug: "market-intelligence-research",
    name: "Market Intelligence",
    menuBlurb: "Markets, competitors and commercial signals, tracked on a cadence.",
    h1: "Track markets, competitors, and commercial signals that shape decisions.",
    intro:
      "DMRK Insights develops focused market intelligence, competitor analysis, opportunity assessments, reports, trackers, and dashboards.",
    sectionTitle: "Intelligence designed for a recurring decision",
    sectionIntro:
      "The scope, refresh cycle, and evidence depth are matched to how the intelligence will be used.",
    capabilities: [
      { title: "Market sizing and forecasting", body: "Build transparent top-down and bottom-up estimates, segment views, assumptions, scenarios, and sensitivity ranges." },
      { title: "Competitor intelligence", body: "Map products, pricing, positioning, partnerships, channels, customer targets, capabilities, and strategic moves." },
      { title: "Trackers and dashboards", body: "Define the signals, sources, cadence, alert thresholds, and implications needed for repeat monitoring." },
      { title: "Opportunity assessment", body: "Compare segments, geographies, use cases, and growth options using consistent evidence and scoring criteria." },
    ],
  },
  {
    slug: "customer-research-surveys",
    name: "Customer Research & Surveys",
    menuBlurb: "Voice of Customer, segmentation, pricing and churn research.",
    h1: "Connect customer evidence to product, pricing, service, and retention decisions.",
    intro:
      "DMRK Insights designs customer, dealer, employee, and stakeholder research programs using surveys and qualitative methods.",
    sectionTitle: "Listen at the moments that matter",
    sectionIntro:
      "Effective Voice of Customer research identifies who should be heard, when feedback is most useful, and which decisions the evidence must serve.",
    capabilities: [
      { title: "Voice of Customer", body: "Study journey friction, service expectations, satisfaction drivers, unmet needs, and the actions most likely to improve outcomes." },
      { title: "Segmentation and demand", body: "Compare needs, behaviors, value, purchase criteria, adoption barriers, and channel preferences across customer groups." },
      { title: "Pricing and offer research", body: "Test value perception, willingness to pay, feature tradeoffs, package comprehension, and competitive alternatives." },
      { title: "Relationship and churn research", body: "Identify onboarding, product, support, outcome, and communication factors that influence renewal confidence." },
    ],
  },
  {
    slug: "expert-interviews",
    name: "Expert Interviews",
    menuBlurb: "Identification, screening, moderation and synthesis.",
    h1: "Reach relevant industry experience and turn conversations into evidence.",
    intro:
      "DMRK Insights supports expert identification, screening, interview design, moderation, and synthesis for market education and diligence.",
    sectionTitle: "Specialist context for difficult questions",
    sectionIntro:
      "Expert interviews are most useful when the participant profile, evidence gap, and boundaries of the conversation are defined up front.",
    capabilities: [
      { title: "Market and value-chain education", body: "Understand industry structure, economics, buyer behavior, channels, regulation, and operating practices." },
      { title: "Strategy pressure testing", body: "Challenge market assumptions, entry routes, adoption barriers, implementation plans, and commercial scenarios." },
      { title: "Competitor and supplier context", body: "Explore capability differences, service models, purchasing criteria, cost drivers, and ecosystem relationships." },
      { title: "Investment research support", body: "Test market narratives, demand drivers, risk factors, customer workflows, and growth assumptions with relevant practitioners." },
    ],
  },
  {
    slug: "market-entry-strategy",
    name: "Market Entry Strategy",
    menuBlurb: "Where to play and how to win, before capital is committed.",
    h1: "Validate where to play and how to win before committing capital.",
    intro:
      "DMRK Insights combines market sizing, customer evidence, competitor economics, channel research, and investment scenarios.",
    sectionTitle: "A decision case, not just a market overview",
    sectionIntro:
      "Market attractiveness matters only when the opportunity is accessible, commercially viable, and aligned with the organization's capability.",
    capabilities: [
      { title: "Market attractiveness", body: "Estimate demand, growth, segment concentration, unmet needs, regulation, and structural risks using transparent assumptions." },
      { title: "Buyer and demand validation", body: "Test use cases, purchase criteria, willingness to switch, buying authority, price expectations, and adoption barriers." },
      { title: "Competitive economics", body: "Compare offers, positioning, pricing, channels, partnerships, operating models, and likely competitive responses." },
      { title: "Route to market", body: "Evaluate direct, partner, distributor, acquisition, and pilot-led entry routes against cost, control, speed, and access." },
    ],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

/** Sector descriptions, verbatim from their industries page. */
export const sectors: { name: string; blurb: string }[] = [
  { name: "Automotive & Mobility", blurb: "Electric vehicles, connected fleets, used cars, logistics technology, and supply-chain automation." },
  { name: "BFSI", blurb: "Digital banking, embedded finance, insurance technology, payments, and wealth platforms." },
  { name: "Consumer & Retail", blurb: "E-commerce, modern trade, loyalty, packaging, consumer behavior, and pricing strategy." },
  { name: "Energy & Utilities", blurb: "Renewables, grid modernization, storage, clean fuels, electrification, and utility operations." },
  { name: "Healthcare", blurb: "Diagnostics, digital health, hospital automation, pharma distribution, and patient experience." },
  { name: "Technology & Telecom", blurb: "Cloud, AI, cybersecurity, 5G monetization, enterprise software, and device ecosystems." },
  { name: "Manufacturing", blurb: "Industry 4.0, industrial automation, sourcing shifts, materials, and operational excellence." },
  { name: "Real Estate & Construction", blurb: "Urban development, proptech, building materials, project delivery, and commercial assets." },
  { name: "Education & Skilling", blurb: "Edtech platforms, employability programs, corporate learning, and training ecosystems." },
  { name: "Food & Beverage", blurb: "Functional nutrition, food service, beverage innovation, cold chain, and sustainable packaging." },
];

/** The four-step method, verbatim from their about page. */
export const method = [
  { step: "Define", body: "Clarify the decision, assumptions, stakeholders, geography, customer groups, and practical constraints." },
  { step: "Collect", body: "Combine appropriate primary and secondary evidence, including surveys, interviews, market sources, and competitor observation." },
  { step: "Validate", body: "Check source quality, respondent relevance, conflicting signals, limitations, and the sensitivity of important assumptions." },
  { step: "Apply", body: "Translate findings into priorities, risks, scenarios, and next actions that match the original business decision." },
];

export const REGIONS = "India, Middle East, Europe, Americas, and APAC";
