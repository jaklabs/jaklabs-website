'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

const stats = [
    { value: '125+', label: 'PROJECTS COMPLETED' },
    { value: '150+', label: 'CLIENTS SERVED' },
    { value: '100%', label: 'CLIENT SATISFACTION' },
    { value: '10+', label: 'YEARS EXPERIENCE' },
]

const services = [
    { id: 'digital-marketing', title: 'Digital Marketing Ad Production', description: 'Strategic advertising campaigns across all digital platforms.', href: '/services/digital-marketing' },
    { id: 'app-development', title: 'Application Development', description: 'Custom web and mobile applications built with cutting-edge technology.', href: '/services/app-development' },
    { id: 'digital-transformation', title: 'Digital Transformation Consulting', description: 'Expert guidance to modernize your business processes.', href: '/services/digital-transformation' },
    { id: 'tech-audit', title: 'Advanced Technology Audit', description: 'Comprehensive analysis of your tech stack.', href: '/services/tech-audit' },
]

const pricingPlans = [
    {
        id: 'digital-marketing',
        title: 'Digital Marketing',
        subtitle: 'Visibility & Conversion Engine',
        description: 'Build a revenue engine that drives qualified leads and converts them into customers.',
        color: 'neon-purple',
        features: [
            { category: 'Paid Advertising', items: ['Meta (Facebook/Instagram) Ad Management', 'Google Ads (Search, Display, Local)', 'A/B Testing & Creative Optimization'] },
            { category: 'SEO & Content', items: ['Local SEO & Google Business Profile', 'Technical SEO & Site Speed', 'Content Strategy & Blog Posts'] },
            { category: 'Conversion Optimization', items: ['High-Converting Landing Pages', 'Heatmap & User Behavior Analysis', 'Marketing Automation & Funnels'] },
            { category: 'Content & Creative', items: ['Short-Form Video Production', 'Professional Copywriting', 'Email & SMS Marketing'] }
        ]
    },
    {
        id: 'app-development',
        title: 'App Development',
        subtitle: 'Custom Software Solutions',
        description: 'Build tools that save time, reduce errors, and improve client experience.',
        color: 'neon-pink',
        featured: true,
        features: [
            { category: 'Mobile Development', items: ['iOS & Android Apps (Native/Cross-Platform)', 'Customer Portals & Booking Apps', 'Push Notifications & Analytics'] },
            { category: 'Web Applications', items: ['Internal Dashboards & Admin Panels', 'SaaS Platform Development', 'E-commerce Solutions'] },
            { category: 'Business Automation', items: ['AI Quoting Engines', 'Automated Scheduling Systems', 'Digital Contract Management'] },
            { category: 'Backend & Infrastructure', items: ['AWS Cloud Hosting', 'API Development & Integration', 'Database Management'] }
        ]
    },
    {
        id: 'tech-rental',
        title: 'Tech Rental & Adaptation',
        subtitle: 'Hardware & Specialized Tech',
        description: 'Access cutting-edge equipment without the massive upfront cost.',
        color: 'neon-cyan',
        features: [
            { category: 'Aerial & Drone Tech', items: ['Aerial Photography & Videography', '3D Mapping & Site Surveying', 'Thermal Inspection Drones'] },
            { category: 'Surveying & Mapping', items: ['LiDAR Scanning', 'Matterport 3D Virtual Tours', 'High-Precision Layouts'] },
            { category: 'Security & Surveillance', items: ['Temporary Job-Site Cameras', 'Access Control Systems', 'Smart Lock Integration'] },
            { category: 'Machine Adaptation', items: ['IoT Sensor Retrofitting', 'Fleet Telematics & GPS', 'Workstation & Network Rentals'] }
        ]
    }
]

function ServiceRow({ service, index, hoveredService, setHoveredService, servicesInView }: { service: typeof services[0]; index: number; hoveredService: string | null; setHoveredService: (id: string | null) => void; servicesInView: boolean }) {
    const rowRef = useRef(null)
    const isInView = useInView(rowRef, { once: false, margin: '-40% 0px -40% 0px' })
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => { const checkMobile = () => setIsMobile(window.innerWidth < 768); checkMobile(); window.addEventListener('resize', checkMobile); return () => window.removeEventListener('resize', checkMobile) }, [])
    const isActive = isMobile ? isInView : hoveredService === service.id

    return (
        <motion.div ref={rowRef} initial={{ opacity: 0, y: 20 }} animate={servicesInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }}>
            <Link href={service.href} onMouseEnter={() => setHoveredService(service.id)} onMouseLeave={() => setHoveredService(null)} className="block group">
                <div className={`relative py-8 px-6 border-b border-white/10 transition-all duration-500 ease-out ${isActive ? 'bg-gradient-to-r from-neon-purple/20 via-neon-pink/10 to-transparent shadow-[0_0_60px_rgba(191,90,242,0.3)]' : 'bg-transparent'}`}>
                    <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-500 ${isActive ? 'bg-gradient-to-b from-neon-purple via-neon-pink to-neon-cyan shadow-[0_0_20px_rgba(191,90,242,0.8)]' : 'bg-transparent'}`} />
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-2 transition-all duration-500 ${isActive ? 'text-white' : 'text-white/70'}`}>{service.title}</h3>
                            <p className={`text-sm md:text-base max-w-2xl transition-all duration-500 ${isActive ? 'text-white/80' : 'text-white/40'}`}>{service.description}</p>
                        </div>
                        <div className={`ml-4 p-4 rounded-full transition-all duration-500 ${isActive ? 'bg-neon-purple shadow-[0_0_30px_rgba(191,90,242,0.6)] scale-110' : 'bg-white/5'}`}>
                            <ArrowUpRight className={`w-6 h-6 md:w-8 md:h-8 transition-all duration-500 ${isActive ? 'text-white rotate-45' : 'text-white/40'}`} />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

function PhotoCard({ image, label, isRight = false }: { image: string; label: string; isRight?: boolean }) {
    const cardRef = useRef(null)
    const isInView = useInView(cardRef, { once: false, margin: '-30% 0px -30% 0px' })
    const [isHovered, setIsHovered] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => { const checkMobile = () => setIsMobile(window.innerWidth < 768); checkMobile(); window.addEventListener('resize', checkMobile); return () => window.removeEventListener('resize', checkMobile) }, [])
    const isActive = isMobile ? isInView : isHovered

    return (
        <motion.div ref={cardRef} initial={{ opacity: 0, x: isRight ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative overflow-hidden cursor-pointer" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div className="relative aspect-[4/3] overflow-hidden">
                <motion.div animate={{ scale: isActive ? 1.1 : 1 }} transition={{ duration: 0.6, ease: 'easeOut' as const }} className="absolute inset-0">
                    <Image src={image} alt={label} fill className="object-cover" />
                </motion.div>
                <motion.div animate={{ opacity: isActive ? 0.3 : 0.6 }} transition={{ duration: 0.4 }} className="absolute inset-0 bg-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.h3 animate={{ scale: isActive ? 1.1 : 1, opacity: isActive ? 1 : 0.7 }} transition={{ duration: 0.4 }} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wider">{label}</motion.h3>
                </div>
                <motion.div animate={{ opacity: isActive ? 1 : 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 shadow-[inset_0_0_60px_rgba(191,90,242,0.3)] pointer-events-none" />
            </div>
        </motion.div>
    )
}

function PricingCard({ plan, index }: { plan: typeof pricingPlans[0]; index: number }) {
    const cardRef = useRef(null)
    const isInView = useInView(cardRef, { once: false, margin: '-20% 0px -20% 0px' })
    const [isHovered, setIsHovered] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => { const checkMobile = () => setIsMobile(window.innerWidth < 1024); checkMobile(); window.addEventListener('resize', checkMobile); return () => window.removeEventListener('resize', checkMobile) }, [])
    const isActive = isMobile ? isInView : isHovered

    const colorClasses = {
        'neon-purple': { border: 'border-neon-purple/50', glow: 'shadow-[0_0_60px_rgba(191,90,242,0.3)]', text: 'text-neon-purple', bg: 'bg-neon-purple' },
        'neon-pink': { border: 'border-neon-pink/50', glow: 'shadow-[0_0_60px_rgba(255,45,146,0.3)]', text: 'text-neon-pink', bg: 'bg-neon-pink' },
        'neon-cyan': { border: 'border-neon-cyan/50', glow: 'shadow-[0_0_60px_rgba(0,255,255,0.3)]', text: 'text-neon-cyan', bg: 'bg-neon-cyan' },
    }
    const colors = colorClasses[plan.color as keyof typeof colorClasses]

    return (
        <motion.div ref={cardRef} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.15 }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className={`relative rounded-2xl border transition-all duration-500 bg-secondary/50 ${isActive ? `${colors.border} ${colors.glow} scale-[1.02]` : 'border-white/10'} ${plan.featured ? 'lg:-mt-4 lg:mb-4' : ''}`}>
            {plan.featured && <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full ${colors.bg} text-white text-sm font-medium`}>Most Popular</div>}
            <div className="p-6 md:p-8">
                <div className="text-center mb-6 pb-6 border-b border-white/10">
                    <h3 className={`text-2xl md:text-3xl font-bold mb-2 transition-colors duration-300 ${isActive ? colors.text : 'text-white'}`}>{plan.title}</h3>
                    <p className="text-sm text-white/50 uppercase tracking-wider mb-3">{plan.subtitle}</p>
                    <p className="text-white/60 text-sm">{plan.description}</p>
                </div>
                <div className="space-y-6 mb-8">
                    {plan.features.map((feature, idx) => (
                        <div key={idx}>
                            <h4 className={`font-semibold mb-3 ${colors.text}`}>{feature.category}</h4>
                            <ul className="space-y-2">
                                {feature.items.map((item, itemIdx) => (
                                    <li key={itemIdx} className="flex items-start gap-2 text-sm text-white/70"><span className={`mt-1 ${colors.text}`}>✦</span>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <Link href="/contact" className={`block w-full py-4 rounded-xl font-medium text-center transition-all duration-300 ${isActive ? `${colors.bg} text-white shadow-lg` : 'bg-white/5 text-white hover:bg-white/10'}`}>Book Discovery Session</Link>
            </div>
        </motion.div>
    )
}

function PricingSection() {
    const textRef = useRef(null)
    const { scrollYProgress } = useScroll({ target: textRef, offset: ['start end', 'end start'] })
    const text1X = useTransform(scrollYProgress, [0, 1], [-200, 200])
    const text2X = useTransform(scrollYProgress, [0, 1], [200, -200])
    const text3X = useTransform(scrollYProgress, [0, 1], [-100, 100])

    return (
        <section className="section-padding overflow-hidden">
            <div ref={textRef} className="mb-16 space-y-2">
                <motion.div style={{ x: text1X }} className="whitespace-nowrap"><span className="text-5xl md:text-7xl lg:text-8xl font-bold text-white/10">DIGITAL TRANSFORMATION • CONSULTING • DEVELOPMENT •</span></motion.div>
                <motion.div style={{ x: text2X }} className="whitespace-nowrap"><span className="text-5xl md:text-7xl lg:text-8xl font-bold text-gradient-neon">SOLUTIONS • INNOVATION • TECHNOLOGY •</span></motion.div>
                <motion.div style={{ x: text3X }} className="whitespace-nowrap"><span className="text-5xl md:text-7xl lg:text-8xl font-bold text-white/10">GROWTH • STRATEGY • SUCCESS •</span></motion.div>
            </div>
            <div className="container-custom">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
                    <p className="subheading mb-4">TAILORED SOLUTIONS</p>
                    <h2 className="heading-lg mb-4">Our <span className="text-gradient-neon">Service Packages</span></h2>
                    <p className="text-white/60 max-w-2xl mx-auto">Every niche has different needs. We start with a Discovery Session to understand your business and create a custom solution that drives real results.</p>
                </motion.div>
                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                    {pricingPlans.map((plan, index) => (<PricingCard key={plan.id} plan={plan} index={index} />))}
                </div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="text-center mt-12 p-6 rounded-2xl bg-secondary/50 border border-white/10">
                    <p className="text-white/80 mb-2"><span className="text-neon-purple font-semibold">Strategy Note:</span> We believe in the &quot;Consultation First&quot; model.</p>
                    <p className="text-white/60 text-sm">Instead of one-size-fits-all packages, we start with a Technical Discovery Session to understand your unique needs and build a custom solution that actually moves the needle for your business.</p>
                </motion.div>
            </div>
        </section>
    )
}

function StrategyAnalyticsSection() {
    const textRef = useRef(null)
    const { scrollYProgress } = useScroll({ target: textRef, offset: ['start end', 'end start'] })
    const textX = useTransform(scrollYProgress, [0, 1], [200, -200])

    return (
        <section className="section-padding bg-secondary/30">
            <div className="container-custom">
                <div className="grid md:grid-cols-2 gap-4 md:gap-8 mb-16">
                    <PhotoCard image="/images/strategy.jpg" label="STRATEGY" isRight={false} />
                    <PhotoCard image="/images/analytics.jpg" label="ANALYTICS" isRight={true} />
                </div>
                <div ref={textRef} className="overflow-hidden py-16">
                    <motion.div style={{ x: textX }} className="whitespace-nowrap">
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                            <span className="text-white/90">TRANSFORMING IDEAS INTO </span>
                            <span className="text-gradient-neon">DIGITAL EXCELLENCE</span>
                            <span className="text-white/90"> — WHERE STRATEGY MEETS </span>
                            <span className="text-gradient-neon">INNOVATION</span>
                        </h2>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default function ServicesPage() {
    const heroRef = useRef(null)
    const statsRef = useRef(null)
    const teamRef = useRef<HTMLDivElement>(null)
    const servicesRef = useRef(null)
    const heroInView = useInView(heroRef, { once: true })
    const statsInView = useInView(statsRef, { once: true, margin: '-100px' })
    const servicesInView = useInView(servicesRef, { once: true, margin: '-100px' })
    const { scrollYProgress } = useScroll({ target: teamRef, offset: ['start end', 'end start'] })
    const teamY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [hoveredService, setHoveredService] = useState<string | null>(null)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => { setMousePosition({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 }) }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <>
            <section ref={heroRef} className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image src="/images/services-hero.jpg" alt="Professional typing on laptop" fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-background/70" />
                </div>
                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="subheading mb-4">OUR SERVICES</motion.p>
                        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">OUR SERVICES</motion.h1>
                    </div>
                </div>
            </section>

            <section ref={statsRef} className="py-16 border-b border-white/10">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={statsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-xs md:text-sm text-white/50 tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="text-center lg:text-left">
                            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">BUILD BRAND AND UNLOCKING <span className="text-gradient-neon">YOUR BUSINESS POTENTIALS</span></motion.h2>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                                <Link href="/contact" className="btn-primary group">VIEW MORE SERVICES<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></Link>
                            </motion.div>
                        </div>
                        <div ref={teamRef} className="relative overflow-hidden rounded-2xl h-[400px] md:h-[500px]">
                            <motion.div style={{ y: teamY, x: mousePosition.x }} className="absolute inset-0">
                                <Image src="/images/team-working.jpg" alt="Team collaborating" fill className="object-cover scale-110" />
                            </motion.div>
                            <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-8 overflow-hidden border-y border-white/10">
                <motion.div animate={{ x: [0, -1500] }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} className="whitespace-nowrap flex gap-8">
                    {[...Array(10)].map((_, i) => (
                        <span key={i} className="text-2xl md:text-3xl font-bold tracking-widest flex items-center gap-8">
              <span className="text-neon-purple">DIGITAL MARKETING</span><span className="text-white/30">•</span>
              <span className="text-neon-pink">APP DEVELOPMENT</span><span className="text-white/30">•</span>
              <span className="text-neon-cyan">CONSULTING</span><span className="text-white/30">•</span>
              <span className="text-neon-blue">TECHNOLOGY</span><span className="text-white/30">•</span>
            </span>
                    ))}
                </motion.div>
            </section>

            <section ref={servicesRef} className="section-padding">
                <div className="container-custom">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={servicesInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-16 text-center">
                        <p className="subheading mb-4">WHAT WE OFFER</p>
                        <h2 className="heading-lg">Our <span className="text-gradient-neon">Services</span></h2>
                    </motion.div>
                    <div className="space-y-0">
                        {services.map((service, index) => (<ServiceRow key={service.id} service={service} index={index} hoveredService={hoveredService} setHoveredService={setHoveredService} servicesInView={servicesInView} />))}
                    </div>
                </div>
            </section>

            <StrategyAnalyticsSection />
            <PricingSection />

            <section className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="heading-lg mb-6">Ready to Transform <span className="text-gradient-neon">Your Business</span>?</motion.h2>
                        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="text-white/60 text-lg mb-8">Let&apos;s discuss how our services can help you achieve your goals.</motion.p>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                            <Link href="/contact" className="btn-primary group">Get in Touch<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></Link>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    )
}
