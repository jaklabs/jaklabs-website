import type { Metadata } from 'next'
import Link from 'next/link'
import localFont from 'next/font/local'
import { social } from '@/lib/social'
import BallastMeter from './BallastMeter'

/**
 * Ballast — the multi-tenant service-business platform.
 *
 * WHAT THIS PAGE IS, AND WHAT IT IS NOT
 *
 * It is the INFORMATION page for the product. The product itself will live at
 * runballast.com once that is registered; this page exists on jaklabs.io the way
 * /verdikt, /quarry and /telehealth do — one page per product, on the house
 * brand, so a crawler and a reader can both find it from here.
 *
 * ⚠️ BALLAST HAS NO CUSTOMERS. One shop runs on it and it is MINE (Haslett
 * Handyman). Every figure on this page is Haslett's production record, and the
 * page has to make that unmistakable rather than letting a reader infer a
 * customer base. This is the same line /telehealth draws ("built and owned, no
 * operator yet — the page states that rather than implying otherwise"), and the
 * same one /ops-platform draws about Haslett not being a client. Do not blur it:
 * the credibility of everything else here depends on this paragraph being true
 * and said out loud.
 *
 * ⚠️ NO PRICES. D4 (plans and prices) is OPEN in
 * master-crm/PLATFORM-PROJECT-MANAGEMENT.md, and the recommendation on record
 * says the tiers are tested on founding shops BEFORE being published. Putting a
 * number here would close that decision by accident, and a published price is
 * hard to raise. The page argues the PRICING MODEL — per shop, not per tech —
 * which is decided, and says the number comes later.
 *
 * ⚠️ NO COMPETITOR PRICE, EVER. ServiceTitan does not publish pricing. A
 * specific invented figure against a named competitor is the one claim on this
 * site that could actually draw a letter, and "~$245 / tech / month" was already
 * removed from /ops-platform for exactly that reason. The comparison is on the
 * MODEL — metered per head versus flat per shop — which is true, checkable, and
 * argues the point just as well. BallastMeter.tsx asks the reader for their own
 * rate instead; read the note at the top of that file before touching it.
 *
 * ⚠️ EVERY FIGURE IS REGISTER-BACKED. jak-labs/content-engine/facts.toml:
 *   $216K invoiced ......... haslett-invoiced
 *   $610 over 30d late ..... haslett-collected
 *   253 jobs ............... haslett-jobs
 *   3,235 transactions ..... haslett-transactions
 *   51 automations / 18 ..... haslett-automations
 *   ~140 hrs ............... haslett-hours      — an ESTIMATE, labelled as one
 *   one engineer ........... headcount
 *   free ................... audit-free
 * A figure not in that register does not go on this page. Two of the worst
 * mistakes in this project were both invented numbers in live site copy.
 *
 * WHY IT DOES NOT CONTRADICT /ops-platform
 *
 * /ops-platform sells this same codebase OUTRIGHT to a multi-shop operator and
 * argues against per-seat recurring. Ballast is a subscription. That looks like a
 * contradiction and is not: the thing being argued against is the METER, not the
 * subscription. Per-TECH pricing is what prices a small shop out and makes
 * hiring a software decision. Flat-per-shop fixes that; owning it outright also
 * fixes it, for a buyer large enough to want the asset. Both pages now say this,
 * and §"the wrong answer" links across. Keep them pointing at each other.
 *
 * SKIN: navy with a level-vial green, scoped to .ballast-skin in globals.css.
 * The visual idea is a SPIRIT LEVEL — ballast is what keeps a vessel level as
 * the load changes, which is also the argument. Deliberately unlike the brass of
 * /ops-platform, because if the two pages looked alike a reader would read them
 * as one offer at two prices.
 */

/*
 * Fonts are SELF-HOSTED. Do not put `next/font/google` back.
 *
 * Amplify build 109 failed outright because next/font could not reach Google to
 * fetch a family -- a commit that only touched the homepage hero died on a
 * network call for a font on a different page. It is invisible locally, where
 * the fonts are cached, so it only ever fails in CI and reads as "your code
 * broke". Adding a weight means adding a file -- see scripts/fetch-fonts.py.
 */
const space = localFont({
  src: [
    { path: '../../fonts/SpaceGrotesk/500.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/SpaceGrotesk/600.woff2', weight: '600', style: 'normal' },
    { path: '../../fonts/SpaceGrotesk/700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-space',
  display: 'swap',
})
const hanken = localFont({
  src: [
    { path: '../../fonts/HankenGrotesk/400.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/HankenGrotesk/500.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/HankenGrotesk/600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-hanken',
  display: 'swap',
})
const jet = localFont({
  src: [
    { path: '../../fonts/JetBrainsMono/400.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/JetBrainsMono/500.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-jet',
  display: 'swap',
})

const MAILTO =
  'mailto:jdakemp@gmail.com?subject='
  + encodeURIComponent('Ballast — founding shop')
  + '&body='
  + encodeURIComponent(
    'Hi JD,\n\nI read the Ballast page. Here is my shop:\n\n'
    + '- Trade(s):\n- Techs in the field:\n- What we run today:\n'
    + '- What we pay for it:\n- The thing that wastes the most time:\n\n',
  )

// Haslett's production record. NOT Ballast's customer record — Haslett is my
// own company and the copy around this says so.
const READOUT = [
  { n: '$216K', k: 'invoiced through it · $610 more than 30 days late' },
  { n: '253', k: 'jobs carried to complete, billed or paid' },
  { n: '3,235', k: 'bank transactions categorised with nobody touching them' },
  { n: '51', k: 'scheduled automations running · 18 of them move real money' },
]

const DOES = [
  ['Email turns into a job', 'an enquiry lands and becomes a ticket without anyone opening it'],
  ['Approve once, invoice itself', 'multi-rate crew billing, lead and helper rates'],
  ['Every lead in one queue', 'website, email and marketplaces, spam filtered out'],
  ['The books stay current', 'QuickBooks and bank sync, receipts read by camera'],
  ['Crew app for the field', 'close-outs, photos and per-person hours from the truck'],
  ['Money you are owed, on one screen', 'who owes what, and how late'],
]

// The comparison is on the MODEL. Never on an invented competitor price.
const COMPARE = [
  {
    them: 'Priced per tech, per month, forever. The bill goes up every time you hire, so growing the crew becomes a software decision.',
    you: 'Priced per shop. Hire your fifth tech without phoning your software vendor.',
  },
  {
    them: 'Built for the general case, which means built for the shape most shops have. If yours is different you work around it for years.',
    you: 'Built to run one real shop first, then shaped for the next one. The odd corners are the point, not the exception.',
  },
  {
    them: 'The software stops at the handoff to accounting. Support is a ticket queue.',
    you: 'It carries on into the books, and you talk to the person who wrote it.',
  },
]

const WRONG = [
  {
    h: 'You need it working next week',
    p: 'Then buy the subscription. Ballast takes founding shops in early 2027 and a demo on Monday beats a better tool in March. If the bleeding is happening now, stop the bleeding.',
  },
  {
    h: 'You want a support desk',
    p: 'There is one engineer here. No overnight rota, no phone number that reaches a stranger who can help at eleven on a Saturday. A big vendor gives you that and I cannot. It is a real thing to buy and a legitimate reason to buy it.',
  },
  {
    h: 'You run fifty techs across six locations',
    p: 'You are the other page. At that size owning the codebase outright beats renting it, and the economics stop arguing for a subscription.',
    href: '/ops-platform',
    cta: 'See the acquisition option',
  },
  {
    h: 'Your operation is the standard shape',
    p: 'Calls in, jobs dispatched, work invoiced, no "except". If that describes you with no caveat, the off-the-shelf products were designed for exactly you and they are good software.',
    href: '/blog/servicetitan-jobber-or-something-built-for-you',
    cta: 'The honest comparison',
  },
]

export const metadata: Metadata = {
  title: 'Ballast — field service software priced per shop, not per tech',
  description:
    'Job management, invoicing and books for a small service business, priced per shop instead '
    + 'of per technician. It runs one shop in production today — my own. Founding shops for '
    + 'early 2027.',
  alternates: { canonical: '/ballast' },
  ...social('default', {
    type: 'website',
    url: '/ballast',
    title: 'Priced per shop, not per tech.',
    description:
      'The software that runs my own service business, being made available to shops priced out '
      + 'of the enterprise tools. $216K invoiced through it. Founding shops for early 2027.',
  }),
}

function Head({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="bl-in mb-8">
      <p className="bl-eyebrow mb-3">{eyebrow}</p>
      <h2 className="text-3xl md:text-4xl font-bold">{children}</h2>
      <div
        className="bl-rule mt-5 h-px w-24 origin-left"
        style={{ background: 'var(--bl-level)' }}
      />
    </div>
  )
}

export default function BallastPage() {
  return (
    <div className={`ballast-skin ${space.variable} ${hanken.variable} ${jet.variable}`}>
      {/* Hero, sitting on a waterline. */}
      <section className="bl-waterline pt-32 pb-14">
        <div className="container-custom max-w-4xl">
          <div className="bl-in">
            <p className="bl-eyebrow mb-4">Ballast · a JAK Labs platform</p>
            <h1 className="mb-6 text-4xl font-bold leading-[1.07] md:text-5xl lg:text-6xl">
              Priced per shop.
              <br />
              Not per tech.
            </h1>
            <p className="mb-7 max-w-2xl text-lg leading-relaxed">
              Job management, invoicing and books for a service business — quoting, scheduling,
              the crew app, and the money. The difference is the pricing model: the bill does not
              go up when you hire, so growing the crew stops being a software decision.
            </p>
            <p
              className="bl-mono inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-medium bl-ink"
              style={{ background: 'var(--bl-level-ghost)', borderColor: 'var(--bl-line)' }}
            >
              <span className="bl-dot" />
              Running one shop today — mine · founding shops early 2027
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <a href={MAILTO} className="bl-btn">Ask about a founding spot</a>
              <a href="#meter" className="bl-btn-ghost">Do the arithmetic first</a>
            </div>
          </div>
        </div>
      </section>

      {/* The readout. Haslett's real production record, labelled as such. */}
      <section className="pb-16">
        <div className="container-custom max-w-4xl">
          <div className="bl-in mb-5">
            <h2 className="text-xl font-bold md:text-2xl">
              It already runs a service business end to end. Mine.
            </h2>
            <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed">
              I own a handyman company in Haslett, Michigan. I wrote this software to run it, and
              it has been running it for a year. These are that company&rsquo;s numbers, out of its
              own system of record — not a customer&rsquo;s, because{' '}
              <strong className="bl-ink">Ballast has no customers yet</strong>. That is the whole
              reason there is a founding-shop list instead of a sign-up button.
            </p>
          </div>
          <div className="bl-panel overflow-hidden">
            <div className="grid grid-cols-2 bl-stagger md:grid-cols-4">
              {READOUT.map((m, i) => (
                <div
                  key={m.n}
                  className="border-b border-r p-5 last:border-r-0"
                  style={{ borderColor: 'var(--bl-line)', ['--i' as string]: i }}
                >
                  <p className="bl-num text-2xl md:text-3xl">{m.n}</p>
                  <p className="mt-2 text-[13px] leading-snug">{m.k}</p>
                </div>
              ))}
            </div>
            <div className="px-5 py-3.5 bl-panel-2">
              <p className="bl-mono text-[11px] leading-relaxed bl-faint">
                Plus around 140 hours of admin off my own plate — that last one is my estimate, not
                a measurement, and it is the only figure here that is.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The meter. The page's central argument, made interactive. */}
      <section id="meter" className="scroll-mt-24 pb-16">
        <div className="container-custom max-w-4xl">
          <Head eyebrow="The arithmetic">What per-tech pricing costs you to grow</Head>
          <p className="bl-in mb-7 max-w-2xl text-[15px] leading-relaxed">
            I am not going to tell you what anybody else charges — the big platforms don&rsquo;t
            publish their pricing, so any number I put here would be made up. Use your own, off
            your own invoice. The arithmetic runs in your browser and nothing is sent anywhere.
          </p>
          <div className="bl-in">
            <BallastMeter />
          </div>
        </div>
      </section>

      {/* The level. Two columns, metered vs flat. */}
      <section className="pb-16">
        <div className="container-custom max-w-4xl">
          <Head eyebrow="The difference">Where the two models part company</Head>
          <div className="bl-in mb-8">
            <div className="bl-vial">
              <div className="bl-bubble" />
            </div>
            <p className="bl-mono mt-2.5 text-[11px] bl-faint">
              ballast · what keeps a vessel level as the load changes
            </p>
          </div>
          <div className="space-y-4 bl-stagger">
            {COMPARE.map((c, i) => (
              <div
                key={c.you}
                className="bl-panel grid gap-0 overflow-hidden md:grid-cols-2"
                style={{ ['--i' as string]: i }}
              >
                <div
                  className="border-b p-5 md:border-b-0 md:border-r"
                  style={{ borderColor: 'var(--bl-line)' }}
                >
                  <p className="bl-mono mb-2.5 text-[11px] uppercase tracking-[0.14em] bl-warn">
                    Metered per head
                  </p>
                  <p className="text-[14.5px] leading-relaxed">{c.them}</p>
                </div>
                <div className="p-5 bl-panel-2">
                  <p className="bl-mono mb-2.5 text-[11px] uppercase tracking-[0.14em] bl-level">
                    Ballast
                  </p>
                  <p className="text-[14.5px] leading-relaxed bl-ink">{c.you}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What it does. */}
      <section className="pb-16">
        <div className="container-custom max-w-4xl">
          <Head eyebrow="What it does">The parts that take your evenings</Head>
          <div className="grid gap-3.5 bl-stagger sm:grid-cols-2">
            {DOES.map(([h, p], i) => (
              <div key={h} className="bl-panel p-5" style={{ ['--i' as string]: i }}>
                <p className="mb-1.5 font-semibold bl-ink">{h}</p>
                <p className="text-[14px] leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Isolation. The one technical claim worth making to this buyer. */}
      <section className="pb-16">
        <div className="container-custom max-w-4xl">
          <Head eyebrow="Your data">Another shop cannot read your jobs</Head>
          <div className="bl-in bl-panel p-6 md:p-7">
            <p className="mb-4 text-[15px] leading-relaxed">
              Shops share the platform, so the honest question is what stops one of them seeing
              another&rsquo;s customers. The usual answer is &ldquo;the code filters by
              account&rdquo;, and that answer is one forgotten line from a leak.
            </p>
            <p className="mb-4 text-[15px] leading-relaxed">
              Here every record is stored under a key that starts with your shop&rsquo;s id, and
              the database credentials each request runs under are{' '}
              <strong className="bl-ink">only permitted to read keys beginning with that id</strong>.
              So if I ever write a query that forgets to filter by shop, it does not quietly return
              someone else&rsquo;s data — it is refused, and I get an error instead of you getting a
              breach.
            </p>
            <p className="text-[14px] leading-relaxed bl-faint">
              Built that way from the first commit rather than added later, because the failure it
              prevents is the one you can never apologise your way out of. There is a test in the
              build that fails if a query goes out unscoped.
            </p>
          </div>
        </div>
      </section>

      {/* Honest status. */}
      <section className="pb-16">
        <div className="container-custom max-w-4xl">
          <Head eyebrow="Where it actually is">The unflattering version</Head>
          <div className="bl-in bl-panel p-6 md:p-7">
            <ul className="space-y-3.5 text-[15px] leading-relaxed">
              <li className="flex gap-3">
                <span className="bl-level mt-px">—</span>
                <span>
                  <strong className="bl-ink">One shop runs on it: mine.</strong> A year in
                  production, real money, real crew. One shop is not a track record across the
                  trades and I am not going to pretend otherwise.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="bl-level mt-px">—</span>
                <span>
                  <strong className="bl-ink">The multi-shop work is underway now.</strong> The
                  software was written for one company and is being rebuilt to carry several. That
                  is most of the work between here and a second shop.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="bl-level mt-px">—</span>
                <span>
                  <strong className="bl-ink">Founding shops come on in early 2027.</strong> That
                  date moves with the build, and I would rather tell you that now than miss it
                  later. You will get a date I believe, not a date that sounds good.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="bl-level mt-px">—</span>
                <span>
                  <strong className="bl-ink">The price is not set.</strong> It is per shop, not per
                  tech — that part is decided. The number gets worked out with the first few shops
                  rather than announced at them, and anyone in that group knows what it is before
                  they commit to anything.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* When I am the wrong answer. */}
      <section className="pb-16">
        <div className="container-custom max-w-4xl">
          <Head eyebrow="Be honest">When Ballast is the wrong answer</Head>
          <p className="bl-in mb-7 max-w-2xl text-[15px] leading-relaxed">
            Four situations where you should not wait for this. I would rather say so here than
            after you have rearranged your business around a date.
          </p>
          <div className="grid gap-3.5 bl-stagger sm:grid-cols-2">
            {WRONG.map((w, i) => (
              <div key={w.h} className="bl-panel flex flex-col p-5" style={{ ['--i' as string]: i }}>
                <p className="mb-2 font-semibold bl-ink">{w.h}</p>
                <p className="flex-1 text-[14px] leading-relaxed">{w.p}</p>
                {w.href && (
                  <Link
                    href={w.href}
                    className="bl-mono mt-3.5 text-[12px] font-medium bl-level hover:underline"
                  >
                    {w.cta} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA. Tailored line, then the free check, then the free audit — the
          standing order for every page and post on this site. */}
      <section className="pb-28">
        <div className="container-custom max-w-4xl">
          <div
            className="bl-in rounded-2xl border p-7 md:p-10"
            style={{ borderColor: 'var(--bl-line)', background: 'var(--bl-panel)' }}
          >
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              A handful of founding shops, then it opens up.
            </h2>
            <p className="mb-5 max-w-2xl text-[15px] leading-relaxed">
              I want shops whose work does not fit the standard mould, because those are the ones
              that make the software worth having. Tell me your trade, how many techs you run, what
              you use today and what it costs you. If Ballast is wrong for you I will say so in the
              reply — there is nothing to buy right now, so I have no reason not to.
            </p>
            <div className="mb-7 flex flex-wrap gap-3.5">
              <a href={MAILTO} className="bl-btn">Ask about a founding spot</a>
              <Link href="/contact" className="bl-btn-ghost">Book a free Operations Audit</Link>
            </div>
            <div className="border-t pt-5" style={{ borderColor: 'var(--bl-line)' }}>
              <p className="text-[14px] leading-relaxed">
                <strong className="bl-ink">Not ready to talk to anyone?</strong> Run the{' '}
                <Link href="/website-audit" className="bl-level hover:underline">
                  free website check
                </Link>{' '}
                instead — it takes a URL, needs no signup, and tells you what a customer on a phone
                runs into on your site. Or book the{' '}
                <Link href="/contact" className="bl-level hover:underline">
                  free 30-minute Operations Audit
                </Link>
                : half an hour on where your week actually goes, with no obligation and nothing to
                install.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
