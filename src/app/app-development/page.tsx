'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Smartphone, Monitor, ShoppingCart, Users, Briefcase, Building2, Stethoscope, CheckCircle2, Cpu, Wifi, Globe, Search, Palette, Code2, TestTube2, Rocket, Settings, Zap, Bot, DollarSign } from 'lucide-react'

const pillars = [
    {
        icon: ShoppingCart,
        title: 'Customer-Facing Ecosystems',
        description: 'High-engagement platforms designed to turn users into brand advocates.',
        color: 'neon-purple',
        details: ['E-commerce Platforms', 'Service Booking Apps', 'Loyalty & Rewards Programs', 'Consumer Social Apps'],
    },
    {
        icon: Settings,
        title: 'Internal Operational Tools',
        description: 'Custom software built to streamline operations and remove human error from your daily grind.',
        color: 'neon-pink',
        details: ['HR Management Systems', 'Inventory Tracking', 'Task & Project Management', 'Workflow Automation'],
    },
    {
        icon: Building2,
        title: 'B2B & SaaS Platforms',
        description: 'Robust, secure environments for vendor management and corporate client portals.',
        color: 'neon-cyan',
        details: ['Vendor Management Portals', 'Corporate Client Dashboards', 'Multi-Tenant SaaS Products', 'API-First Platforms'],
    },
    {
        icon: Stethoscope,
        title: 'Industry-Specific Innovation',
        description: 'Specialized solutions for high-regulation sectors with unique compliance needs.',
        color: 'neon-blue',
        details: ['Healthcare & Telemedicine', 'Real Estate Platforms', 'Logistics & Fleet Management', 'FinTech Solutions'],
    },
]

const lifecycle = [
    { step: '01', title: 'Discovery & Objective', description: 'Defining the "Why" and the ROI goals for your application.', icon: Search },
    { step: '02', title: 'Market Intelligence', description: 'Analyzing competitors to find your "Unfair Advantage."', icon: Users },
    { step: '03', title: 'UI/UX Wireframing', description: 'Designing intuitive, friction-free user journeys.', icon: Palette },
    { step: '04', title: 'Tech Stack Selection', description: 'Choosing the right tools (AWS, Firebase, React) for scalability.', icon: Code2 },
    { step: '05', title: 'Engineering (Sprints)', description: 'Transparent, agile coding of the frontend and backend.', icon: Cpu },
    { step: '06', title: 'Rigorous QA Testing', description: 'Stress-testing for security, speed, and bugs.', icon: TestTube2 },
    { step: '07', title: 'Strategic Deployment', description: 'Launching on the App Store/Play Store with optimized listings.', icon: Rocket },
    { step: '08', title: 'Post-Launch Evolution', description: 'Ongoing maintenance and data-driven feature updates.', icon: Settings },
]

const stats = [
    { value: '100+', label: 'Apps Delivered' },
    { value: '99.9%', label: 'Uptime Guarantee' },
    { value: '4.8★', label: 'Average App Rating' },
    { value: '60%', label: 'Faster Time to Market' },
]

const pricing = [
    {
        tier: 'MVP',
        price: '$15,000 – $40,000',
        description: 'Ideal for startups validating ideas with a focused, lean product.',
        color: 'neon-purple',
        features: ['Core Feature Set', 'Single Platform', 'Basic UI/UX Design', 'Launch Support'],
    },
    {
        tier: 'Standard Business App',
        price: '$40,000 – $100,000',
        description: 'Multi-feature applications with API integrations and polished design.',
        color: 'neon-pink',
        features: ['Multi-Feature Build', 'API Integrations', 'Advanced UI/UX', 'Cross-Platform Support'],
    },
    {
        tier: 'Enterprise Solution',
        price: '$100,000+',
        description: 'Complex logic, massive scale, and enterprise-grade security.',
        color: 'neon-cyan',
        features: ['Complex Business Logic', 'Massive Scale Architecture', 'Enterprise Security', 'Ongoing Support & SLA'],
    },
]

function PillarCard({ pillar, index }: { pillar: typeof pillars[0]; index: number }) {
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
            <h3 className={`text-xl md:text-2xl font-bold mb-3 transition-colors duration-300 ${isActive ? colors.text : 'text-white'}`}>{pillar.title}</h3>
            <p className="text-white/60 text-sm mb-5">{pillar.description}</p>
            <ul className="space-y-2">
                {pillar.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-white/70">
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${colors.text}`} />
                        {detail}
                    </li>
                ))}
            </ul>
        </motion.div>
    )
}

function LifecycleStep({ item, index, isInView }: { item: typeof lifecycle[0]; index: number; isInView: boolean }) {
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

export default function AppDevelopmentPage() {
    const heroRef = useRef(null)
    const statsRef = useRef(null)
    const lifecycleRef = useRef(null)
    const scrollTextRef = useRef(null)

    const heroInView = useInView(heroRef, { once: true })
    const statsInView = useInView(statsRef, { once: true, margin: '-100px' })
    const lifecycleInView = useInView(lifecycleRef, { once: true, margin: '-100px' })

    const { scrollYProgress } = useScroll({ target: scrollTextRef, offset: ['start end', 'end start'] })
    const text1X = useTransform(scrollYProgress, [0, 1], [-200, 200])
    const text2X = useTransform(scrollYProgress, [0, 1], [200, -200])

    return (
        <>
            {/* Hero Section */}
            <section ref={heroRef} className="relative pt-32 pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/services-hero.jpg"
                        alt="App Development"
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
                        className="absolute top-1/3 right-1/4 w-80 h-80 bg-neon-cyan/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{ x: [0, 25, 0], y: [0, 25, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-neon-blue/15 rounded-full blur-3xl"
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
                            CUSTOM APP DEVELOPMENT
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
                            Engineering Your{' '}
                            <span className="text-gradient-neon">Digital Edge</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-white/70 mb-8 max-w-2xl mx-auto"
                        >
                            In 2026, a business app is no longer a luxury—it is a critical growth engine.
                            We develop tailored mobile and web applications that solve operational friction,
                            amplify customer loyalty, and drive measurable ROI.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Link href="/contact" className="btn-primary group">
                                Start Your Project
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Results Stats */}
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
                        <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-white/10">MOBILE • WEB • NATIVE • CROSS-PLATFORM •</span>
                    </motion.div>
                    <motion.div style={{ x: text2X }} className="whitespace-nowrap will-change-transform">
                        <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-gradient-neon">SCALABLE • SECURE • INNOVATIVE • AGILE •</span>
                    </motion.div>
                </div>
            </section>

            {/* Lab-Tested Approach Section */}
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
                            OUR APPROACH
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                        >
                            The <span className="text-gradient-neon">Lab-Tested</span> Difference
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-white/60 text-lg"
                        >
                            At JAK Labs, we move beyond generic code to develop tailored applications.
                            Whether you are automating internal workflows or launching a global consumer product,
                            our &quot;Lab-Tested&quot; approach ensures your software is scalable, secure, and market-ready.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Tailored Solutions - 4 Pillars */}
            <section className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <p className="subheading mb-4">TAILORED SOLUTIONS</p>
                        <h2 className="heading-lg mb-4">Solutions for Every <span className="text-gradient-neon">Objective</span></h2>
                        <p className="text-white/60 max-w-2xl mx-auto">
                            We don&apos;t believe in one-size-fits-all. We categorize our development into four
                            strategic pillars to align with your specific business goals.
                        </p>
                    </motion.div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {pillars.map((pillar, index) => (
                            <PillarCard key={index} pillar={pillar} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Native vs. Cross-Platform */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="subheading mb-4">CHOOSING YOUR INFRASTRUCTURE</p>
                            <h2 className="heading-lg mb-6">
                                Native vs.{' '}
                                <span className="text-gradient-neon">Cross-Platform</span>
                            </h2>
                            <p className="text-white/60 mb-8">
                                The foundation of your app determines its performance and your budget.
                                We help you navigate the technical trade-offs to find the right path for your product.
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
                                    <Smartphone className="w-6 h-6 text-neon-purple" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Native Development</h3>
                                    <p className="text-white/60 text-sm">Maximum performance and full access to device APIs. Ideal for complex, high-engagement apps where platform-specific UX is critical (iOS Swift, Android Kotlin).</p>
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
                                    <Monitor className="w-6 h-6 text-neon-pink" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Cross-Platform</h3>
                                    <p className="text-white/60 text-sm">One codebase, multiple platforms. Faster time to market with reduced cost using React Native or Flutter—perfect for MVPs and business apps.</p>
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
                                    <Globe className="w-6 h-6 text-neon-cyan" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Progressive Web Apps (PWAs)</h3>
                                    <p className="text-white/60 text-sm">Mobile-app experience directly through the browser. Fast, installable, and accessible without app store distribution barriers.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Development Lifecycle - 8 Steps */}
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
                            The JAK Labs <span className="text-gradient-neon">8-Step</span> Development Lifecycle
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-white/60 max-w-3xl mx-auto"
                        >
                            We follow a structured &quot;Scientific Method&quot; to move your app from concept to
                            reality without the risk of cost overruns or technical debt.
                        </motion.p>
                    </div>

                    <div ref={lifecycleRef} className="grid lg:grid-cols-2 gap-16 items-start">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={lifecycleInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6 }}
                        >
                            <h3 className="heading-md mb-6">
                                From Concept to{' '}
                                <span className="text-gradient-neon">Reality</span>
                            </h3>
                            <p className="text-white/60 mb-8">
                                Every phase is transparent, collaborative, and designed to keep your project
                                on-time and on-budget. Our agile sprints ensure you see progress every step of the way.
                            </p>
                            <Link href="/contact" className="btn-secondary group">
                                Discuss Your Project
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        <div className="relative">
                            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-neon-purple via-neon-pink via-neon-cyan to-neon-blue" />
                            <div className="space-y-10">
                                {lifecycle.map((item, index) => (
                                    <LifecycleStep key={index} item={item} index={index} isInView={lifecycleInView} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Future-Proofing with AI and IoT */}
            <section className="section-padding">
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
                                FUTURE-PROOFING
                            </motion.p>
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="heading-lg mb-6"
                            >
                                Built for <span className="text-gradient-neon">Tomorrow</span>,{' '}
                                Not Just Today
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-white/60 mb-8"
                            >
                                Every JAK Labs application is built with the capability to integrate the latest
                                technological shifts, ensuring your investment grows with innovation.
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
                                    <Bot className="w-6 h-6 text-neon-purple" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">AI &amp; Automation</h3>
                                    <p className="text-white/60 text-sm">Implementing predictive analytics and intelligent chatbots to supercharge your app&apos;s capabilities.</p>
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
                                    <Wifi className="w-6 h-6 text-neon-pink" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">IoT &amp; Wearables</h3>
                                    <p className="text-white/60 text-sm">Connecting your software to hardware for real-time data tracking across devices and sensors.</p>
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
                                    <Globe className="w-6 h-6 text-neon-cyan" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Progressive Web Apps</h3>
                                    <p className="text-white/60 text-sm">Providing a mobile-app experience directly through the browser for faster accessibility and broader reach.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Photo Cards Section */}
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
                                <Image src="/images/working-laptop.jpg" alt="Development in progress" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wider">BUILD</h3>
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
                                <Image src="/images/team-working.jpg" alt="Team collaboration" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wider">SCALE</h3>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Cost Transparency */}
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
                            COST TRANSPARENCY
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="heading-lg mb-4"
                        >
                            What to <span className="text-gradient-neon">Expect</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-white/60 max-w-3xl mx-auto"
                        >
                            Investment varies based on complexity. We provide clear, milestone-based pricing
                            to ensure there are no surprises.
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {pricing.map((tier, index) => {
                            const colorClasses: Record<string, { border: string; glow: string; text: string; iconBg: string }> = {
                                'neon-purple': { border: 'hover:border-neon-purple/40', glow: 'hover:shadow-[0_0_40px_rgba(191,90,242,0.15)]', text: 'text-neon-purple', iconBg: 'bg-neon-purple/10' },
                                'neon-pink': { border: 'hover:border-neon-pink/40', glow: 'hover:shadow-[0_0_40px_rgba(255,45,146,0.15)]', text: 'text-neon-pink', iconBg: 'bg-neon-pink/10' },
                                'neon-cyan': { border: 'hover:border-neon-cyan/40', glow: 'hover:shadow-[0_0_40px_rgba(0,255,255,0.15)]', text: 'text-neon-cyan', iconBg: 'bg-neon-cyan/10' },
                            }
                            const colors = colorClasses[tier.color]

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.15 }}
                                    className={`p-8 rounded-2xl border border-white/10 bg-secondary/50 backdrop-blur-sm ${colors.border} ${colors.glow} transition-all duration-500`}
                                >
                                    <div className={`w-16 h-16 rounded-xl ${colors.iconBg} flex items-center justify-center mx-auto mb-5`}>
                                        <DollarSign className={`w-8 h-8 ${colors.text}`} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-center">{tier.tier}</h3>
                                    <p className={`text-2xl md:text-3xl font-bold ${colors.text} text-center mb-4`}>{tier.price}</p>
                                    <p className="text-white/60 text-sm text-center mb-6">{tier.description}</p>
                                    <ul className="space-y-3">
                                        {tier.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-white/70">
                                                <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${colors.text}`} />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Consultation Note */}
            <section className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="p-8 md:p-12 rounded-2xl bg-gradient-to-r from-neon-purple/10 via-neon-pink/10 to-neon-cyan/10 border border-white/10"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <Briefcase className="w-8 h-8 text-neon-purple flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                                    The <span className="text-gradient-neon">Lab-Tested</span> Promise
                                </h3>
                                <p className="text-white/70 mb-4">
                                    We never start with assumptions. Every engagement begins with a free
                                    Technical Discovery Session where we map your requirements, define the
                                    technical architecture, and outline a clear path from concept to launch.
                                </p>
                                <p className="text-white/50 text-sm">
                                    No hidden costs. No scope creep. Just a transparent roadmap with
                                    milestone-based delivery so you know exactly what you&apos;re getting.
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
                            <p className="subheading mb-4">READY TO BEGIN THE EXPERIMENT?</p>
                            <h2 className="heading-lg mb-6">
                                Let&apos;s Engineer a Solution That{' '}
                                <span className="text-gradient-neon">Scales With Your Ambition</span>
                            </h2>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-white/60 text-lg mb-8"
                        >
                            Don&apos;t let your business settle for &quot;off-the-shelf&quot; limitations.
                            Book a free discovery session and get a custom development roadmap.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link href="/contact" className="btn-primary group">
                                Start Your Project
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
