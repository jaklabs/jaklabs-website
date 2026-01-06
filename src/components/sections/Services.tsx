'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Megaphone, Smartphone, Palette, Search, ArrowRight, ArrowUpRight } from 'lucide-react'

const services = [
    {
        icon: Megaphone,
        title: 'Marketing Strategy',
        description: 'Data-driven campaigns that put your business in front of the right customers.',
        features: ['Digital Advertising', 'Social Media', 'Email Marketing'],
        gradient: 'from-neon-purple to-neon-pink',
        glowColor: 'shadow-[0_0_30px_rgba(168,85,247,0.3),0_0_60px_rgba(168,85,247,0.1)]',
        hoverGlow: 'hover:shadow-[0_0_40px_rgba(168,85,247,0.4),0_0_80px_rgba(168,85,247,0.2)]',
        iconBg: 'bg-neon-purple/10 group-hover:bg-neon-purple/20',
        iconColor: 'text-neon-purple',
        borderColor: 'border-neon-purple/20',
        number: '01',
    },
    {
        icon: Smartphone,
        title: 'App Development',
        description: 'Custom web and mobile applications that streamline your operations.',
        features: ['Web Apps', 'Mobile Apps', 'Custom Software'],
        gradient: 'from-neon-pink to-neon-cyan',
        glowColor: 'shadow-[0_0_30px_rgba(255,45,146,0.3),0_0_60px_rgba(255,45,146,0.1)]',
        hoverGlow: 'hover:shadow-[0_0_40px_rgba(255,45,146,0.4),0_0_80px_rgba(255,45,146,0.2)]',
        iconBg: 'bg-neon-pink/10 group-hover:bg-neon-pink/20',
        iconColor: 'text-neon-pink',
        borderColor: 'border-neon-pink/20',
        number: '02',
    },
    {
        icon: Palette,
        title: 'Brand Design',
        description: 'Memorable brand identities that establish trust and recognition.',
        features: ['Logo Design', 'Brand Guidelines', 'Visual Identity'],
        gradient: 'from-neon-cyan to-neon-blue',
        glowColor: 'shadow-[0_0_30px_rgba(0,255,255,0.3),0_0_60px_rgba(0,255,255,0.1)]',
        hoverGlow: 'hover:shadow-[0_0_40px_rgba(0,255,255,0.4),0_0_80px_rgba(0,255,255,0.2)]',
        iconBg: 'bg-neon-cyan/10 group-hover:bg-neon-cyan/20',
        iconColor: 'text-neon-cyan',
        borderColor: 'border-neon-cyan/20',
        number: '03',
    },
    {
        icon: Search,
        title: 'SEO & Content',
        description: 'Content strategies that drive organic traffic and establish authority.',
        features: ['SEO Optimization', 'Content Strategy', 'Blog Management'],
        gradient: 'from-neon-blue to-neon-purple',
        glowColor: 'shadow-[0_0_30px_rgba(0,136,255,0.3),0_0_60px_rgba(0,136,255,0.1)]',
        hoverGlow: 'hover:shadow-[0_0_40px_rgba(0,136,255,0.4),0_0_80px_rgba(0,136,255,0.2)]',
        iconBg: 'bg-neon-blue/10 group-hover:bg-neon-blue/20',
        iconColor: 'text-neon-blue',
        borderColor: 'border-neon-blue/20',
        number: '04',
    },
]

export function Services() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <section ref={ref} className="section-padding relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/50 to-background" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-purple/5 rounded-full blur-3xl" />

            <div className="container-custom relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-sm font-medium mb-6"
                    >
                        What We Do
                    </motion.span>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Services That{' '}
                        <span className="text-gradient-neon">Drive Results</span>
                    </h2>

                    <p className="text-lg text-white/50 max-w-xl mx-auto">
                        We combine marketing expertise with technical excellence to deliver
                        solutions that actually grow your business.
                    </p>
                </motion.div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                            transition={{
                                duration: 0.5,
                                delay: 0.2 + index * 0.15,
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="group"
                        >
                            <div className={`relative h-full p-8 rounded-2xl bg-secondary/50 border ${service.borderColor} backdrop-blur-sm transition-all duration-500 ${service.glowColor} ${service.hoverGlow}`}>
                                {/* Number badge */}
                                <span className={`absolute top-6 right-6 text-6xl font-bold bg-gradient-to-br ${service.gradient} bg-clip-text text-transparent opacity-10 group-hover:opacity-20 transition-opacity`}>
                  {service.number}
                </span>

                                {/* Icon */}
                                <motion.div
                                    className={`w-14 h-14 rounded-xl ${service.iconBg} flex items-center justify-center mb-6 transition-all duration-300`}
                                    whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                                >
                                    <service.icon className={`w-7 h-7 ${service.iconColor}`} />
                                </motion.div>

                                {/* Content */}
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors">
                                    {service.title}
                                </h3>

                                <p className="text-white/50 mb-6 group-hover:text-white/70 transition-colors">
                                    {service.description}
                                </p>

                                {/* Features */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {service.features.map((feature, idx) => (
                                        <motion.span
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                            transition={{ duration: 0.3, delay: 0.4 + index * 0.15 + idx * 0.1 }}
                                            className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-white/60 border border-white/5 group-hover:border-white/10 transition-colors"
                                        >
                                            {feature}
                                        </motion.span>
                                    ))}
                                </div>

                                {/* Link */}
                                <div className={`inline-flex items-center text-sm font-medium bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity`}>
                                    Learn more
                                    <ArrowUpRight className={`ml-1 w-4 h-4 ${service.iconColor}`} />
                                </div>

                                {/* Bottom gradient line */}
                                <div className={`absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r ${service.gradient} opacity-30 group-hover:opacity-70 transition-opacity`} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-16"
                >
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/10 text-white/80 hover:text-white hover:border-neon-purple/50 hover:bg-neon-purple/5 transition-all group"
                    >
                        View All Services
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
