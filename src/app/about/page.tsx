'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Target, Lightbulb, Users, Award, ArrowRight, Github, ShieldCheck, Database, Workflow } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui'

const values = [
    {
        icon: Target,
        title: 'Results First',
        description: 'If it does not save you time or make you money, I will say so rather than build it.',
        glowColor: 'shadow-[0_0_30px_rgba(168,85,247,0.3),0_0_60px_rgba(168,85,247,0.1)]',
    },
    {
        icon: Lightbulb,
        title: 'Plain answers',
        description: 'Published pricing, honest scope, and "you do not need this" when that is the answer.',
        glowColor: 'shadow-[0_0_30px_rgba(255,45,146,0.3),0_0_60px_rgba(255,45,146,0.1)]',
    },
    {
        icon: Users,
        title: 'One person',
        description: 'The person you talk to is the person building it. Nothing gets handed to a junior.',
        glowColor: 'shadow-[0_0_30px_rgba(0,255,255,0.3),0_0_60px_rgba(0,255,255,0.1)]',
    },
    {
        icon: Award,
        title: 'Built it myself first',
        description: 'My own service business runs on software I wrote. I would not sell you something I would not run.',
        glowColor: 'shadow-[0_0_30px_rgba(0,136,255,0.3),0_0_60px_rgba(0,136,255,0.1)]',
    },
]

// Everything here is true and checkable. The previous version claimed a 100th
// project delivery, a team of specialists, an enterprise partnership and clients
// worldwide — none of which had happened. On a page whose only job is to make a
// stranger trust you, an invented track record is the most expensive possible
// thing to be caught in.
const milestones = [
    { year: 'The problem', title: 'Running a service business', description: 'I run Haslett Handyman. Quotes lived in my head, jobs lived in a group chat, and invoices went out when I remembered. Nothing was broken exactly — it just all depended on me being available.' },
    { year: 'The build', title: 'I wrote the software I needed', description: 'Email comes in, a ticket is created, the job gets scheduled, the invoice goes out. I can see what I am owed without asking anyone. I built it because I needed it, not because I planned to sell it.' },
    { year: 'The proof', title: 'It runs without me', description: 'The business operates on that system today. That is the entire pitch and the reason I can show you a working thing rather than a slide about one.' },
    { year: 'Now', title: 'Building it for other people', description: 'Same three problems, different trades — getting work in, running the work, getting paid. Mostly local businesses around Lansing and mid-Michigan, where I can come and see the place.' },
]

// The engineering half of the page. Every figure below is checkable — the repos
// are public and the Haslett numbers come out of the system that produced them.
// The telehealth platform is BUILT AND OWNED and has no live client; it is
// described that way here deliberately and must never be worded otherwise.
const artifacts = [
    {
        icon: Database,
        title: 'Multi-tenant clinical platform',
        summary:
            'Many separately branded clinics on one system, patient data isolated by PostgreSQL row-level security rather than by application code, and a swappable clinical-network adapter. 95 TypeScript source files, 29 test files, 36 migrations, four subdomains from one deployment.',
        note: 'Designed and built solo. I own it; it has no live client.',
        href: 'https://github.com/jaklabs/telehealth-platform-reference',
        linkLabel: 'Architecture reference',
        glowColor: 'shadow-[0_0_30px_rgba(168,85,247,0.25)]',
    },
    {
        icon: ShieldCheck,
        title: 'A public endpoint that fetches arbitrary URLs',
        summary:
            'The free website audit on this site runs headless Chromium in Lambda against any address a stranger types in. That is an SSRF liability unless the boundary is real: link-local metadata, private ranges, credentials in the URL and non-HTTP schemes are all refused. 14 attack vectors, tested against the deployed endpoint.',
        note: 'Security judgement on an unauthenticated endpoint.',
        href: '/website-audit',
        linkLabel: 'Try the audit',
        glowColor: 'shadow-[0_0_30px_rgba(0,255,255,0.25)]',
    },
    {
        icon: Workflow,
        title: 'An end-to-end prospecting pipeline',
        summary:
            'Places API to enrichment to headless audit to scoring to CRM, with idempotent writes, a do-not-contact gate and the compliance rules encoded in the scorer rather than left to whoever runs it. It is how I find my own clients, which is the point — I build tools for myself first.',
        note: 'Ranking runs in code. No model call, so the result is reproducible.',
        href: 'https://github.com/jaklabs/web-browse',
        linkLabel: 'One piece of it, public',
        glowColor: 'shadow-[0_0_30px_rgba(255,45,146,0.25)]',
    },
]

export default function AboutPage() {
    const heroRef = useRef(null)
    const scrollTextRef = useRef(null)
    const founderRef = useRef(null)
    const missionRef = useRef(null)
    const logoRef = useRef(null)
    const valuesRef = useRef(null)
    const storyRef = useRef(null)
    const engineeringRef = useRef(null)

    const heroInView = useInView(heroRef, { once: true })
    const founderInView = useInView(founderRef, { once: true, margin: '-100px' })
    const missionInView = useInView(missionRef, { once: true, margin: '-100px' })
    // logoRef is used for scroll animations via useScroll below
    const valuesInView = useInView(valuesRef, { once: true, margin: '-100px' })
    const storyInView = useInView(storyRef, { once: true, margin: '-100px' })
    const engineeringInView = useInView(engineeringRef, { once: true, margin: '-100px' })

    // Scrolling text animation
    const { scrollYProgress: textScrollProgress } = useScroll({
        target: scrollTextRef,
        offset: ['start end', 'end start'],
    })
    const achieveX = useTransform(textScrollProgress, [0, 1], [300, -300])
    const growthX = useTransform(textScrollProgress, [0, 1], [-300, 300])

    // Logo reveal scroll animation
    const { scrollYProgress } = useScroll({
        target: logoRef,
        offset: ['start end', 'center center'],
    })
    const logoScale = useTransform(scrollYProgress, [0, 1], [0.5, 1])
    const logoOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])

    return (
        <>
            {/* Hero Section */}
            <section ref={heroRef} className="relative pt-32 pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/about-hero.jpg"
                        alt="JAKLabs Office"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
                </div>

                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse " />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-pink/20 rounded-full blur-3xl animate-pulse delay-1000 " />

                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6 }}
                            className="subheading mb-4"
                        >
                            About JD Kemp
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="heading-xl mb-6"
                        >
                            I Build the Systems a Business{' '}
                            <span className="text-gradient-neon">Actually Runs On</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-white/70"
                        >
                            One engineer. I write production software for local service businesses,
                            and I embed with companies that need someone who can learn a customer&apos;s
                            world fast and ship into it.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Scrolling Text Section */}
            <section ref={scrollTextRef} className="py-24 md:py-32 overflow-hidden bg-secondary/30">
                <div className="space-y-4 md:space-y-6">
                    <motion.div style={{ x: achieveX }} className="whitespace-nowrap will-change-transform">
                        <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white/90 tracking-tight">
                            Achieve Business
                        </h2>
                    </motion.div>
                    <motion.div style={{ x: growthX }} className="whitespace-nowrap will-change-transform">
                        <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight">
                            <span className="text-gradient-neon">✦ Growth</span>
                        </h2>
                    </motion.div>
                </div>
            </section>

            {/* Founder Section */}
            <section ref={founderRef} className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={founderInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(168,85,247,0.3),0_0_100px_rgba(168,85,247,0.1)]">
                                <Image
                                    src="/images/founder-standing.jpg"
                                    alt="JD Kemp - Founder of JAKLabs"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                            </div>
                            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-neon-purple/50 rounded-2xl" />
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 border-2 border-neon-pink/50 rounded-2xl" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={founderInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <p className="subheading mb-4">Meet the Founder</p>
                            <h2 className="heading-lg mb-4">
                                JD <span className="text-gradient-neon">Kemp</span>
                            </h2>
                            <p className="text-neon-purple font-medium mb-6">
                                Engineer · Owner, Haslett Handyman
                            </p>
                            <div className="space-y-4 text-white/70">
                                <p>
                                    I build production software, and I run a home-services business that
                                    depends on it. Those are not two careers. The second is why I am any
                                    good at the first.
                                </p>
                                <p>
                                    Most people who build software for service businesses have never quoted
                                    a job, chased an invoice, or lost a customer to a booking form that did
                                    not work. I have done all three, this year, with my own money on the
                                    line. It changes what you build.
                                </p>
                                <p>
                                    I work alone on purpose. The person you talk to is the person writing
                                    the code, and nothing gets handed to a junior.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section ref={missionRef} className="section-padding">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={missionInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8 }}
                        >
                            <p className="subheading mb-4">Why I do this</p>
                            <h2 className="heading-lg mb-6">
                                Empowering Service Businesses to{' '}
                                <span className="text-gradient-neon">Reach Their Full Potential</span>
                            </h2>
                            <div className="space-y-4 text-white/70">
                                <p>
                                    Every local service business deserves software that fits how it
                                    actually works, not a platform it has to bend around. Most of them are
                                    running on spreadsheets and memory because the alternative was priced
                                    for someone bigger.
                                </p>
                                <p>
                                    That is the gap I build into. Not a website — the operational software
                                    behind it: how work comes in, how it gets scheduled, and how you get
                                    paid without chasing anyone.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={missionInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,255,255,0.2)]">
                                <Image
                                    src="/images/working-laptop.jpg"
                                    alt="Working at JAKLabs"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Logo Reveal */}
            <section ref={logoRef} className="py-32 bg-secondary/30">
                <div className="container-custom">
                    <motion.div style={{ scale: logoScale, opacity: logoOpacity }} className="max-w-md mx-auto">
                        <div className="relative aspect-square rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(168,85,247,0.4)]">
                            <Image src="/images/jaklabs-logo.png" alt="JAKLabs Logo" fill className="object-contain p-8" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Story / Timeline */}
            <section ref={storyRef} className="section-padding">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={storyInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="subheading mb-4">How this started</p>
                            <h2 className="heading-lg mb-6">
                                From My Own Business to <span className="text-gradient-neon">Yours</span>
                            </h2>
                            <div className="space-y-4 text-white/70">
                                <p>It started with my own business, not a business plan.</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={storyInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-neon-purple via-neon-pink to-transparent" />
                            <div className="space-y-8">
                                {milestones.map((milestone, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={storyInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                        className="relative pl-20"
                                    >
                                        <div className="absolute left-4 top-1 w-8 h-8 rounded-full bg-neon-purple/20 border-2 border-neon-purple flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-neon-purple" />
                                        </div>
                                        <div className="text-sm text-neon-purple font-medium mb-1">{milestone.year}</div>
                                        <div className="font-semibold mb-1">{milestone.title}</div>
                                        <div className="text-sm text-white/60">{milestone.description}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section ref={valuesRef} className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <p className="subheading mb-4">How I work</p>
                        <h2 className="heading-lg mb-6">
                            What I <span className="text-gradient-neon">Refuse to Fake</span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                            >
                                <Card className={`h-full text-center ${value.glowColor}`}>
                                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-neon-purple/10 flex items-center justify-center">
                                        <value.icon className="w-7 h-7 text-neon-purple" />
                                    </div>
                                    <h3 className="font-semibold mb-2">{value.title}</h3>
                                    <p className="text-sm text-white/60">{value.description}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Forward-deployed engineering — the second audience.
                A local owner reads this as credibility and moves on. An engineering
                lead evaluating me for an embedded contract reads it as the whole
                pitch, which is why it names the artifacts and links to the code. */}
            <section ref={engineeringRef} className="section-padding">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={engineeringInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mb-16"
                    >
                        <p className="subheading mb-4">The other half of the work</p>
                        <h2 className="heading-lg mb-6">
                            Forward-deployed{' '}
                            <span className="text-gradient-neon">engineering</span>
                        </h2>
                        <div className="space-y-4 text-white/70">
                            <p className="text-xl text-white/80">
                                I embed with a company, learn the customer&apos;s business fast, and ship
                                the production system that makes the product work in their world.
                            </p>
                            <p>
                                Every other engineer up for that work has never run a business. I have.
                                So when an AI company sells into trades, home services or clinics,{' '}
                                <span className="text-white">
                                    I do not need to learn the customer — I am the customer, and I can
                                    build.
                                </span>
                            </p>
                            <p>
                                The breadth is the job: their auth, their database, their frontend, their
                                deploy, and someone&apos;s spreadsheet. Undocumented APIs and data that
                                arrives wrong are the work, not an obstacle to it.
                            </p>
                        </div>
                    </motion.div>

                    {/* Proof, not adjectives. */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={engineeringInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
                    >
                        {[
                            { figure: '$216K', label: 'invoiced through software I wrote and operate' },
                            { figure: '3,235', label: 'transactions categorised without anyone touching them' },
                            { figure: '~140 hrs', label: 'of admin taken out of my own week' },
                            { figure: '1', label: 'engineer — start to production, including the infrastructure' },
                        ].map((stat) => (
                            <Card key={stat.figure} className="text-center">
                                <div className="text-3xl font-bold text-gradient-neon mb-2">
                                    {stat.figure}
                                </div>
                                <div className="text-sm text-white/60">{stat.label}</div>
                            </Card>
                        ))}
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {artifacts.map((artifact, index) => (
                            <motion.div
                                key={artifact.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={engineeringInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.25 + index * 0.1 }}
                            >
                                <Card className={`h-full flex flex-col ${artifact.glowColor}`}>
                                    <div className="w-12 h-12 mb-4 rounded-xl bg-neon-purple/10 flex items-center justify-center">
                                        <artifact.icon className="w-6 h-6 text-neon-purple" />
                                    </div>
                                    <h3 className="font-semibold mb-3">{artifact.title}</h3>
                                    <p className="text-sm text-white/60 mb-4 flex-grow">
                                        {artifact.summary}
                                    </p>
                                    <p className="text-xs text-white/40 mb-4 italic">{artifact.note}</p>
                                    <Link
                                        href={artifact.href}
                                        className="text-sm text-neon-purple hover:text-neon-pink transition-colors inline-flex items-center group"
                                        {...(artifact.href.startsWith('http')
                                            ? { target: '_blank', rel: 'noopener noreferrer' }
                                            : {})}
                                    >
                                        {artifact.linkLabel}
                                        <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={engineeringInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="max-w-3xl"
                    >
                        <p className="text-sm text-white/40 mb-2">What I work in</p>
                        <p className="text-white/70 mb-8">
                            TypeScript and Python · React and React Native · AWS — Lambda, DynamoDB,
                            Postgres/RDS, Cognito, SES, CloudFront · Terraform and CDK · Claude and the
                            evaluation layer that decides whether its answer is good enough to show
                            anyone.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="https://github.com/jaklabs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary group inline-flex items-center"
                            >
                                <Github className="mr-2 w-5 h-5" />
                                Read the code
                            </Link>
                            <Link href="/contact" className="btn-primary group inline-flex items-center">
                                Talk about an engagement
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="heading-lg mb-6">
                            Ready to Work <span className="text-gradient-neon">Together</span>?
                        </h2>
                        <p className="text-white/60 mb-8">
                            I will show you how I can help — or tell you honestly that you do not need me.
                        </p>
                        <Link href="/contact" className="btn-primary group">
                            Get in Touch
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
