# Content expiry — the claims on jaklabs.io that stop being true on a known date

Read `~/claude-server/haslett-website/CONTENT-EXPIRY.md` first: it explains the row format,
why `changes-on` must be an ISO date, and why a tripwire exists. The script is the same one
(`~/claude-server/scripts/content-expiry.py`), which watches **one register per site** — a
row's relative `source` resolves against *its own* site directory, so a path here is read
out of `jaklabs-website`, never out of the Haslett repo.

## ⚠️ The claims below expire on an EVENT, not a date, and that is a real mismatch

Every row in the Haslett register has a date somebody else published — a HUD notice, a
course end date. These do not. The `/payments` page stops being true when **counsel and a
CPA sign off and mainnet goes live**, which is an event with no date on it.

So be honest about what this register does and does not buy here:

- **It buys a dated review.** The date is a day by which somebody must go and look, not a
  day the claim becomes false. Rolling it forward is the *expected* outcome, exactly as it
  is for the Haslett `section8` rows where HUD has already moved the date three times.
- **It buys drift detection.** If the sentence leaves the page, the row says so instead of
  sitting here looking maintained.
- **It does NOT catch mainnet going live while the page is unchanged**, which is the
  failure that actually costs something: the page would be telling buyers they cannot pay
  while they can. `payments-mainnet-gate` below is the closest thing to a real guard for
  it — it tripwires the website's promise against the *payments repo's own status line* —
  but it depends on that repo's `CLAUDE.md` being kept current. A guard standing on a
  human updating a markdown file is weaker than one standing on a deploy, and saying so
  here is better than implying otherwise. The strong version belongs in the
  `ballast-payments` deploy path, not in a website content register.

<!-- expiry:payments-test-network -->
### payments-test-network — /payments says no live money has moved through it

The page sells the payment service and publishes its rates, and it states in two places —
the status pill under the hero and the "Where this actually stands" panel — that the system
runs on a **test network** and that no live money has gone through it. That is true as of
24 October 2026: `ballast-payments` is deployed to devnet only, mainnet is not deployed,
and mainnet will not start without `PRICE_SOURCE` because par-versus-market is the CPA's
call.

It is the right thing to say today and it becomes the **wrong** kind of wrong the moment
money can move: a page that tells a buyer they cannot pay yet, when they can, is worse than
one that never mentioned it. The status pill, the panel, and the closing line of the "it
does not fit if" column all have to move together.

Affected: `src/app/payments/page.tsx` (the `pm-dot` pill, the `StatusNote` panel) and the
blog post `what-it-costs-to-take-a-payment`, which carries the same claim and lives in
DynamoDB rather than git — so no build and no test will ever catch that copy of it.

<!-- expiry:payments-mainnet-gate -->
### payments-mainnet-gate — the promise that two professionals sign off first

The page tells buyers that before any live money moves, "two people who are not me have to
sign off: an accountant on how a payment is valued in dollars, and an attorney on the
terms". That promise is only true while the mainnet price source is still unbuilt.

⚠️ **This row's source is the PAYMENTS REPO, not the website**, and that inversion is the
point. Its tripwire is the line in `ballast-payments/CLAUDE.md` that lists "price source for
mainnet (CPA)" under *Not built yet*. If that line goes, the CPA decision has probably
landed — and nothing about the website would look broken. The row firing is the prompt to
go and check whether jaklabs.io is still promising a sign-off that has already happened.

```content-expiry
# id | claim | changes-on | source | tripwire | action
payments-test-network | The /payments page says the payment service runs on a test network and that no live money has gone through it | 2026-12-15 | https://jaklabs.io/payments | no live money has moved through it yet | FIRST check whether mainnet went live and whether counsel and the CPA signed off. If not, roll this date forward -- that is the expected outcome, not a failure. If it did, rewrite the status pill and the "Where this actually stands" panel in src/app/payments/page.tsx, and fix the same claim in the blog post what-it-costs-to-take-a-payment, which is in DynamoDB and will not be caught by any build.
payments-mainnet-gate | The /payments page promises an accountant and an attorney sign off before live money moves, which holds only while the mainnet price source is unbuilt | 2026-12-15 | /Users/jak/claude-server/ballast-payments/CLAUDE.md | price source for mainnet (CPA) | The tripwire here is the PAYMENTS REPO, not the website. If it fired, ballast-payments no longer lists the mainnet price source as unbuilt, so the CPA decision has probably landed while jaklabs.io/payments still promises it has not. Check the real state, update the website, then roll or retire this row.
```
