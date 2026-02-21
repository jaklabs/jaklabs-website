'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Fingerprint, Heart, MessageSquare, Palette, BookOpen, Users, Target, Megaphone, Eye, Cpu, BarChart3, CheckCircle2, Compass, Shield, Mic2, Layers, PenTool } from 'lucide-react'

const brandElements = [
    {
        icon: Compass,
        title: 'Core Purpose',
        description: 'We define your "Why." We align your mission with your customers\u2019 deepest aspirations to solve their specific pain points.',
        color: 'neon-purple',
        details: ['Mission Alignment', 'Customer Aspiration Mapping', 'Pain Point Resolution', 'Purpose-Driven Positioning'],
    },
    {
        icon: Shield,
        title: 'Brand Values',
        description: 'We establish the ethical and professional guardrails that guide your business behavior and build consumer trust.',
        color: 'neon-pink',
        details: ['Ethical Framework', 'Professional Standards', 'Trust Architecture', 'Value-Driven Culture'],
    },
    {
        icon: Mic2,
        title: 'Voice & Tone',
        description: 'We engineer a consistent personality for your brand\u2014ensuring you sound authoritative in whitepapers and engaging on social media.',
        color: 'neon-cyan',
        details: ['Brand Personality Design', 'Tone Guidelines', 'Cross-Channel Consistency', 'Content Voice Matrix'],
    },
    {
        icon: Layers,
        title: 'Visual Architecture',
        description: 'Using custom typography, strategic color palettes, and iconic logos, we create a cohesive visual identity that is instantly recognizable.',
        color: 'neon-blue',
        details: ['Custom Typography', 'Strategic Color Palettes', 'Logo & Icon Systems', 'Brand Style Guide'],
    },
    {
        icon: BookOpen,
        title: 'The Narrative (Brand Story)',
        description: 'We craft a compelling narrative that establishes an emotional connection, making your brand memorable and unique.',
        color: 'neon-purple',
        details: ['Origin Story Crafting', 'Emotional Connection', 'Narrative Framework', 'Story-Driven Marketing'],
    },
]

const roadmap = [
    { step: '01', title: 'Audience Intelligence', description: 'We begin with deep market research to identify your ideal user personas. By understanding your audience\u2019s income, pain points, and digital habits, we ensure your brand architecture is built specifically for the people most likely to convert.' },
    { step: '02', title: 'Market Positioning', description: 'Don\u2019t be a statistic. With most consumers admitting they wouldn\u2019t care if 77% of brands disappeared, we focus on Unique Market Positioning. We distill your brand\u2019s essence into a single, powerful statement that highlights your distinct value.' },
    { step: '03', title: 'Resonant Messaging', description: 'We develop a messaging matrix that reflects your values. Since 77% of customers prefer buying from brands that share their beliefs, we ensure your mission statement creates an emotional bridge to your audience.' },
    { step: '04', title: 'Cohesive Visual Design', description: 'Your aesthetic is your silent ambassador. We develop a comprehensive Brand Style Guide that ensures your website, social profiles, and marketing materials maintain a high-end, professional look across the board.' },
    { step: '05', title: 'Technological Integration', description: 'We leverage the latest technology to broadcast your brand. From SEO-optimized web architecture to AI-driven social media engagement, we ensure your brand identity is amplified through the most effective digital channels.' },
    { step: '06', title: 'Continuous Optimization', description: 'A brand is a living organism. We establish KPIs and regularly analyze engagement data to refine your strategy. By monitoring competitor shifts and emerging design trends, we keep your brand ahead of the curve and perpetually relevant.' },
]

const stats = [
    { value: '80%', label: 'Trust Before Purchase' },
    { value: '7s', label: 'To Capture Attention' },
    { value: '77%', label: 'Of Brands Are Forgettable' },
    { value: '3.5x', label: 'Revenue With Strong Brand' },
]

function ElementCard({ element, index }: { element: typeof brandElements[0]; index: number }) {
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
    const colors = colorClasses[element.color]

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
                <element.icon className={`w-7 h-7 ${colors.text}`} />
            </div>
            <h3 className={`text-xl md:text-2xl font-bold mb-3 transition-colors duration-300 ${isActive ? colors.text : 'text-white'}`}>{element.title}</h3>
            <p className="text-white/60 text-sm mb-5">{element.description}</p>
            <ul className="space-y-2">
                {element.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-white/70">
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${colors.text}`} />
                        {detail}
                    </li>
                ))}
            </ul>
        </motion.div>
    )
}

function RoadmapStep({ item, index, isInView }: { item: typeof roadmap[0]; index: number; isInView: boolean }) {
    const colors = ['text-neon-purple', 'text-neon-pink', 'text-neon-cyan', 'text-neon-blue']
    const bgColors = ['bg-neon-purple/20', 'bg-neon-pink/20', 'bg-neon-cyan/20', 'bg-neon-blue/20']
    const borderColors = ['border-neon-purple', 'border-neon-pink', 'border-neon-cyan', 'border-neon-blue']
    const colorIndex = index % 4

    return (
        <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative pl-20"
        >
            <div className={`absolute left-4 top-1 w-10 h-10 rounded-full ${bgColors[colorIndex]} border-2 ${borderColors[colorIndex]} flex items-center justify-center`}>
                <span className={`text-sm font-bold ${colors[colorIndex]}`}>{item.step}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2">{item.title}</h3>
            <p className="text-white/60 text-sm">{item.description}</p>
        </motion.div>
    )
}

export default function BrandStrategyPage() {
    const heroRef = useRef(null)
    const statsRef = useRef(null)
    const roadmapRef = useRef(null)
    const scrollTextRef = useRef(null)

    const heroInView = useInView(heroRef, { once: true })
    const statsInView = useInView(statsRef, { once: true, margin: '-100px' })
    const roadmapInView = useInView(roadmapRef, { once: true, margin: '-100px' })

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
                        alt="Brand Strategy"
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
                            BRAND STRATEGY
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
                            Engineering the{' '}
                            <span className="text-gradient-neon">7-Second First Impression</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-white/70 mb-8 max-w-2xl mx-auto"
                        >
                            In the digital landscape, your brand has exactly seven seconds to capture a lead&apos;s attention.
                            At JAK Labs, we don&apos;t just design logos; we engineer comprehensive Brand Strategies that
                            differentiate your business from the noise.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Link href="/contact" className="btn-primary group">
                                Build Your Brand
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
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
                        <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-white/10">IDENTITY • TRUST • LOYALTY • RECOGNITION •</span>
                    </motion.div>
                    <motion.div style={{ x: text2X }} className="whitespace-nowrap will-change-transform">
                        <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-gradient-neon">BRANDING • DESIGN • VOICE • STRATEGY •</span>
                    </motion.div>
                </div>
            </section>

            {/* The Science of Strategic Branding */}
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
                            THE SCIENCE OF STRATEGIC BRANDING
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                        >
                            More Than a Visual.{' '}
                            <span className="text-gradient-neon">A Unified Identity.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-white/60 text-lg"
                        >
                            A brand is more than a visual; it is a unified identity that communicates professionalism
                            and reliability. With 80% of consumers stating that brand trust is a prerequisite for purchase,
                            a documented strategy is the foundation of your market authority.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Why Strategy Matters */}
            <section className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="subheading mb-4">WHY A LAB-TESTED STRATEGY MATTERS</p>
                            <h2 className="heading-lg mb-6">
                                Your Brand Is Your{' '}
                                <span className="text-gradient-neon">Greatest Asset</span>
                            </h2>
                            <p className="text-white/60 mb-8">
                                In a crowded market, a strong brand strategy isn&apos;t optional&mdash;it&apos;s the
                                difference between being remembered and being forgotten. We engineer brands that
                                foster deep client trust and drive long-term loyalty.
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
                                    <Target className="w-6 h-6 text-neon-purple" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Market Differentiation</h3>
                                    <p className="text-white/60 text-sm">Break away from the pack by owning a unique position in your market.</p>
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
                                    <Heart className="w-6 h-6 text-neon-pink" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Value Communication</h3>
                                    <p className="text-white/60 text-sm">Clearly articulate your worth to justify premium pricing.</p>
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
                                    <Megaphone className="w-6 h-6 text-neon-cyan" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Operational Agility</h3>
                                    <p className="text-white/60 text-sm">A defined brand makes scaling your marketing efforts seamless and consistent across all global channels.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Elements - 5 Cards */}
            <section className="section-padding">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <p className="subheading mb-4">THE FRAMEWORK</p>
                        <h2 className="heading-lg mb-4">Core Elements of Your <span className="text-gradient-neon">Brand Identity</span></h2>
                        <p className="text-white/60 max-w-2xl mx-auto">
                            We build brands using a multi-dimensional framework to ensure every touchpoint
                            resonates with precision.
                        </p>
                    </motion.div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {brandElements.map((element, index) => (
                            <ElementCard key={index} element={element} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* 6-Step Brand Roadmap */}
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
                            OUR METHODOLOGY
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="heading-lg mb-4"
                        >
                            The JAK Labs <span className="text-gradient-neon">6-Step</span> Brand Roadmap
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-white/60 max-w-3xl mx-auto"
                        >
                            From audience research to continuous optimization, our rigorous six-step process
                            ensures your brand is engineered for maximum impact and lasting relevance.
                        </motion.p>
                    </div>

                    <div ref={roadmapRef} className="grid lg:grid-cols-2 gap-16 items-start">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={roadmapInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6 }}
                        >
                            <h3 className="heading-md mb-6">
                                From Research to{' '}
                                <span className="text-gradient-neon">Recognition</span>
                            </h3>
                            <p className="text-white/60 mb-8">
                                Every phase is transparent, collaborative, and designed to build a brand identity
                                that captures attention in seven seconds and retains loyalty for years.
                            </p>
                            <Link href="/contact" className="btn-secondary group">
                                Start Your Brand Journey
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        <div className="relative">
                            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-neon-purple via-neon-pink via-neon-cyan to-neon-blue" />
                            <div className="space-y-10">
                                {roadmap.map((item, index) => (
                                    <RoadmapStep key={index} item={item} index={index} isInView={roadmapInView} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brand Built for Your Business Section */}
            <section className="section-padding">
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
                                ENGINEERED FOR YOU
                            </motion.p>
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                            >
                                A Brand Built for{' '}
                                <span className="text-gradient-neon">Trust &amp; Loyalty</span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-white/60 text-lg mb-8"
                            >
                                Most agencies deliver templates. We deliver strategy. Every brand we engineer
                                is built from the ground up using real market research, audience intelligence,
                                and your unique business DNA.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex justify-center lg:justify-start"
                            >
                                <Link href="/contact" className="btn-primary group">
                                    Get Your Brand Strategy
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
                            <Image src="/images/analytics.jpg" alt="Brand strategy and identity design" fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Photo Cards */}
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
                                <Image src="/images/strategy.jpg" alt="Brand strategy session" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wider">DEFINE</h3>
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
                                <Image src="/images/team-working.jpg" alt="Brand design collaboration" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wider">DELIVER</h3>
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
                            <Fingerprint className="w-8 h-8 text-neon-purple flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                                    The <span className="text-gradient-neon">Lab-Tested</span> Brand Promise
                                </h3>
                                <p className="text-white/70 mb-4">
                                    We never start with a template. Every engagement begins with a free
                                    Brand Discovery Session where we audit your current identity,
                                    identify opportunities for differentiation, and outline a clear path
                                    to market authority.
                                </p>
                                <p className="text-white/50 text-sm">
                                    No generic logos. No cookie-cutter solutions. Just a strategic, data-driven
                                    brand identity built to capture attention and keep it.
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
                            <p className="subheading mb-4">READY TO STAND OUT?</p>
                            <h2 className="heading-lg mb-6">
                                Let&apos;s Engineer a Brand That{' '}
                                <span className="text-gradient-neon">Commands Attention</span>
                            </h2>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-white/60 text-lg mb-8"
                        >
                            Book a free brand discovery session and get a custom strategy roadmap for your business.
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
                                Book Brand Discovery Session
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
