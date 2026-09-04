/**
 * The industry taxonomy, as the website tells it.
 *
 * Mirrors jaklabs-crm/backend/src/shared/industries.js — the `key` values must
 * match that file exactly, because a client filed under HOME_TRADES in the CRM
 * and shown under a different name here is two systems disagreeing about the
 * same business.
 *
 * WHY THE WEBSITE HAS THIS AT ALL
 *
 * The categories are a marketing decision before they are a filing decision.
 * Somebody looking for this work does not search "operational software" — they
 * search "scheduling software for plumbers" or "how do I stop no-shows at my
 * med spa". A category earns a page when there is a distinct search behind it
 * and something true to say. That is the same test as the CRM's, which is why
 * one list serves both.
 *
 * WHAT `tier` MEANS, AND WHY IT GOVERNS THE PAGES
 *
 *   1  PROVEN   — a real system shipped, and a case study that exists
 *   2  ACTIVE   — an offer built and a target list, but no case study yet
 *   3  COVERAGE — exists so the CRM taxonomy is exhaustive. No page.
 *
 * Only tiers 1 and 2 get a page. A tier-3 page would have to either say nothing
 * or imply experience that has not happened, and thin pages that exist to catch
 * a keyword are exactly what a search engine has spent a decade learning to
 * discount. They are listed on the hub as "also work here", which is true.
 */

export type Tier = 1 | 2 | 3

export interface Industry {
  key: string
  slug: string
  name: string
  /** Used as the <h1> and the title tag. Written the way somebody searches. */
  headline: string
  /** What they actually do, so a visitor knows in one line if this is them. */
  includes: string
  /** The problem in their words. Never "digital transformation". */
  pain: string
  /** Three things I build for this industry, most valuable first. */
  builds: { title: string; detail: string }[]
  /** What is true, or null. Never a placeholder. */
  proof: string | null
  /** Which productised offer fits. Drives the CTA. */
  offer: 'audit' | 'sprint' | 'ops' | null
  tier: Tier
  /** GEO work: question-shaped, answered directly. Retrieval pulls these. */
  faq: { q: string; a: string }[]
}

export const INDUSTRIES: Industry[] = [
  {
    key: 'HOME_TRADES',
    slug: 'home-and-trade-services',
    name: 'Home & Trade Services',
    headline: 'Software for home service and trade businesses',
    includes:
      'Plumbing, electrical, HVAC, roofing, landscaping, cleaning, remodeling, pest control, '
      + 'restoration and the trades around them.',
    pain:
      'Quotes live in the owner’s head, jobs live in a group chat, and invoices go out when '
      + 'somebody remembers. Nothing is broken exactly — it just all depends on one person being '
      + 'available.',
    builds: [
      {
        title: 'Work comes in without you',
        detail:
          'Email, form and phone enquiries become tickets automatically, with the job details '
          + 'already attached. Nothing sits in an inbox waiting for someone to notice it.',
      },
      {
        title: 'Scheduling and crews in one place',
        detail:
          'Who is doing what, where, today. Work orders the crew can actually use on a phone in '
          + 'a driveway, not a desktop system nobody opens.',
      },
      {
        title: 'Invoicing and getting paid',
        detail:
          'Invoices raised from completed work rather than from memory, contractor payouts '
          + 'calculated, and a straight answer to "what am I owed" without asking anyone.',
      },
    ],
    proof:
      'I run Haslett Handyman on software I wrote: $216K invoiced, 3,235 transactions '
      + 'auto-categorised, and about 140 hours of admin taken out of my week.',
    offer: 'ops',
    tier: 1,
    faq: [
      {
        q: 'Do I need to replace the software I already use?',
        a: 'Usually not. Most trade businesses have one tool that works — often the accounting '
          + 'or the invoicing — and three that do not. I build around what works and replace what '
          + 'does not, because a migration you did not need is the fastest way to lose a month.',
      },
      {
        q: 'How is this different from ServiceTitan or Jobber?',
        a: 'Those are good products that you bend your business around, priced per user per '
          + 'month forever. I build the system around how you already work, you own it, and there '
          + 'is no seat count. If an off-the-shelf tool genuinely fits you better, I will tell you '
          + 'that instead of selling you a build.',
      },
      {
        q: 'What does it cost?',
        a: 'Ops-Automation builds start at $6,000 and most land between $6,000 and $10,000. The '
          + 'free Operations Audit comes first and is genuinely free — it is how I find out '
          + 'whether there is $6,000 of value here before either of us commits.',
      },
    ],
  },
  {
    key: 'HEALTH_WELLNESS',
    slug: 'health-wellness-and-beauty',
    name: 'Health, Wellness & Beauty',
    headline: 'Software for med spas, clinics and wellness businesses',
    includes:
      'Med spas, wellness centres, dental and chiropractic practices, physical therapy, salons, '
      + 'gyms and telehealth providers.',
    pain:
      'The phone is the booking system. No-shows are absorbed rather than prevented, intake '
      + 'happens on paper at the front desk, and nobody can say which client is due back.',
    builds: [
      {
        title: 'Booking that works on a phone',
        detail:
          'Most enquiries arrive on a mobile. If booking means calling during business hours, '
          + 'the ones who will not call are simply lost — and they never tell you.',
      },
      {
        title: 'Intake and records before they arrive',
        detail:
          'Forms completed ahead of the appointment, stored properly, and attached to the client '
          + 'rather than to a clipboard. Built HIPAA-aware, because for this industry that is not '
          + 'optional.',
      },
      {
        title: 'Recall, memberships and packages',
        detail:
          'Knowing who is due back and telling them, automatically. Package and membership '
          + 'balances that are correct without anyone maintaining a spreadsheet.',
      },
    ],
    proof:
      'I audited 456 Michigan wellness websites — a third could not be tapped to call from a '
      + 'phone. I have also designed and built a HIPAA multi-tenant clinical platform end to end, '
      + 'with tenant isolation enforced in the database.',
    offer: 'ops',
    tier: 1,
    faq: [
      {
        q: 'Is what you build HIPAA compliant?',
        a: 'I build to HIPAA requirements — encryption in transit and at rest, access controls, '
          + 'audit logging, and data isolation enforced at the database rather than in application '
          + 'code. Compliance is a property of your whole operation and not of software alone, so '
          + 'I will tell you plainly which parts the system covers and which remain yours.',
      },
      {
        q: 'We already have a booking platform. Is that enough?',
        a: 'Often the booking is the one part that works and the gap is everywhere else — intake '
          + 'still on paper, recall not happening, memberships tracked by hand. The free audit '
          + 'tells you which of those is actually costing you money before you buy anything.',
      },
      {
        q: 'What is the fastest thing worth fixing?',
        a: 'Whether your phone number is tappable on a mobile, and whether someone can book '
          + 'without calling. Those two take days, not weeks, and on a third of the sites I '
          + 'audited they were the entire problem.',
      },
    ],
  },
  {
    key: 'FINANCIAL_INSURANCE',
    slug: 'financial-and-insurance',
    name: 'Financial & Insurance Services',
    headline: 'AI document processing for insurance, accounting and lending',
    includes:
      'Insurance agencies, bookkeeping and accounting firms, tax practices, mortgage brokers, '
      + 'title companies, medical billing and lenders.',
    pain:
      'Somewhere in your office a person opens each policy, receipt, claim or application, reads '
      + 'it, and types the same six fields into a system. All day.',
    builds: [
      {
        title: 'Documents in, structured data out',
        detail:
          'The boring internal tool, not a website chatbot: a document arrives, the fields come '
          + 'out, and anything the system is unsure about goes to a human review queue instead of '
          + 'being guessed.',
      },
      {
        title: 'Evaluation gates before anything goes live',
        detail:
          'Tested against your real documents, with a measured accuracy figure, before it touches '
          + 'a live workflow. An AI feature nobody can evaluate is a liability in a regulated '
          + 'business.',
      },
      {
        title: 'A client portal that reduces the phone calls',
        detail:
          'Where clients upload, check status and get documents themselves — which is where most '
          + 'of the interruptions come from.',
      },
    ],
    proof: null,
    offer: 'sprint',
    tier: 2,
    faq: [
      {
        q: 'How much document volume makes this worth it?',
        a: 'Roughly a hundred documents a month is where the maths starts to work. Below that, '
          + 'the build costs more than the time it saves and you should not buy it — I would '
          + 'rather tell you that on the call than take the engagement.',
      },
      {
        q: 'Is it safe to put client financial data through an AI model?',
        a: 'It depends entirely on how it is built, which is why the review queue and the '
          + 'evaluation gates matter more than the model. I will walk you through exactly where '
          + 'data goes, what is retained and what is not, before you decide anything.',
      },
      {
        q: 'What does an LLM Integration Sprint cost and how long is it?',
        a: 'From $7,500, and two to four weeks. One production-ready feature, end to end, '
          + 'deployed and documented — scoped to a single workflow so the timeline is honest.',
      },
    ],
  },
  {
    key: 'REAL_ESTATE_PROPERTY',
    slug: 'real-estate-and-property',
    name: 'Real Estate & Property',
    headline: 'Software for property managers and real estate businesses',
    includes:
      'Property management companies, brokerages, HOAs, appraisers, home inspectors and '
      + 'development.',
    pain:
      'Maintenance requests arrive by text, leases live in a shared drive nobody has indexed, and '
      + 'owner reports get rebuilt by hand every month.',
    builds: [
      {
        title: 'Maintenance intake that becomes a work order',
        detail:
          'A tenant reports a problem once, in a way that produces a scheduled job with the '
          + 'details attached — rather than a text message somebody has to remember to act on.',
      },
      {
        title: 'Lease and document extraction',
        detail:
          'Key dates, rents, escalations and clauses pulled out of the documents you already have, '
          + 'so the renewal that matters is not the one nobody noticed.',
      },
      {
        title: 'Owner and tenant portals',
        detail:
          'Statements and status that people can look at themselves, which is most of what the '
          + 'phone calls are about.',
      },
    ],
    proof: null,
    offer: 'sprint',
    tier: 2,
    faq: [
      {
        q: 'We use AppFolio or Buildium. Does that rule this out?',
        a: 'No. Most of what I build for property managers sits alongside the platform and fills '
          + 'the gaps it leaves — usually intake, document extraction and owner reporting. '
          + 'Replacing a working platform is rarely the right call.',
      },
      {
        q: 'How many units before this makes sense?',
        a: 'It is about how much of the work is reading and re-keying rather than door count. A '
          + '200-unit manager with a clean platform may need nothing; an 80-unit manager doing '
          + 'owner statements by hand every month has an obvious build.',
      },
    ],
  },
  {
    key: 'STAFFING_WORKFORCE',
    slug: 'staffing-and-recruiting',
    name: 'Staffing & Workforce',
    headline: 'AI screening and automation for staffing and recruiting firms',
    includes: 'Staffing agencies, recruiters, PEOs, training providers and employment services.',
    pain:
      'Every open role means a human skimming a stack of CVs, and the good candidate is the one '
      + 'nobody got to in time.',
    builds: [
      {
        title: 'Structured screening against the actual requirement',
        detail:
          'CVs parsed and matched to the role, ranked with the reasoning shown, so a recruiter '
          + 'starts from a shortlist and a rationale rather than an inbox.',
      },
      {
        title: 'Intake that captures the requirement properly',
        detail:
          'Most bad placements start with a vague brief. Structured intake makes the requirement '
          + 'explicit before anyone starts searching.',
      },
      {
        title: 'Placement and margin reporting',
        detail:
          'Time-to-fill, fill rate and margin per placement, without anybody maintaining the '
          + 'spreadsheet that currently answers those questions.',
      },
    ],
    proof: null,
    offer: 'sprint',
    tier: 2,
    faq: [
      {
        q: 'Does AI screening introduce bias or legal risk?',
        a: 'It can, and that is exactly why the design matters. Screening should rank against '
          + 'stated job requirements with the reasoning visible and a human making every decision '
          + '— never an automatic reject. I build it that way and will not build it the other way.',
      },
      {
        q: 'Will it work with our ATS?',
        a: 'Generally yes — most of these builds read from and write back to the ATS you already '
          + 'have rather than replacing it. If your ATS has no usable API I will find that out in '
          + 'the scoping call, before you have spent anything.',
      },
    ],
  },
  {
    key: 'LOGISTICS_FIELD_OPS',
    slug: 'logistics-and-field-operations',
    name: 'Logistics & Field Operations',
    headline: 'Automation for freight, logistics and field service operations',
    includes:
      'Freight brokers, trucking, couriers, moving companies, waste, equipment rental and fleet '
      + 'operations.',
    pain:
      'Bills of lading and carrier invoices get keyed twice, exceptions are handled by whoever '
      + 'happens to see the email, and nobody can say what a lane actually earned.',
    builds: [
      {
        title: 'Document processing for BOLs and carrier invoices',
        detail:
          'Rate confirmations, bills of lading and invoices read once, reconciled automatically, '
          + 'and flagged when they disagree — which is the case that costs money.',
      },
      {
        title: 'Dispatch and status visibility',
        detail:
          'One place showing what is moving and what is stuck, instead of a phone call to find out.',
      },
      {
        title: 'Margin by lane and by customer',
        detail:
          'The number that tells you which business to take more of, which almost nobody at this '
          + 'size can currently produce.',
      },
    ],
    proof: null,
    offer: 'sprint',
    tier: 2,
    faq: [
      {
        q: 'Our TMS already does some of this. Where does a build fit?',
        a: 'Usually in the gaps between systems — reconciliation, exception handling and '
          + 'reporting that spans the TMS and the accounting. Those seams are where the manual '
          + 'work actually lives.',
      },
    ],
  },
  {
    key: 'TECHNOLOGY_AI',
    slug: 'technology-and-ai-products',
    name: 'Technology & AI Products',
    headline: 'AI reliability audits and embedded engineering for software teams',
    includes: 'Software companies, SaaS products, AI startups and technical agencies.',
    pain:
      'You shipped an AI feature and have no way to answer "is it right?" beyond spot-checking '
      + 'it. Nobody wants to be the one who finds out from a customer.',
    builds: [
      {
        title: 'An evaluation harness for what you already shipped',
        detail:
          'Your prompts, your retrieval and your failure modes reviewed, with an eval-harness '
          + 'design and a prioritised fix list. Fixed price, about a week, no retainer after it.',
      },
      {
        title: 'The reliability layer underneath the feature',
        detail:
          'Retrieval gates and checks that catch a wrong answer before a user sees it — the layer '
          + 'I built for a HIPAA platform where a wrong answer reaching a patient was not '
          + 'survivable.',
      },
      {
        title: 'A forward-deployed engineer for your messiest customer',
        detail:
          'I embed with your team, learn the customer\'s domain, and ship the integration that '
          + 'makes your product work in their world.',
      },
    ],
    proof:
      'A public multi-tenant platform reference with the isolation tests that enforce it, and a '
      + 'public unauthenticated endpoint with 14 SSRF vectors blocked and tested.',
    offer: 'audit',
    tier: 2,
    faq: [
      {
        q: 'What does the AI Reliability Audit actually deliver?',
        a: 'A review of your prompts, retrieval and failure modes, an eval-harness design you can '
          + 'implement, and a prioritised fix list — in about a week for a fixed $2,500. No '
          + 'retainer and no commitment past it.',
      },
      {
        q: 'We have engineers. Why bring in someone else?',
        a: 'Usually because they are busy shipping features and evaluation is the thing that '
          + 'never gets prioritised until something goes wrong. An outside week spent solely on '
          + '"how would we know if this were wrong" is cheap next to finding out from a customer.',
      },
      {
        q: 'Do you take embedded or forward-deployed contracts?',
        a: 'Yes — that is the work I most want. There is a page about exactly how I approach it '
          + 'at /engineering, including the public code and three production bugs worth reading.',
      },
    ],
  },
]

/** Everything the CRM can file a client under that has no page here. True, and worth saying. */
export const ALSO_SERVED = [
  'Professional & Legal Services',
  'Automotive',
  'Retail, Food & Hospitality',
  'Manufacturing, Supply & B2B',
  'Education & Childcare',
  'Nonprofit, Faith & Community',
  'Public Sector & Utilities',
]

export const OFFERS = {
  audit: { name: 'AI Reliability Audit', price: '$2,500', href: '/services#ai-reliability' },
  sprint: { name: 'LLM Integration Sprint', price: 'from $7,500', href: '/services#llm-sprint' },
  ops: { name: 'Ops-Automation Build', price: 'from $6,000', href: '/services#ops-automation' },
} as const

export const getIndustry = (slug: string) => INDUSTRIES.find((i) => i.slug === slug)
export const industrySlugs = () => INDUSTRIES.map((i) => i.slug)
