# Campaign plan — local service businesses, Michigan

JAK Labs · JD Kemp · August 2026

Positioning decided: **local service businesses generally**, not a single vertical.
Wellness stays as the current campaign and the proof of method, not the identity.

---

## The unfair asset everything here is built on

You own a machine that produces **a true, specific, personal observation about
any local business — without their permission, their access, or their time.**

The auditor is industry-agnostic. Six of its seven checks — JavaScript errors,
untappable phone number, slow on mobile, sideways scroll, no HTTPS, no mobile
viewport — apply identically to a plumber, a dentist, a body shop or a bakery.
The seventh looks for "book / appointment / schedule / contact / get started",
which every service business has some version of.

Marginal cost per business audited: effectively zero. Places API costs a few
cents per query; the audit itself is free and needs no key.

**That is the whole strategic advantage.** Every competitor selling to local SMBs
opens with *"I noticed your website could use some work."* You can open with
*"your booking button throws an error on iPhone, and here is a screenshot."*

Every campaign below is a different way of converting that one asset into
attention. That is what makes them reach every business rather than one trade.

---

## 1. The free audit tool on jaklabs.io ⭐ do this first

**Enter your website → get your report in 30 seconds.**

Self-serve, no login, works for any industry. The same seven checks, run live,
returned as plain English with the fixes.

Why this is the strongest idea on the list:

- **It reaches everyone by construction.** A plumber and a dental practice get
  the same tool and different, true answers.
- **It demonstrates competence instead of claiming it.** The site currently says
  "results-driven" and "fast execution", which is what every agency site says.
  A tool that finds a real fault in ten seconds is unarguable.
- **Every user is a qualified lead with a known problem**, and they arrived
  themselves. Email for the full report is a fair trade at that moment.
- **It is the best SEO/GEO asset you could own.** "free website audit",
  "is my website mobile friendly", "why is my site slow" — high-intent, and an
  answer engine asked "how do I check if my site works on mobile" has a concrete
  tool to point at.
- **It feeds everything else.** Every audit run is a data point for §2.

Build note: the auditor is Playwright, which does not run in a normal Lambda —
it needs a container image or Fargate. That is the one real cost here, and it is
the reason to do it properly once rather than fake it.

**Guard rail:** rate-limit by IP and only audit the domain someone enters. A
public tool that will fetch any URL on demand is an open proxy.

---

## 2. The Michigan Small Business Web Report — quarterly

Sweep 10–12 trades across Michigan, audit every site, publish the league table.

> *Plumbers: 38% have a JavaScript error. Restaurants: 61%. Dentists: 22%.
> Ranked, by trade, 2,000 businesses, Q3 2026.*

This is the authority play, and it does four jobs at once:

1. **PR and links.** Trade associations, chambers, and local business press all
   want to know where their people rank. Those are exactly the links that are
   hard to buy and easy to earn with real data.
2. **GEO.** Being the *origin* of a statistic is what gets a source cited by an
   answer engine. Nobody else has this number because nobody else has run it.
3. **A reason to contact literally every business in it.** "Your trade is in
   this report and here is your own line in it" is a warm opener to a stranger.
4. **A talk.** A chamber or trade night wants a speaker with data, not a pitch.

**Rule: never name an individual business publicly.** Aggregate in public,
specific in private. Naming a local plumber's broken site in a published report
is a lawsuit-adjacent way to become the person nobody in town returns calls to.

---

## 3. Per-trade pages built from that data

`/michigan/plumbers`, `/michigan/dentists`, `/michigan/auto-repair`…

Each page carries **that trade's real numbers** — how many were audited, what
broke most often, what it costs that specific trade. A plumber's page talks
about emergency call-outs and tappable phone numbers; a restaurant's talks about
menus that do not load on a phone.

This is programmatic SEO that is not spam, because every page contains data that
exists nowhere else. Ten trades × the phrases each one searches is a long tail
you can actually own, and it is the natural landing page for §2's press.

---

## 4. Outreach at scale — already half built

The pipeline exists and has run once. Extending it beyond wellness is a config
change, not a build: the query set, the sweep, the audit, the CRM import and the
do-not-contact gate all work.

Today: **129 Michigan businesses with an email address and a specific finding.**
Ten trades at Lansing's density — 143 businesses from four queries in that metro
alone — is thousands.

Sequence per trade: sweep → audit → import → email the ones with a finding →
call the ones without an email. The email is one true sentence about their site
and an offer to send the rest.

---

## 5. The businesses with no website at all — different campaign

26 of 501 wellness businesses had no website. Across trades that fraction is
almost certainly higher — plenty of trades run on a Facebook page and a phone.

These are **the highest-intent and least-contested prospects you have**, and they
are invisible to every competitor doing digital outreach, because there is no
site to critique and no email to scrape.

They cannot be emailed. They can be called, visited, or posted to. That makes
them a natural fit for the local half of the plan, and the pitch is different:
not "your site is broken" but "you do not have one, here is what that costs in
a market where your competitors are on page one."

---

## 6. Local and in person — the Lansing advantage

You live here, which the sweep says most of the competition does not.

- **Chamber / BNI / trade nights.** The Q report is the talk. One evening reaches
  fifty owners with a name badge and a reason to remember you.
- **Walk-ins for the no-website segment.** A printed one-page audit handed over a
  counter is a different experience from an email.
- **Referral loops between trades.** Local service owners talk to each other more
  than any vertical does. One happy plumber is worth more here than in wellness.

---

## How they compose

```
   the auditor  ──┬──►  free tool on the site   ──►  inbound leads
                  │            │
                  │            └──►  usage data ──┐
                  │                               ├──►  the Q report ──►  press, links, talks
                  ├──►  bulk sweep by trade ──────┘                            │
                  │            │                                               ▼
                  │            └──►  cold outreach (129 today, thousands next)  per-trade pages
                  │                                                            │
                  └──►  no-website list ──►  phone / door / mail            organic search
```

One asset, five surfaces. The tool feeds the report, the report feeds the pages
and the talks, the pages feed the tool. Outreach runs off the same sweep.

---

## What I would actually do, in order

| # | Move | Effort | Why now |
|---|---|---|---|
| 1 | Site metadata + `LocalBusiness` JSON-LD + Michigan on the page | hours | Mechanical, no decisions left, everything else lands on these pages |
| 2 | Rewrite services to what you sell, "we" → "I" | a day | The blog is already sending people to the wrong page |
| 3 | Free audit tool | ~a week | The compounding asset. Every day it is not live is inbound not captured |
| 4 | Sweep 3 trades in Lansing, run outreach | ~a day | Proves the method outside wellness before scaling it |
| 5 | Q report from 10 trades | ~a week | Needs §4 to have run first |
| 6 | Per-trade pages | days | Needs §5's data |

Steps 1 and 2 are the audit's findings and need no new thinking. Step 3 is the
one that changes the shape of the business.

---

## The honest risks

- **Places API costs money per request.** Ten trades × several metros is real
  spend. Dry-run first; the tool already estimates.
- **A public audit tool is abusable.** Rate limits and same-domain-only are not
  optional.
- **Naming businesses publicly is a reputational landmine** in a market where you
  want to be the local who shows up. Aggregate in public, specific in private.
- **Breadth can become mush.** "Local service businesses" is the identity, but
  every individual campaign should still speak to one trade at a time. The
  homepage can be general; the outreach never should be.
