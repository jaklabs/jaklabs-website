'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Target, Rocket, Shield, HeartHandshake } from 'lucide-react'

const features = [
    {
        icon: Target,
        title: 'Results-Driven',
        description: 'Every strategy we implement is measured against clear KPIs. We focus on metrics that matter: leads, conversions, and revenue growth.',
    },
    {
        icon: Rocket,
        title: 'Fast Execution',
        description: 'We move quickly without sacrificing quality. Your campaigns launch faster, your apps deploy sooner, and results come quicker.',
    },
    {
        icon: Shield,
        title: 'Industry Expertise',
        description: 'We specialize in service businesses. We know your customers, your challenges, and what works in your industry.',
    },
    {
        icon: HeartHandshake,
        title: 'True Partnership',
        description: 'We work as an extension of your team. Your success is our success, and we are invested in your long-term growth.',
    },
]

// Word animation variants
const titleWords = ['We', 'Are', 'Not', 'Just', 'Another']
const highlightWords = ['Marketing', 'Agency']

export function WhyChooseUs() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <section ref={ref} className="section-padding relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-neon-pink/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />

            <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5 }}
                            className="inline-block px-4 py-1.5 rounded-full bg-neon-pink/10 border border-neon-pink/20 text-neon-pink text-sm font-medium mb-6"
                        >
                            Why JAKLabs
                        </motion.span>

                        {/* Animated Title */}
                        <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-6">
              <span className="block mb-2">
                {titleWords.map((word, index) => (
                    <motion.span
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{
                            duration: 0.5,
                            delay: 0.1 + index * 0.08,
                            ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        className="inline-block mr-3"
                    >
                        {word}
                    </motion.span>
                ))}
              </span>
                            <span className="block">
                {highlightWords.map((word, index) => (
                    <motion.span
                        key={index}
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                        transition={{
                            duration: 0.6,
                            delay: 0.5 + index * 0.12,
                            ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        className="inline-block mr-3 text-gradient-neon"
                    >
                        {word}
                    </motion.span>
                ))}
              </span>
                        </h2>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="text-white/50 text-lg mb-8"
                        >
                            We combine deep marketing expertise with technical capabilities to deliver
                            comprehensive solutions. From strategy to execution, we handle everything
                            so you can focus on what you do best—serving your customers.
                        </motion.p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.8 }}
                                className="bg-secondary/50 rounded-xl p-4 border border-neon-purple/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={isInView ? { scale: 1 } : {}}
                                    transition={{ duration: 0.5, delay: 1, type: "spring" }}
                                    className="text-3xl font-bold text-neon-purple mb-1"
                                >
                                    5x
                                </motion.div>
                                <div className="text-sm text-white/60">Average ROI</div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.9 }}
                                className="bg-secondary/50 rounded-xl p-4 border border-neon-cyan/20 shadow-[0_0_20px_rgba(0,255,255,0.1)]"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={isInView ? { scale: 1 } : {}}
                                    transition={{ duration: 0.5, delay: 1.1, type: "spring" }}
                                    className="text-3xl font-bold text-neon-cyan mb-1"
                                >
                                    30%
                                </motion.div>
                                <div className="text-sm text-white/60">Cost Reduction</div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Features Grid */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.3 + index * 0.15,
                                    ease: [0.25, 0.46, 0.45, 0.94]
                                }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="group"
                            >
                                <div className="bg-secondary/30 border border-white/5 rounded-xl p-5 h-full hover:border-neon-purple/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all duration-300">
                                    <motion.div
                                        className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 flex items-center justify-center mb-4 group-hover:from-neon-purple/30 group-hover:to-neon-pink/30 transition-all"
                                        whileHover={{ rotate: [0, -10, 10, 0] }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <feature.icon className="w-6 h-6 text-neon-purple" />
                                    </motion.div>
                                    <h3 className="font-semibold mb-2 group-hover:text-white transition-colors">{feature.title}</h3>
                                    <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
