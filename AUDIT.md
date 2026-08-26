# jaklabs.io — audit

JAK Labs · JD Kemp · 26 August 2026

Audited the live site the same way the prospecting tool audits everyone else's:
loaded at phone width, no login, plus a read of the metadata, structured data
and copy against what JAK Labs actually sells today.

**Headline: the site is technically healthy and strategically wrong.** It passes
every check the audit tool applies to prospects. It also sells four services JAK
Labs doesn't offer, to eight industries it doesn't target, in a voice that isn't
Jak's, and never once says "Michigan".

---

## 1. What's genuinely good

Worth saying first, because it is the part that would be expensive to rebuild.

- **Passes the audit.** No console errors on any page checked. Phone number is a
  proper `tel:` link and consistent across pages. HTTPS. No horizontal scroll.
  No mobile viewport problems. It would not appear in any of the seven fault
  buckets the Michigan sweep found.
- **The design is strong** and does not look like a template even though it is
  one. That is a real asset.
- **The blog infrastructure is now correct** — server-rendered, per-post
  metadata, JSON-LD, sitemap, ISR.

---

## 2. Technical SEO — the mechanical faults

### 2.1 Eight pages share one title and one description ⚠️ worst issue

Every page except `/blog` returns:

```
<title>JAKLabs | Marketing Consulting & App Development</title>
<meta name="description" content="Premier marketing consulting and application
development for service-based businesses. Real estate, HVAC, plumbing, and more.">
```

`/`, `/services`, `/about`, `/contact`, `/app-development`, `/seo-marketing`,
`/marketing-strategy`, `/brand-strategy` — all identical.

Google has no way to tell these pages apart, so they compete with each other for
the same phrase and none of them describes what it is. A search result for the
brand-strategy page says "Marketing Consulting & App Development". This is the
single highest-value fix on the list and it is one `metadata` export per page.

### 2.2 No canonical tags anywhere except `/blog`

Nothing tells search engines which URL is authoritative. Low harm today, real
harm the moment anything is reachable by two paths.

### 2.3 No structured data at all on the marketing pages

Zero JSON-LD blocks outside the blog. No `Organization`, no `LocalBusiness`, no
`Service`, no `FAQPage`. For the GEO strategy this matters more than it used to:
an answer engine deciding whether to cite you for "who builds booking software
for Michigan clinics" is reading structured data, and there is none.

`LocalBusiness` with an `areaServed` of Michigan is the specific missing piece.

### 2.4 Homepage takes 4.5s at phone width

Against the 5.0s threshold the audit tool flags on other people's sites. Not
failing, but close enough that it would be embarrassing to be caught by it, and
the blog now publicly uses that number as a standard.

The cause is almost certainly the hero video/imagery and framer-motion on first
paint. `/services` (2.8s) and `/contact` (2.7s) are fine.

### 2.5 The word "Michigan" does not appear on the site

Not on the homepage. Not on the services page. Nowhere.

The stated strategy is ranking for Michigan-local searches and being cited by
answer engines for Michigan questions. **A page cannot rank for a place it never
mentions.** The blog says Michigan constantly; the site it links back to never
does. That disconnect wastes most of the blog's value.

---

## 3. Identity and consistency

### 3.1 Three different email addresses

| Address | Where |
|---|---|
| `jdakemp@jaklabs.io` | homepage |
| `jdakemp@gmail.com` | contact page, about page |
| `jdakempdev@gmail.com` | where the contact form actually delivers |

A visitor sees two of these and neither matches where their message goes. Pick
`jdakemp@jaklabs.io` — it is the only one that reads like a business — and make
all three agree.

### 3.2 The site says "we" 153 times and "I" zero times

The brand standard for every JAK Labs document is first person: *I/my, never
we/our — JAK Labs is Jak and that is the advantage.* The proposals follow it.
The blog follows it. The website does the exact opposite:

> "We work as an extension of your team"
> "We hold ourselves to the highest standards in every project we deliver"
> "We stay ahead of trends"

This is worse than a style inconsistency. A prospect reads "we" and pictures an
agency with staff; then they meet one person. That gap reads as overstatement at
exactly the moment trust is being formed — and "one senior engineer, not a
project manager and three juniors" is a *selling point* being thrown away.

### 3.3 No locality anywhere

No address, no city, no service area. Google Business Profile and the site should
corroborate each other; right now the site offers nothing to corroborate.

---

## 4. The positioning gap — the real problem

### What the site sells

| Service page | Claim |
|---|---|
| Marketing Strategy | "Data-driven campaigns that put your business in front of the right customers" |
| App Development | "Custom web and mobile applications that streamline your operations" |
| Brand Design | "Memorable brand identities that establish trust and recognition" |
| SEO & Content | "Content strategies that drive organic traffic and establish authority" |

Homepage headline: **"We Help Service Businesses Dominate Their Market."**

Industries listed: Real Estate, Trades, Home Services, Professional, Healthcare,
Legal, Automotive, Restaurants — eight verticals, i.e. no vertical.

### What JAK Labs actually sells

Operational software for small service businesses: CRM, scheduling, booking,
intake, invoicing and dashboards, built on AWS + React, $2.5K–$10K, closed off a
free 30-minute Operations Audit. The proof is the Haslett Handyman CRM. The
current wedge is Michigan wellness and med spas, where the sweep found 2,407
businesses and a working platform already exists.

### The gap, measured

Count of times the live site mentions what you do:

| Term | Homepage | Services page |
|---|---|---|
| med spa | 0 | 0 |
| telehealth | 0 | 0 |
| intake | 0 | 0 |
| CRM | 0 | 0 |
| booking | 0 | 1 |
| operations audit | 0 | 0 |
| Michigan | 0 | 0 |

**Three of the four advertised services are things JAK Labs does not sell.** Brand
design and marketing campaigns are not on offer. Someone who calls about a logo
is a wasted hour; someone who needed a booking system had no reason to call.

### Why this is now urgent rather than untidy

The blog is live and pointed at Michigan clinic owners. The funnel is:

> a clinic owner searches → finds the audit post → is convinced → clicks through
> → lands on a generic marketing agency that says nothing about clinics, nothing
> about booking, nothing about Michigan, and speaks as "we"

Every visitor the blog earns is spent on a page that answers a different
question. The blog is the sharpest asset and the site blunts it.

---

## 5. Recommended shape

Not a redesign. The design is fine; the words are wrong.

**Replace four services with two, plus the wedge:**

1. **Operations builds** — the CRM/booking/intake/invoicing work. $2.5K–$10K.
2. **The free Operations Audit** — the actual close, currently invisible on the
   site. It should be the primary call to action on every page.
3. *(Optional third)* **The clinic platform**, for the wellness vertical
   specifically — the strongest thing you own and completely absent.

**Then:**

- One `metadata` export per page: real title, real description, canonical.
- `Organization` + `LocalBusiness` JSON-LD with `areaServed: Michigan`.
- Rewrite copy from "we" to "I", and make one-person-senior the pitch.
- Say Michigan, Lansing and Grand Rapids where true.
- Collapse `/marketing-strategy` and `/brand-strategy`, or repoint them —
  ranking for services you don't sell is worse than not ranking.
- One email address everywhere, matching where the form delivers.
- Trim the homepage to under 3s.

**Sequence:** metadata and JSON-LD first — mechanical, no decisions, immediate
benefit. Then copy and service structure, which needs your call on what the
three offers are.

---

## Open question

The one thing I cannot decide for you: **is the site aimed at Michigan wellness
clinics specifically, or at local service businesses generally with wellness as
the current campaign?**

The first is sharper and matches the blog and the platform you own. The second
keeps Haslett-style trades work in scope, which is where the proof is.

Both are defensible. They produce different homepages, and everything else
follows from it.
