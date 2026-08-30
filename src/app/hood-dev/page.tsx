import type { Metadata } from 'next'
import Link from 'next/link'

/**
 * Hood Dev on the parent site.
 *
 * The school lives at hood.jaklabs.io with its own identity, its own Cognito
 * pool and its own brand. Until now nothing on jaklabs.io mentioned it, so a
 * developer who heard about Hood Dev and came to the main site found nothing
 * and had no route in — the student pool had zero users because there was no
 * door.
 *
 * This page is that door, and nothing more. It explains the school, then sends
 * people to hood.jaklabs.io to sign up. Signup, auth and the product all stay
 * over there; duplicating the flow here would split the auth surface across two
 * domains for no gain.
 *
 * VOICE: this is a different reader from the rest of the site. Everything else
 * talks to a business owner buying software. This talks to a developer, in Hood
 * Dev's voice — a tradesman to an apprentice, plainly, no hype. The vocabulary
 * (Teardown, Read, Leaks, Work Order) is load-bearing brand, not decoration.
 *
 * WHAT IS NOT CLAIMED, deliberately: no student count, no outcomes, no
 * placement rate, no pricing beyond "free". The school launched days ago with
 * nobody in it, and VISION.md is explicit that the pricing ladder must not be
 * committed to publicly before the day-90 gate.
 */

const HOOD = 'https://hood.jaklabs.io'

export const metadata: Metadata = {
  title: 'Hood Dev — the school for forward-deployed engineers',
  description:
    'An online school that assesses you first, names what is actually holding you back, and builds '
    + 'a track around it — applied to a real project of your own. Free while it is being built.',
  alternates: { canonical: '/hood-dev' },
  openGraph: {
    type: 'website',
    url: '/hood-dev',
    title: 'Hood Dev — software is a trade. Come learn it in the shop.',
    description:
      'Assessed first, then a track built for your specific leaks. Not another curriculum.',
  },
}

const LEAKS = [
  {
    title: 'Reading somebody else’s codebase',
    body:
      'The job is almost never a blank file. It is forty thousand lines somebody else wrote, with the '
      + 'person who understood it gone. Nobody teaches this, and everybody needs it on week one.',
  },
  {
    title: 'Working from an ambiguous spec',
    body:
      'A ticket that says what somebody wants but not what to build. Turning that into a decision you '
      + 'can defend is most of the job, and it is not a syntax problem.',
  },
  {
    title: 'Deploying into a real business',
    body:
      'Production is not a bigger laptop. It has IAM, other people’s data, and consequences on a '
      + 'Saturday. The failure modes only exist there, which is why nobody meets them in a course.',
  },
  {
    title: 'Explaining a tradeoff to a non-engineer',
    body:
      'If the person paying cannot follow why you chose one thing over another, you are not trusted with '
      + 'the next decision. This is a skill, and it is learnable, and it is never taught.',
  },
]

const STEPS = [
  {
    n: '01',
    name: 'The Teardown',
    body:
      'An assessment before anything is taught. Not a quiz — a look at how you actually work, the way a '
      + 'mechanic puts a car on the lift before quoting anything.',
  },
  {
    n: '02',
    name: 'The Read',
    body:
      'What kind of developer you are, and where you leak. Delivered plainly, with the evidence, without '
      + 'softening. It should tell you something you felt but could not name.',
  },
  {
    n: '03',
    name: 'The Work Order',
    body:
      'A track built for your leaks specifically — not the same curriculum everyone else gets at a '
      + 'different pace. Anchored to a real project of yours, not a to-do app.',
  },
  {
    n: '04',
    name: 'Bay time',
    body:
      'Direct time with me on your own work. Earned at the Journeyman gate rather than scheduled, because '
      + 'hours are the scarce thing and they should go to people already moving.',
  },
]

export default function HoodDevPage() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="subheading mb-4">Hood Dev · a JAK Labs school</p>
            <h1 className="heading-xl mb-8">
              Software is a trade.{' '}
              <span className="text-gradient-neon">Come learn it in the shop.</span>
            </h1>
            <div className="space-y-5 text-lg text-white/70">
              <p>
                Every other school sells the same curriculum to everybody and calls the difference
                &ldquo;pace&rdquo;. That is a factory. A good mechanic looks at{' '}
                <span className="text-white">your</span> engine before touching a wrench.
              </p>
              <p>
                Hood Dev assesses you first, tells you what kind of developer you actually are and
                where you actually leak, then builds a track around that — applied to a real project
                you already care about.
              </p>
              <p className="text-white">
                It is free while I build it. No card, no paywall.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={`${HOOD}/signup`} className="btn-primary"
                    target="_blank" rel="noopener noreferrer">
                Start the Teardown
              </Link>
              <Link href={`${HOOD}/login`} className="btn-secondary"
                    target="_blank" rel="noopener noreferrer">
                Already signed up? Log in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container-custom">
          <div className="max-w-3xl mb-12">
            <p className="subheading mb-4">What it is actually for</p>
            <h2 className="heading-lg mb-6">
              The half of the job <span className="text-gradient-neon">nobody teaches</span>
            </h2>
            <p className="text-white/70">
              Forward-deployed and applied-AI work is not bottlenecked on whether you can write a
              loop. It is bottlenecked on the messy half — and bootcamps teach syntax while
              universities teach theory.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {LEAKS.map((l) => (
              <div key={l.title} className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-semibold mb-3">{l.title}</h3>
                <p className="text-sm text-white/60">{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mb-12">
            <p className="subheading mb-4">How it works</p>
            <h2 className="heading-lg">Diagnose, then treat</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div className="text-sm font-mono text-neon-purple mb-2">{s.n}</div>
                <h3 className="text-lg font-semibold mb-3">{s.name}</h3>
                <p className="text-sm text-white/60">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className="subheading mb-4">Who it is for</p>
              <div className="space-y-4 text-white/70">
                <p>
                  <span className="text-white">The stuck mid-level developer.</span> One to five years
                  in, shipping tickets, sensing a ceiling and unable to name it. The assessment exists
                  for you.
                </p>
                <p>
                  <span className="text-white">The self-taught builder.</span> You can build. You know
                  where the gaps are — testing, systems design, production — and you have been putting
                  them off.
                </p>
                <p>
                  <span className="text-white">The graduate who did not land.</span> You have the
                  syntax and none of the messy half.
                </p>
              </div>
            </div>
            <div>
              <p className="subheading mb-4">Who it is not for</p>
              <div className="space-y-4 text-white/70">
                <p>
                  <span className="text-white">Anyone who has never written code.</span> Hood Dev
                  diagnoses developers. With nothing to measure there is nothing to diagnose, and
                  pretending otherwise would poison both the assessment and the room.
                </p>
                <p>
                  Learn the basics somewhere else first, then come back and get taken apart properly.
                </p>
                <p className="text-sm text-white/40 pt-2">
                  I would rather tell you that now than take your time and your attention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="subheading mb-4">Why me</p>
            <h2 className="heading-lg mb-6">
              I teach the messy half because{' '}
              <span className="text-gradient-neon">it is what I do for a living</span>
            </h2>
            <div className="space-y-4 text-white/70">
              <p>
                I build production software for real businesses, and I run one that depends on
                software I wrote. Reading someone else&apos;s codebase, working from a vague brief,
                deploying where a mistake costs money, and explaining a tradeoff to somebody who does
                not write code — that is not curriculum to me, it is Tuesday.
              </p>
              <p>
                The school is also where I learn. I am user number one and I am on it every day,
                which is the honest reason it is free right now: it is not finished, and I would
                rather it be good before it has a price.
              </p>
              <p className="text-sm text-white/40">
                More on the engineering side of what I do:{' '}
                <Link href="/engineering" className="text-neon-purple hover:text-neon-pink">
                  jaklabs.io/engineering
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container-custom">
          <div className="max-w-2xl">
            <h2 className="heading-lg mb-6">
              Get on the lift
            </h2>
            <p className="text-white/70 mb-4">
              The Teardown takes about an hour and you get the Read at the end of it, whether or not
              you go any further. If it tells you nothing you did not already know, you have lost an
              hour and learned that you are further along than you thought.
            </p>
            <p className="text-white/50 mb-8 text-sm">
              Hood Dev is a new school and it is deliberately free while it is being built. You are
              early, and early means the thing bends around you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={`${HOOD}/signup`} className="btn-primary"
                    target="_blank" rel="noopener noreferrer">
                Sign up at hood.jaklabs.io
              </Link>
              <Link href={HOOD} className="btn-secondary"
                    target="_blank" rel="noopener noreferrer">
                Look around first
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
