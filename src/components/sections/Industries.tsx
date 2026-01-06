'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import {
    Home,
    Wrench,
    Building2,
    Briefcase,
    Stethoscope,
    Scale,
    Car,
    UtensilsCrossed
} from 'lucide-react'

const industriesRow1 = [
    { icon: Home, name: 'Real Estate', description: 'Agents & Brokers', gradient: 'from-neon-purple to-neon-pink' },
    { icon: Wrench, name: 'Trades', description: 'HVAC, Plumbing, Electric', gradient: 'from-neon-pink to-neon-cyan' },
    { icon: Building2, name: 'Home Services', description: 'Cleaning, Landscaping', gradient: 'from-neon-cyan to-neon-blue' },
    { icon: Briefcase, name: 'Professional', description: 'Consulting, Finance', gradient: 'from-neon-blue to-neon-purple' },
]

const industriesRow2 = [
    { icon: Stethoscope, name: 'Healthcare', description: 'Clinics, Wellness', gradient: 'from-neon-pink to-neon-purple' },
    { icon: Scale, name: 'Legal', description: 'Law Firms, Attorneys', gradient: 'from-neon-cyan to-neon-pink' },
    { icon: Car, name: 'Automotive', description: 'Dealers, Auto Shops', gradient: 'from-neon-purple to-neon-cyan' },
    { icon: UtensilsCrossed, name: 'Restaurants', description: 'Food & Hospitality', gradient: 'from-neon-blue to-neon-pink' },
]

function IndustryCard({ industry, index, isInView }: { industry: typeof industriesRow1[0], index: number, isInView: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
                duration: 0.6,
                delay: 0.1 + index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="group relative flex-shrink-0 w-80 md:w-96 h-52 md:h-60 rounded-3xl bg-secondary/80 border border-white/5 backdrop-blur-sm overflow-hidden cursor-pointer hover:border-white/20 transition-all duration-300"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${industry.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

            <div className="relative h-full p-8 flex flex-col justify-between">
                <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${industry.gradient} p-[1px]`}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="w-full h-full rounded-2xl bg-secondary flex items-center justify-center">
                        <industry.icon className="w-8 h-8 text-white" />
                    </div>
                </motion.div>

                <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-white transition-colors">
                        {industry.name}
                    </h3>
                    <p className="text-base text-white/40 group-hover:text-white/60 transition-colors">
                        {industry.description}
                    </p>
                </div>
            </div>

            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${industry.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        </motion.div>
    )
}

export function Industries() {
    const containerRef = useRef(null)
    const headerRef = useRef(null)
    const row1Ref = useRef(null)
    const row2Ref = useRef(null)
    const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' })
    const isRow1InView = useInView(row1Ref, { once: true, margin: '-50px' })
    const isRow2InView = useInView(row2Ref, { once: true, margin: '-50px' })

    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const scrollRange = isMobile ? 800 : 400
    const row1X = useTransform(scrollYProgress, [0, 1], [-scrollRange, scrollRange])
    const row2X = useTransform(scrollYProgress, [0, 1], [scrollRange, -scrollRange])

    return (
        <section ref={containerRef} className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-secondary/30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-3xl" />

            <div className="relative z-10">
                <div ref={headerRef} className="container-custom text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 50 }}
                        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="inline-block px-4 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-sm font-medium mb-6"
                    >
                        Industries We Serve
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 60 }}
                        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                    >
                        Built for{' '}
                        <span className="text-gradient-neon">Service Businesses</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 70 }}
                        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="text-lg text-white/50 max-w-xl mx-auto"
                    >
                        We understand the unique challenges of service-based businesses.
                        Our strategies are tailored to help you win.
                    </motion.p>
                </div>

                <div className="space-y-8">
                    <div ref={row1Ref}>
                        <motion.div
                            style={{ x: row1X }}
                            className="flex gap-8 justify-center"
                        >
                            {[...industriesRow1, ...industriesRow1, ...industriesRow1].map((industry, index) => (
                                <IndustryCard
                                    key={`row1-${index}`}
                                    industry={industry}
                                    index={index % 4}
                                    isInView={isRow1InView}
                                />
                            ))}
                        </motion.div>
                    </div>

                    <div ref={row2Ref}>
                        <motion.div
                            style={{ x: row2X }}
                            className="flex gap-8 justify-center"
                        >
                            {[...industriesRow2, ...industriesRow2, ...industriesRow2].map((industry, index) => (
                                <IndustryCard
                                    key={`row2-${index}`}
                                    industry={industry}
                                    index={index % 4}
                                    isInView={isRow2InView}
                                />
                            ))}
                        </motion.div>
                    </div>
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    animate={isRow2InView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-center text-white/30 text-sm mt-20"
                >
                    And many more industries we help dominate their local markets
                </motion.p>
            </div>
        </section>
    )
}
