'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BarChart3, Target, Megaphone, TrendingUp, Search, Mail, Smartphone, Globe, CheckCircle2, Zap, Crosshair, Users, Lightbulb, FlaskConical, LineChart, Bot, Layers, Inbox } from 'lucide-react'

const strategies = [
    {
        icon: Target,
        title: 'Market Research & Positioning',
        description: 'We analyze your market, competitors, and ideal customers to craft a positioning strategy that sets you apart.',
        color: 'neon-purple',
        details: ['Competitor Analysis', 'Customer Persona Development', 'Market Gap Identification', 'Brand Positioning Framework'],
    },
    {
        icon: Megaphone,
        title: 'Paid Advertising Strategy',
        description: 'Data-driven ad campaigns across Google, Meta, and other platforms designed to maximize your ROI.',
        color: 'neon-pink',
        details: ['Google Ads Strategy', 'Meta (Facebook/Instagram) Ads', 'Retargeting Campaigns', 'Budget Optimization'],
    },
    {
        icon: Search,
        title: 'SEO & Content Strategy',
        description: 'Dominate search results with a comprehensive SEO strategy paired with high-value content creation.',
        color: 'neon-cyan',
        details: ['Technical SEO Audit', 'Keyword Strategy', 'Content Calendar', 'Local SEO Optimization'],
    },
    {
        icon: Mail,
        title: 'Email & Automation',
        description: 'Nurture leads and retain customers with automated email sequences that convert.',
        color: 'neon-blue',
        details: ['Welcome Sequences', 'Drip Campaigns', 'Re-engagement Flows', 'Performance Analytics'],
    },
    {
        icon: Smartphone,
        title: 'Social Media Strategy',
        description: 'Build a loyal following and generate leads through strategic social media presence.',
        color: 'neon-purple',
        details: ['Platform Selection', 'Content Strategy', 'Community Building', 'Influencer Partnerships'],
    },
    {
        icon: Globe,
        title: 'Conversion Optimization',
        description: 'Turn more visitors into customers by optimizing every touchpoint of your digital experience.',
        color: 'neon-pink',
        details: ['Landing Page Optimization', 'A/B Testing', 'Funnel Analysis', 'User Experience Audit'],
    },
]

const process = [
    { step: '01', title: 'Discovery', description: 'We start with a deep-dive session to understand your business, goals, target market, and current marketing efforts.' },
    { step: '02', title: 'Research & Analysis', description: 'Our team conducts thorough market research, competitor analysis, and audits your existing digital presence.' },
    { step: '03', title: 'Strategy Development', description: 'We craft a custom marketing strategy tailored to your business with clear KPIs and a roadmap for execution.' },
    { step: '04', title: 'Execution & Optimization', description: 'We implement the strategy, continuously monitor performance, and optimize based on real-time data.' },
]

const results = [
    { value: '3x', label: 'Average Lead Increase' },
    { value: '47%', label: 'Lower Cost Per Acquisition' },
    { value: '200%+', label: 'Average ROI' },
    { value: '90%', label: 'Client Retention Rate' },
]

function StrategyCard({ strategy, index }: { strategy: typeof strategies[0]; index: number }) {
    const cardRef = useRef(null)
    const isInView = useInView(cardRef, { once: false, margin: '-20% 0px -20% 0px' })
    const [isHovered, setIsHovered] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => { const check = () => setIsMobile(window.innerWidth < 768); check(); window.addEventListener('resize', check); return () => window.removeEventListener('resize', check) }, [])
    const isActive = isMobile ? isInView : isHovered

    const colorClasses: Record<string, { border: string; glow: string; text: string; bg: string; iconBg: string }> = {
        'neon-purple': { border: 'border-neon-purple/50', glow: 'shadow-[0_0_40px_rgba(191,90,242,0.2)]', text: 'text-neon-purple', bg: 'bg-neon-purple', iconBg: 'bg-neon-purple/10' },
        'neon-pink': { border: 'border-neon-pink/50', glow: 'shadow-[0_0_40px_rgba(255,45,146,0.2)]', text: 'text-neon-pink', bg: 'bg-neon-pink', iconBg: 'bg-neon-pink/10' },
        'neon-cyan': { border: 'border-neon-cyan/50', glow: 'shadow-[0_0_40px_rgba(0,255,255,0.2)]', text: 'text-neon-cyan', bg: 'bg-neon-cyan', iconBg: 'bg-neon-cyan/10' },
        'neon-blue': { border: 'border-neon-blue/50', glow: 'shadow-[0_0_40px_rgba(0,136,255,0.2)]', text: 'text-neon-blue', bg: 'bg-neon-blue', iconBg: 'bg-neon-blue/10' },
    }
    const colors = colorClasses[strategy.color]

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative rounded-2xl border p-6 md:p-8 transition-all duration-500 bg-secondary/50 backdrop-blur-sm ${isActive ? `${colors.border} ${colors.glow} scale-[1.02]` : 'border-white/10'}`}
        >
            <div className={`w-14 h-14 rounded-xl ${colors.iconBg} flex items-center justify-center mb-5 transition-all duration-300 ${isActive ? colors.glow : ''}`}>
                <strategy.icon className={`w-7 h-7 ${colors.text}`} />
            </div>
            <h3 className={`text-xl md:text-2xl font-bold mb-3 transition-colors duration-300 ${isActive ? colors.text : 'text-white'}`}>{strategy.title}</h3>
            <p className="text-white/60 text-sm mb-5">{strategy.description}</p>
            <ul className="space-y-2">
                {strategy.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-white/70">
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${colors.text}`} />
                        {detail}
                    </li>
                ))}
            </ul>
        </motion.div>
    )
}

function ProcessStep({ item, index, isInView }: { item: typeof process[0]; index: number; isInView: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="relative pl-20"
        >
            <div className="absolute left-4 top-1 w-10 h-10 rounded-full bg-neon-purple/20 border-2 border-neon-purple flex items-center justify-center">
                <span className="text-sm font-bold text-neon-purple">{item.step}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2">{item.title}</h3>
            <p className="text-white/60 text-sm">{item.description}</p>
        </motion.div>
    )
}

export default function MarketingStrategyPage() {
    const heroRef = useRef(null)
    const resultsRef = useRef(null)
    const processRef = useRef(null)
    const scrollTextRef = useRef(null)

    const heroInView = useInView(heroRef, { once: true })
    const resultsInView = useInView(resultsRef, { once: true, margin: '-100px' })
    const processInView = useInView(processRef, { once: true, margin: '-100px' })

    const { scrollYProgress } = useScroll({ target: scrollTextRef, offset: ['start end', 'end start'] })
    const text1X = useTransform(scrollYProgress, [0, 1], [-200, 200])
    const text2X = useTransform(scrollYProgress, [0, 1], [200, -200])

    return (
        <>
            {/* Hero Section */}
            <section ref={heroRef} className="relative pt-32 pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/strategy.jpg"
                        alt="Marketing Strategy"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
                </div>

                {/* Floating neon orbs */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-1/3 right-1/4 w-80 h-80 bg-neon-pink/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{ x: [0, 25, 0], y: [0, 25, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-neon-cyan/15 rounded-full blur-3xl"
                    />
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6 }}
                            className="subheading mb-4"
                        >
                            MARKETING STRATEGY
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={heroInView ? {
                                opacity: 1,
                                y: 0,
                                textShadow: [
                                    '0 0 20px rgba(168,85,247,0.5), 0 0 40px rgba(168,85,247,0.3), 0 0 60px rgba(168,85,247,0.2)',
                                    '0 0 40px rgba(168,85,247,0.8), 0 0 80px rgba(168,85,247,0.5), 0 0 120px rgba(168,85,247,0.3)',
                                    '0 0 20px rgba(168,85,247,0.5), 0 0 40px rgba(168,85,247,0.3), 0 0 60px rgba(168,85,247,0.2)',
                                ]
                            } : {}}
                            transition={{
                                duration: 0.6,
                                delay: 0.1,
                                textShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                            }}
                            className="heading-xl mb-6"
                        >
                            Strategies That{' '}
                            <span className="text-gradient-neon">Drive Growth</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-white/70 mb-8 max-w-2xl mx-auto"
                        >
                            We don&apos;t believe in cookie-cutter marketing. Every strategy we build is custom-engineered
                            to your business, your market, and your growth goals.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Link href="/contact" className="btn-primary group">
                                Book a Strategy Session
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Results Stats */}
            <section ref={resultsRef} className="py-16 border-b border-white/10">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {results.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={resultsInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-4xl md:text-5xl font-bold text-gradient-neon mb-2">{stat.value}</div>
                                <div className="text-xs md:text-sm text-white/50 tracking-wider uppercase">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scrolling Text */}
            <section ref={scrollTextRef} className="py-16 md:py-24 overflow-hidden bg-secondary/30">
                <div className="space-y-4">
                    <motion.div style={{ x: text1X }} className="whitespace-nowrap will-change-transform">
                        <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-white/10">STRATEGY • GROWTH • RESULTS • DOMINATION •</span>
                    </motion.div>
                    <motion.div style={{ x: text2X }} className="whitespace-nowrap will-change-transform">
                        <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-gradient-neon">MARKETING • LEADS • REVENUE • SUCCESS •</span>
                    </motion.div>
                </div>
            </section>

            {/* Strategic Blueprint Section */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="subheading mb-4"
                        >
                            THE STRATEGIC BLUEPRINT
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                        >
                            Engineering{' '}
                            <span className="text-gradient-neon">Market Dominance</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-white/60 text-lg"
                        >
                            At JAK Labs, we believe that high-growth marketing isn&apos;t an accident—it&apos;s a documented,
                            tactical science. Moving beyond simple guesswork, a robust marketing strategy aligns your
                            overarching business goals with data-driven execution to maximize your Return on Investment (ROI).
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Why Strategy Section */}
            <section className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="subheading mb-4">WHY STRATEGY MATTERS</p>
                            <h2 className="heading-lg mb-6">
                                Your Greatest{' '}
                                <span className="text-gradient-neon">Competitive Edge</span>
                            </h2>
                            <p className="text-white/60 mb-8">
                                A marketing strategy serves as your professional playbook, designed to amplify your
                                &quot;share of voice&quot; and convert leads into revenue. Without this roadmap, businesses
                                risk targeting irrelevant audiences and wasting resources on features that don&apos;t resonate.
                            </p>
                        </motion.div>

                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="flex items-start gap-4 p-6 rounded-xl border border-white/10 bg-background/50 hover:border-neon-purple/30 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-lg bg-neon-purple/10 flex items-center justify-center flex-shrink-0">
                                    <Users className="w-6 h-6 text-neon-purple" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Deep Market Insight</h3>
                                    <p className="text-white/60 text-sm">Truly understand the psychographics of your ideal client.</p>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.15 }}
                                className="flex items-start gap-4 p-6 rounded-xl border border-white/10 bg-background/50 hover:border-neon-pink/30 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-lg bg-neon-pink/10 flex items-center justify-center flex-shrink-0">
                                    <Lightbulb className="w-6 h-6 text-neon-pink" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Defined Value Proposition</h3>
                                    <p className="text-white/60 text-sm">Articulate exactly why you are the #1 choice.</p>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="flex items-start gap-4 p-6 rounded-xl border border-white/10 bg-background/50 hover:border-neon-cyan/30 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-lg bg-neon-cyan/10 flex items-center justify-center flex-shrink-0">
                                    <Crosshair className="w-6 h-6 text-neon-cyan" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Precision Positioning</h3>
                                    <p className="text-white/60 text-sm">Outmaneuver competitors by owning a specific niche.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4-Phase Execution Framework */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="subheading mb-4"
                        >
                            OUR METHODOLOGY
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="heading-lg mb-4"
                        >
                            The JAK Labs <span className="text-gradient-neon">4-Phase</span> Execution Framework
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-white/60 max-w-3xl mx-auto"
                        >
                            We distinguish between Strategy (the high-level &quot;Why&quot;) and Planning (the tactical
                            &quot;How&quot;). Our approach follows a rigorous order of operations.
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative p-8 rounded-2xl border border-white/10 bg-secondary/50 backdrop-blur-sm hover:border-neon-purple/40 hover:shadow-[0_0_40px_rgba(191,90,242,0.1)] transition-all duration-500"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-xl bg-neon-purple/10 flex items-center justify-center">
                                    <FlaskConical className="w-7 h-7 text-neon-purple" />
                                </div>
                                <div>
                                    <span className="text-sm font-mono text-neon-purple">PHASE 01</span>
                                    <h3 className="text-xl md:text-2xl font-bold">Research &amp; Archetyping</h3>
                                </div>
                            </div>
                            <p className="text-white/60 text-sm leading-relaxed">We begin by defining SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound). We then conduct primary and secondary research to build detailed Buyer Personas, ensuring your messaging hits the pain points of your ideal customer.</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="relative p-8 rounded-2xl border border-white/10 bg-secondary/50 backdrop-blur-sm hover:border-neon-pink/40 hover:shadow-[0_0_40px_rgba(255,45,146,0.1)] transition-all duration-500"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-xl bg-neon-pink/10 flex items-center justify-center">
                                    <Target className="w-7 h-7 text-neon-pink" />
                                </div>
                                <div>
                                    <span className="text-sm font-mono text-neon-pink">PHASE 02</span>
                                    <h3 className="text-xl md:text-2xl font-bold">Positioning &amp; Unique Value (UVP)</h3>
                                </div>
                            </div>
                            <p className="text-white/60 text-sm leading-relaxed">We identify your Unique Value Proposition—the &quot;secret sauce&quot; that makes you better than the competition. We then map this across a messaging matrix to ensure consistency across every digital touchpoint.</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative p-8 rounded-2xl border border-white/10 bg-secondary/50 backdrop-blur-sm hover:border-neon-cyan/40 hover:shadow-[0_0_40px_rgba(0,255,255,0.1)] transition-all duration-500"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-xl bg-neon-cyan/10 flex items-center justify-center">
                                    <LineChart className="w-7 h-7 text-neon-cyan" />
                                </div>
                                <div>
                                    <span className="text-sm font-mono text-neon-cyan">PHASE 03</span>
                                    <h3 className="text-xl md:text-2xl font-bold">Channel Optimization &amp; Budgeting</h3>
                                </div>
                            </div>
                            <p className="text-white/60 text-sm leading-relaxed">Based on your audience&apos;s behavior, we select the high-ROI channels—be it Meta Ads, SEO, or Email Marketing. We allocate your budget strategically, prioritizing tactics that offer the fastest path to growth.</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="relative p-8 rounded-2xl border border-white/10 bg-secondary/50 backdrop-blur-sm hover:border-neon-blue/40 hover:shadow-[0_0_40px_rgba(0,136,255,0.1)] transition-all duration-500"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-xl bg-neon-blue/10 flex items-center justify-center">
                                    <TrendingUp className="w-7 h-7 text-neon-blue" />
                                </div>
                                <div>
                                    <span className="text-sm font-mono text-neon-blue">PHASE 04</span>
                                    <h3 className="text-xl md:text-2xl font-bold">Measurement &amp; Agile Adaptation</h3>
                                </div>
                            </div>
                            <p className="text-white/60 text-sm leading-relaxed">Marketing is a living system. We establish Key Performance Indicators (KPIs) and use advanced analytics to monitor traffic, conversion rates, and acquisition costs. We remain agile, refining the strategy based on real-time data.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* AI Advantage Section */}
            <section className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="subheading mb-4"
                            >
                                THE AI ADVANTAGE
                            </motion.p>
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="heading-lg mb-6"
                            >
                                <span className="text-gradient-neon">Hyper-Personalization</span>{' '}
                                at Scale
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-white/60 mb-8"
                            >
                                In 2026, the &quot;Lab&quot; approach means leveraging Artificial Intelligence to gain an
                                unfair advantage. We integrate AI to deliver:
                            </motion.p>
                        </div>

                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="flex items-start gap-4 p-6 rounded-xl border border-white/10 bg-background/50 hover:border-neon-purple/30 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-lg bg-neon-purple/10 flex items-center justify-center flex-shrink-0">
                                    <LineChart className="w-6 h-6 text-neon-purple" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Predictive Analytics</h3>
                                    <p className="text-white/60 text-sm">Forecasting market trends and ROI before you spend.</p>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.15 }}
                                className="flex items-start gap-4 p-6 rounded-xl border border-white/10 bg-background/50 hover:border-neon-pink/30 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-lg bg-neon-pink/10 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-6 h-6 text-neon-pink" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Hyper-Personalization</h3>
                                    <p className="text-white/60 text-sm">Tailoring the customer journey at scale.</p>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="flex items-start gap-4 p-6 rounded-xl border border-white/10 bg-background/50 hover:border-neon-cyan/30 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-lg bg-neon-cyan/10 flex items-center justify-center flex-shrink-0">
                                    <Zap className="w-6 h-6 text-neon-cyan" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Automated Optimization</h3>
                                    <p className="text-white/60 text-sm">Running A/B tests and campaign adjustments at lightning speed.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Strategic Options Section */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="subheading mb-4"
                        >
                            STRATEGIC OPTIONS
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="heading-lg mb-4"
                        >
                            Options for Your{' '}
                            <span className="text-gradient-neon">Growth</span>
                        </motion.h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center p-8 rounded-2xl border border-white/10 bg-secondary/50 backdrop-blur-sm hover:border-neon-purple/40 hover:shadow-[0_0_40px_rgba(191,90,242,0.15)] transition-all duration-500"
                        >
                            <div className="w-16 h-16 rounded-xl bg-neon-purple/10 flex items-center justify-center mx-auto mb-5">
                                <Layers className="w-8 h-8 text-neon-purple" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Inbound Marketing</h3>
                            <p className="text-white/60 text-sm">Engineering a magnet for high-value leads.</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="text-center p-8 rounded-2xl border border-white/10 bg-secondary/50 backdrop-blur-sm hover:border-neon-pink/40 hover:shadow-[0_0_40px_rgba(255,45,146,0.15)] transition-all duration-500"
                        >
                            <div className="w-16 h-16 rounded-xl bg-neon-pink/10 flex items-center justify-center mx-auto mb-5">
                                <Globe className="w-8 h-8 text-neon-pink" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Content &amp; Social Systems</h3>
                            <p className="text-white/60 text-sm">Building authority through value-driven media.</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-center p-8 rounded-2xl border border-white/10 bg-secondary/50 backdrop-blur-sm hover:border-neon-cyan/40 hover:shadow-[0_0_40px_rgba(0,255,255,0.15)] transition-all duration-500"
                        >
                            <div className="w-16 h-16 rounded-xl bg-neon-cyan/10 flex items-center justify-center mx-auto mb-5">
                                <Inbox className="w-8 h-8 text-neon-cyan" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Email &amp; SMS Automation</h3>
                            <p className="text-white/60 text-sm">Nurturing prospects into loyal brand advocates.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* What We Build Section */}
            <section className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="text-center lg:text-left">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="subheading mb-4"
                            >
                                CUSTOM STRATEGIES
                            </motion.p>
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                            >
                                Marketing Built for{' '}
                                <span className="text-gradient-neon">Your Business</span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-white/60 text-lg mb-8"
                            >
                                Most agencies use templates. We use data. Every strategy is built from the ground up
                                using real market research, competitor intelligence, and your unique business goals.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex justify-center lg:justify-start"
                            >
                                <Link href="/contact" className="btn-primary group">
                                    Get Your Custom Strategy
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative overflow-hidden rounded-2xl h-[400px] md:h-[500px] shadow-[0_0_60px_rgba(168,85,247,0.2)]"
                        >
                            <Image src="/images/analytics.jpg" alt="Marketing analytics and strategy" fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Strategy Cards */}
            <section className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <p className="subheading mb-4">WHAT WE OFFER</p>
                        <h2 className="heading-lg mb-4">Our Strategic <span className="text-gradient-neon">Services</span></h2>
                        <p className="text-white/60 max-w-2xl mx-auto">
                            A comprehensive suite of marketing strategy services designed to help your business
                            attract, convert, and retain customers.
                        </p>
                    </motion.div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {strategies.map((strategy, index) => (
                            <StrategyCard key={index} strategy={strategy} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Timeline */}
            <section ref={processRef} className="section-padding">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={processInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="subheading mb-4">OUR PROCESS</p>
                            <h2 className="heading-lg mb-6">
                                How We Build Your{' '}
                                <span className="text-gradient-neon">Growth Engine</span>
                            </h2>
                            <p className="text-white/60 mb-8">
                                Our proven four-step process ensures every strategy is grounded in data,
                                aligned with your goals, and built to scale.
                            </p>
                            <Link href="/contact" className="btn-secondary group">
                                Start the Process
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        <div className="relative">
                            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-neon-purple via-neon-pink to-transparent" />
                            <div className="space-y-10">
                                {process.map((item, index) => (
                                    <ProcessStep key={index} item={item} index={index} isInView={processInView} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Strategy Photo Cards */}
            <section className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 gap-4 md:gap-8 mb-16">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative overflow-hidden rounded-2xl"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <Image src="/images/strategy.jpg" alt="Strategy planning" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wider">PLAN</h3>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative overflow-hidden rounded-2xl"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <Image src="/images/analytics.jpg" alt="Analytics and execution" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wider">EXECUTE</h3>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Consultation Note */}
            <section className="section-padding">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="p-8 md:p-12 rounded-2xl bg-gradient-to-r from-neon-purple/10 via-neon-pink/10 to-neon-cyan/10 border border-white/10"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <BarChart3 className="w-8 h-8 text-neon-purple flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                                    The <span className="text-gradient-neon">Consultation First</span> Approach
                                </h3>
                                <p className="text-white/70 mb-4">
                                    We never start with a sales pitch. Every engagement begins with a free
                                    Technical Discovery Session where we audit your current marketing,
                                    identify opportunities, and outline a clear path to growth.
                                </p>
                                <p className="text-white/50 text-sm">
                                    No contracts. No commitments. Just a clear roadmap for how we can help
                                    your business dominate its market.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="subheading mb-4">READY TO GROW?</p>
                            <h2 className="heading-lg mb-6">
                                Let&apos;s Build Your{' '}
                                <span className="text-gradient-neon">Marketing Strategy</span>
                            </h2>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-white/60 text-lg mb-8"
                        >
                            Book a free discovery session and get a custom marketing roadmap for your business.
                            No strings attached.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link href="/contact" className="btn-primary group">
                                Book Discovery Session
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/services" className="btn-secondary group">
                                View All Services
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    )
}
