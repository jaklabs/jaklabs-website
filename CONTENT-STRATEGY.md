# Blog strategy — Michigan wellness & med spa

JAK Labs · JD Kemp · August 2026

The blog exists to make one thing happen: a Michigan clinic owner with a problem
searches for it — in Google or in an AI assistant — and arrives at jaklabs.io
already believing I can fix it.

Everything below is grounded in the 501 Michigan businesses in the CRM, 456 of
which have had their homepage loaded at phone width and audited.

---

## What the data says to write about

The sweep is not a guess about what these businesses need. It is a measurement.

| Problem | Michigan businesses with it | Share of audited |
|---|---|---|
| JavaScript errors on the homepage | 217 | **47%** |
| Phone number not tappable on mobile | 154 | **33%** |
| Homepage over 5s on a phone | 52 | 11% |
| Page scrolls sideways on mobile | 30 | 6% |
| No way to book or get in touch | 29 | 6% |
| No HTTPS — Chrome shows "Not secure" | 10 | 2% |
| Not built for phones at all | 7 | 1% |
| **No website at all** | **26** | — |

And the market shape: of 2,407 businesses swept nationally, **11 run a telehealth
platform**. 0.5%. This is not a market where you displace an incumbent. It is a
market where the incumbent is a spreadsheet, a Calendly link and the owner's
phone.

**That is the thesis of the whole blog.** Not "switch to us" — "you are running
your clinic by hand, and here is what that is costing you."

### The four topics that follow from it

1. **Booking that actually works on a phone.** 47% have a homepage erroring in
   the browser, and a booking widget is the single most common thing to break.
   This is the biggest, most provable pain in the dataset.
2. **Getting called.** A third of Michigan clinics have a phone number a visitor
   cannot tap. For a walk-in-driven business that is a direct revenue leak, and
   it is trivially demonstrable on the owner's own phone.
3. **Intake and paperwork without a platform fee.** The 0.5% number in prose:
   what a clinic actually needs, versus what a $600/month vendor sells.
4. **What it costs to run on nothing.** The honest version of the pitch —
   spreadsheets and DMs work until they don't, and the failure mode is
   double-booked, no-showed, and unbilled.

---

## Categories to create

Named the way someone searches, not the way an agency files things. The four
that were hardcoded on the old site — Marketing, Development, Design, Business —
are the generic set every agency blog has and rank for nothing.

- `med-spa-software` — Spa (163) + Skin Care (12) + Beauty Salon (12) = 187 MI businesses
- `clinic-operations` — Medical Clinic (97) + Doctor (38) = 135
- `wellness-business` — Wellness Center (40) + Health (68) = 108
- `michigan-small-business` — the local/geographic bucket that carries the GEO work

---

## SEO: the classic half

Ranking for "med spa booking software" nationally is not winnable and not worth
winning — those visitors cannot become clients. Ranking for
**"med spa booking software michigan"**, **"online booking for lansing med spa"**,
**"patient intake software grand rapids"** is winnable, because almost nobody is
writing it, and every visitor is inside driving distance.

The pattern for each post:

- **Title** answers a question, under 60 characters, with the place in it.
- **URL** is the question: `/blog/med-spa-booking-software-michigan`.
- **First paragraph** answers it outright. No preamble. This is also what gets
  quoted by an AI assistant.
- **H2s** are the sub-questions someone actually asks next.
- **One concrete number** from the audit data. "47% of the Michigan med spa
  homepages I checked have a JavaScript error" is a fact nobody else has.
- **Named towns**: Lansing, East Lansing, Okemos, Haslett, Grand Rapids, Detroit,
  Novi, Troy, Royal Oak, Birmingham. Use them where they are true.

---

## GEO: the half nobody is doing

Generative Engine Optimisation — being the source an AI assistant cites when
someone asks it a question — rewards different things from Google:

1. **Answer in the first 40 words.** Retrieval pulls passages, not pages. A post
   that opens with throat-clearing gets skipped for one that opens with the
   answer.
2. **Be the origin of a statistic.** Models cite specific, attributable numbers.
   The audit data is a genuine primary source: nobody else has loaded 456
   Michigan wellness homepages on a phone and counted what broke. Say the sample
   size and the date every time.
3. **Structured data.** `Article` and `FAQPage` JSON-LD, so the content is
   machine-readable rather than inferred from divs.
4. **Question-shaped headings.** "How much does patient booking software cost
   for a small clinic?" is retrievable. "Our Approach" is not.
5. **Say the specific thing.** "A Michigan med spa with two providers" beats
   "businesses of all sizes" — vague copy is unquotable, and unquotable copy is
   invisible to a model.
6. **Be consistent across the web.** Same business name, same description, same
   claims on the site, in Google Business Profile, and on LinkedIn. Models
   corroborate across sources.

---

## The first six posts

Ordered by how directly each supports a sales conversation I can already have —
there are **129 Michigan businesses with both an email address and a specific
audit finding** sitting in the CRM today. Each post is something to link in that
first email.

| # | Working title | Category | Targets |
|---|---|---|---|
| 1 | Why your med spa's booking page fails on a phone | med-spa-software | the 217 with console errors |
| 2 | Is your clinic's phone number tappable? (A third aren't) | clinic-operations | the 154 with no tel: link |
| 3 | What I found auditing 456 Michigan wellness websites | michigan-small-business | the flagship data post |
| 4 | Booking software for a Michigan med spa: what you actually need | med-spa-software | commercial intent |
| 5 | Running a clinic on spreadsheets: the real cost | wellness-business | the 0.5% thesis |
| 6 | Do you need a telehealth platform, or just intake that works? | clinic-operations | the honest comparison |

Post 3 is the important one. It is the only piece here that nobody else on the
internet can write, it is the one an AI assistant will cite, and it is a reason
for a stranger to link to jaklabs.io. Write it third, once the first two have
proven the format, and then link the other five to it.

**Cadence:** one post a week beats six in a fortnight and then silence. Search
and answer engines both reward a site that is still being updated.

---

## The measurement

Publishing without measuring is writing into a void.

- Google Search Console on jaklabs.io — impressions and average position for the
  Michigan phrases. This is the only source of truth for whether any of it works.
- Ask the assistants directly, monthly: "who builds booking software for med spas
  in Michigan?" Record whether jaklabs.io is cited. That is the GEO scoreboard
  and there is no dashboard for it yet.
- In the CRM: leads whose source is INBOUND. One inbound lead from a Michigan
  clinic is worth more than any traffic number here.

---

## Status

The admin is live in the CRM. **The website does not yet read from it** — the
blog index still renders a hardcoded array from January, and the article page
renders Lorem ipsum rather than post content. Connecting it is the next build,
and until it is done, publishing changes nothing a visitor can see.
