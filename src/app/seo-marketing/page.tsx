'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Search, Brain, Bot, Shield, Eye, Award, BookOpen, TrendingUp, Activity, Code2, Sparkles, Zap, BarChart3, MessageSquare, CheckCircle2 } from 'lucide-react'

const stats = [
    { value: '60%+', label: 'Searches End in AI Overviews' },
    { value: '3x', label: 'More Visibility with GEO' },
    { value: '80%', label: 'of Users Trust AI Answers' },
    { value: '24/7', label: 'AI Agent Monitoring' },
]

const eatPillars = [
    {
        icon: Eye,
        title: 'Experience',
        focus: 'Real-world applications',
        description: 'AI favors first-hand case studies over generic text. We showcase your proven results and real client outcomes.',
        color: 'neon-purple',
    },
    {
        icon: BookOpen,
        title: 'Expertise',
        focus: 'Deep subject knowledge',
        description: 'High-quality, specialized data signals a qualified source. We position you as the definitive authority in your field.',
        color: 'neon-pink',
    },
    {
        icon: Award,
        title: 'Authoritativeness',
        focus: 'Reputable citations',
        description: 'Inbound links from industry leaders validate your brand\'s standing. We build your citation network strategically.',
        color: 'neon-cyan',
    },
    {
        icon: Shield,
        title: 'Trustworthiness',
        focus: 'Transparency & Accuracy',
        description: 'Clear sourcing ensures AI snippets cite your brand as a safe answer. We engineer trust signals into every page.',
        color: 'neon-blue',
    },
]

const funnelStages = [
    {
        stage: 'Top-of-Funnel',
        title: 'Discovery & Research',
        description: 'Providing the contextual depth AI needs to guide early research. We create comprehensive, authoritative content that AI agents surface when users begin their journey.',
        color: 'neon-purple',
        icon: Search,
    },
    {
        stage: 'Mid-Funnel',
        title: 'Evaluation & Comparison',
        description: 'Ensuring your pros, cons, and case studies are structured for AI comparison tools. Your brand stands out when AI summarizes options.',
        color: 'neon-pink',
        icon: BarChart3,
    },
    {
        stage: 'Bottom-Funnel',
        title: 'Decision & Action',
        description: 'Optimizing for transactional voice prompts and smart-assistant actions. When users are ready to buy, AI recommends you.',
        color: 'neon-cyan',
        icon: Zap,
    },
]

const aiCapabilities = [
    { step: '01', title: 'Ranking Shift Detection', description: 'Detecting anomalies in search patterns instantly. Our AI agents monitor your positions across traditional and generative search results around the clock.' },
    { step: '02', title: 'Generative Engine Optimization', description: 'Using Schema markup and rich snippets to "feed" AI engines the exact data they need. We structure your content so AI can\'t ignore it.' },
    { step: '03', title: 'Predictive Content Insights', description: 'Identifying emerging content opportunities before your competitors. Our systems analyze search trend data to find gaps you can own.' },
    { step: '04', title: 'Automated Technical SEO', description: 'Metadata refreshes, title tag updates, and technical audits run continuously. Your human team focuses on strategic creativity and authentic storytelling.' },
]

function PillarCard({ pillar, index }: { pillar: typeof eatPillars[0]; index: number }) {
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
    const colors = colorClasses[pillar.color]

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
                <pillar.icon className={`w-7 h-7 ${colors.text}`} />
            </div>
            <h3 className={`text-xl md:text-2xl font-bold mb-1 transition-colors duration-300 ${isActive ? colors.text : 'text-white'}`}>{pillar.title}</h3>
            <p className={`text-sm font-medium mb-3 ${colors.text} opacity-70`}>{pillar.focus}</p>
            <p className="text-white/60 text-sm">{pillar.description}</p>
        </motion.div>
    )
}

function CapabilityStep({ item, index, isInView }: { item: typeof aiCapabilities[0]; index: number; isInView: boolean }) {
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

export default function SEOMarketingPage() {
    const heroRef = useRef(null)
    const statsRef = useRef(null)
    const capabilitiesRef = useRef(null)
    const scrollTextRef = useRef(null)

    const heroInView = useInView(heroRef, { once: true })
    const statsInView = useInView(statsRef, { once: true, margin: '-100px' })
    const capabilitiesInView = useInView(capabilitiesRef, { once: true, margin: '-100px' })

    const { scrollYProgress } = useScroll({ target: scrollTextRef, offset: ['start end', 'end start'] })
    const text1X = useTransform(scrollYProgress, [0, 1], [-200, 200])
    const text2X = useTransform(scrollYProgress, [0, 1], [200, -200])

    return (
        <>
            {/* Hero Section */}
            <section ref={heroRef} className="relative pt-32 pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/analytics.jpg"
                        alt="SEO and Marketing in the Age of AI"
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
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-1/3 right-1/4 w-80 h-80 bg-neon-purple/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{ x: [0, 25, 0], y: [0, 25, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-neon-pink/15 rounded-full blur-3xl"
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
                            SEO & MARKETING
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
                            SEO in the Age of{' '}
                            <span className="text-gradient-neon">AI Search</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-white/70 mb-8 max-w-2xl mx-auto"
                        >
                            We have entered the era of Generative Engine Optimization (GEO), where search
                            is no longer a list of results&mdash;it is an AI-powered dialogue. We engineer your
                            digital presence to ensure your brand isn&apos;t just found; it&apos;s cited.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Link href="/contact" className="btn-primary group">
                                Get Your GEO Readiness Audit
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section ref={statsRef} className="py-16 border-b border-white/10">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={statsInView ? { opacity: 1, y: 0 } : {}}
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
                        <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-white/10">GEO &bull; AI SEARCH &bull; AUTHORITY &bull; CITATIONS &bull;</span>
                    </motion.div>
                    <motion.div style={{ x: text2X }} className="whitespace-nowrap will-change-transform">
                        <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-gradient-neon">SEO &bull; E-E-A-T &bull; VISIBILITY &bull; DOMINANCE &bull;</span>
                    </motion.div>
                </div>
            </section>

            {/* The Shift Section */}
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
                            THE PARADIGM SHIFT
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                        >
                            From Keywords to{' '}
                            <span className="text-gradient-neon">Conversational Intent</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-white/60 text-lg"
                        >
                            Search has transformed from fragmented queries into natural language conversations.
                            Users no longer type &quot;marketing agency Charlotte&quot;&mdash;they ask, &quot;Which marketing
                            agency in Charlotte specializes in AI automation for service businesses?&quot;
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="p-8 rounded-2xl border border-white/10 bg-secondary/50 backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                    <Search className="w-5 h-5 text-white/40" />
                                </div>
                                <span className="text-sm font-mono text-white/40">THE OLD WAY</span>
                            </div>
                            <p className="text-white/40 text-lg font-medium mb-2">&quot;marketing agency Charlotte&quot;</p>
                            <p className="text-white/30 text-sm">Keyword-stuffed pages competing for blue links.</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="p-8 rounded-2xl border border-neon-purple/30 bg-secondary/50 backdrop-blur-sm shadow-[0_0_40px_rgba(191,90,242,0.1)]"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-neon-purple/10 flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-neon-purple" />
                                </div>
                                <span className="text-sm font-mono text-neon-purple">THE NEW WAY</span>
                            </div>
                            <p className="text-white text-lg font-medium mb-2">&quot;Which marketing agency in Charlotte specializes in AI automation?&quot;</p>
                            <p className="text-white/60 text-sm">Conversational queries answered by AI with cited sources.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* AI Customer Journey / Funnel Section */}
            <section className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="subheading mb-4"
                        >
                            THE NEW CUSTOMER JOURNEY
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="heading-lg mb-4"
                        >
                            Navigating{' '}
                            <span className="text-gradient-neon">AI Overviews</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-white/60 max-w-3xl mx-auto"
                        >
                            AI Overviews now curate answers directly at the top of the page. To win, your brand
                            must be visible within these AI-generated summaries at every funnel stage.
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {funnelStages.map((stage, index) => {
                            const colorClasses: Record<string, { border: string; glow: string; text: string; iconBg: string }> = {
                                'neon-purple': { border: 'hover:border-neon-purple/40', glow: 'hover:shadow-[0_0_40px_rgba(191,90,242,0.15)]', text: 'text-neon-purple', iconBg: 'bg-neon-purple/10' },
                                'neon-pink': { border: 'hover:border-neon-pink/40', glow: 'hover:shadow-[0_0_40px_rgba(255,45,146,0.15)]', text: 'text-neon-pink', iconBg: 'bg-neon-pink/10' },
                                'neon-cyan': { border: 'hover:border-neon-cyan/40', glow: 'hover:shadow-[0_0_40px_rgba(0,255,255,0.15)]', text: 'text-neon-cyan', iconBg: 'bg-neon-cyan/10' },
                            }
                            const colors = colorClasses[stage.color]
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.15 }}
                                    className={`p-8 rounded-2xl border border-white/10 bg-background/50 backdrop-blur-sm ${colors.border} ${colors.glow} transition-all duration-500`}
                                >
                                    <div className={`w-14 h-14 rounded-xl ${colors.iconBg} flex items-center justify-center mb-5`}>
                                        <stage.icon className={`w-7 h-7 ${colors.text}`} />
                                    </div>
                                    <span className={`text-xs font-mono ${colors.text} uppercase tracking-wider`}>{stage.stage}</span>
                                    <h3 className="text-xl md:text-2xl font-bold mt-2 mb-3">{stage.title}</h3>
                                    <p className="text-white/60 text-sm">{stage.description}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* E-E-A-T Framework Section */}
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
                            WHAT ENDURES
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="heading-lg mb-4"
                        >
                            The Human{' '}
                            <span className="text-gradient-neon">E-E-A-T</span>{' '}
                            Framework
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-white/60 max-w-3xl mx-auto"
                        >
                            While the delivery has changed, the foundation of authority has not. Google and AI agents
                            prioritize content that follows the E-E-A-T framework. We build your strategy on these four pillars.
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {eatPillars.map((pillar, index) => (
                            <PillarCard key={index} pillar={pillar} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Agents Section */}
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
                                THE FUTURE OF SEO
                            </motion.p>
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="heading-lg mb-6"
                            >
                                SEO Driven by{' '}
                                <span className="text-gradient-neon">AI Agents</span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-white/60 mb-8"
                            >
                                At JAK Labs, we leverage AI Agents to transform SEO from a monthly audit into
                                a real-time, self-optimizing system. Instead of manual maintenance, our systems
                                monitor and adapt continuously.
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
                                    <Activity className="w-6 h-6 text-neon-purple" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Real-Time Monitoring</h3>
                                    <p className="text-white/60 text-sm">Detecting ranking anomalies and search pattern shifts the moment they happen.</p>
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
                                    <Code2 className="w-6 h-6 text-neon-pink" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Schema &amp; Structured Data</h3>
                                    <p className="text-white/60 text-sm">Feeding AI engines the exact data they need with rich snippets and structured markup.</p>
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
                                    <Sparkles className="w-6 h-6 text-neon-cyan" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Predictive Intelligence</h3>
                                    <p className="text-white/60 text-sm">Identifying emerging content opportunities before your competitors even notice them.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dual Approach Section */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="subheading mb-4">THE DUAL APPROACH</p>
                            <h2 className="heading-lg mb-6">
                                Balance Automation with{' '}
                                <span className="text-gradient-neon">Authenticity</span>
                            </h2>
                            <p className="text-white/60 mb-6">
                                The future of marketing belongs to those who master the &quot;Dual Approach.&quot;
                                We use intelligent automation to scale your reach, while maintaining the human
                                nuance and brand-specific voice that creates an emotional connection with your audience.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-white/70">
                                    <CheckCircle2 className="w-5 h-5 text-neon-purple flex-shrink-0" />
                                    <span>AI-powered scale meets human strategic creativity</span>
                                </li>
                                <li className="flex items-center gap-3 text-white/70">
                                    <CheckCircle2 className="w-5 h-5 text-neon-pink flex-shrink-0" />
                                    <span>Automated technical drudgery, authentic storytelling</span>
                                </li>
                                <li className="flex items-center gap-3 text-white/70">
                                    <CheckCircle2 className="w-5 h-5 text-neon-cyan flex-shrink-0" />
                                    <span>Brand voice preserved at every AI touchpoint</span>
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative overflow-hidden rounded-2xl h-[400px] md:h-[500px] shadow-[0_0_60px_rgba(168,85,247,0.2)]"
                        >
                            <Image src="/images/strategy.jpg" alt="Balancing automation with authenticity" fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* AI Capabilities Timeline */}
            <section ref={capabilitiesRef} className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={capabilitiesInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="subheading mb-4">OUR AI-POWERED SYSTEM</p>
                            <h2 className="heading-lg mb-6">
                                How Our{' '}
                                <span className="text-gradient-neon">AI Agents</span>{' '}
                                Work for You
                            </h2>
                            <p className="text-white/60 mb-8">
                                By automating technical drudgery like metadata refreshes and title tag updates,
                                our human team focuses on what AI cannot replicate: strategic creativity and
                                authentic storytelling.
                            </p>
                            <Link href="/contact" className="btn-secondary group">
                                Schedule a GEO Audit
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        <div className="relative">
                            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-neon-purple via-neon-pink to-transparent" />
                            <div className="space-y-10">
                                {aiCapabilities.map((item, index) => (
                                    <CapabilityStep key={index} item={item} index={index} isInView={capabilitiesInView} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Photo Cards */}
            <section className="section-padding">
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
                                <Image src="/images/analytics.jpg" alt="AI-powered search analytics" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wider">OPTIMIZE</h3>
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
                                <Image src="/images/working-laptop.jpg" alt="Strategic content creation" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wider">DOMINATE</h3>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* GEO Readiness Audit Box */}
            <section className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="p-8 md:p-12 rounded-2xl bg-gradient-to-r from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10 border border-white/10"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <Brain className="w-8 h-8 text-neon-cyan flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                                    The <span className="text-gradient-neon">GEO Readiness Audit</span>
                                </h3>
                                <p className="text-white/70 mb-4">
                                    Is your current site visible to AI agents? Our free GEO Readiness Audit analyzes
                                    your digital presence across AI search engines, checking your Schema markup,
                                    E-E-A-T signals, content structure, and citation potential.
                                </p>
                                <p className="text-white/50 text-sm">
                                    Get a clear scorecard showing exactly where you stand in the AI search
                                    landscape&mdash;and a roadmap for how to get ahead.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="subheading mb-4">READY TO DOMINATE AI SEARCH?</p>
                            <h2 className="heading-lg mb-6">
                                Let&apos;s Build a{' '}
                                <span className="text-gradient-neon">Scalable SEO Ecosystem</span>
                            </h2>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-white/60 text-lg mb-8"
                        >
                            A precise, scalable SEO ecosystem that reflects your brand&apos;s unique objectives.
                            From GEO audits to full AI-search strategy&mdash;let&apos;s make your brand the answer.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link href="/contact" className="btn-primary group">
                                Get Your Free GEO Audit
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
