'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'

export function Hero() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], [0, 200])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    return (
        <section
            ref={ref}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background" />

            {/* Floating neon orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-2xl"
                />
                <motion.div
                    animate={{
                        x: [0, -20, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/3 right-1/4 w-80 h-80 bg-neon-pink/20 rounded-full blur-2xl"
                />
                <motion.div
                    animate={{
                        x: [0, 25, 0],
                        y: [0, 25, 0],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-neon-cyan/15 rounded-full blur-2xl"
                />
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

            <motion.div
                style={{ y, opacity }}
                className="container-custom relative z-10 pt-32"
            >
                <div className="max-w-4xl mx-auto text-center">
                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
                    >
                        <span className="block">I build the systems that let</span>
                        <span className="text-gradient-neon">a business run without its owner</span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-white/60 mb-10 max-w-2xl mx-auto"
                    >
                        Scheduling, quoting, invoicing and follow-up — the work that currently
                        lives in a group chat and your head. I&apos;m JD Kemp, one senior engineer
                        in the Lansing area, and I built this for my own business first.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/contact"
                            className="group relative px-8 py-4 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg font-medium text-white overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-neon-purple/25"
                        >
              <span className="relative z-10 flex items-center">
                Book a free Operations Audit
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
                        </Link>
                        <Link
                            href="/website-audit"
                            className="group px-8 py-4 rounded-lg font-medium text-white border border-white/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all"
                        >
              <span className="flex items-center">
                <Play className="mr-2 w-5 h-5 text-neon-cyan" />
                Check my website free
              </span>
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 pt-10 border-t border-white/10"
                    >
                        {[
                            { value: '456', label: 'Michigan sites I audited', color: 'text-neon-purple' },
                            { value: '1', label: 'Engineer on your project', color: 'text-neon-pink' },
                            { value: '$2.5–10K', label: 'Typical build', color: 'text-neon-cyan' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                            >
                                <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>
                                    {stat.value}
                                </div>
                                <div className="text-sm text-white/60">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>

            {/*
              There was a scroll indicator here -- a small animated mouse. It is
              gone, deliberately, after producing two separate visual defects:

                1. `absolute bottom-8 left-1/2` put it dead centre at the bottom
                   of the hero, which is exactly where the middle stat sits. It
                   rendered ON TOP of the "1" in "1 Engineer on your project", so
                   two stats showed a number and the third showed a mouse.
                2. Moved into normal flow instead, it cleared the stats but was
                   then CLIPPED by the section itself -- this is
                   `min-h-screen ... overflow-hidden` with vertically centred
                   content, so anything below the stats is cut off once the
                   content fills the viewport.

              There is no safe position for it in this layout: absolute collides
              with the stats, in-flow is clipped. It is decoration with no job --
              nobody needs a mouse icon to discover that a page scrolls -- so the
              third fix is to not have it. Re-adding it means changing the
              section's height or overflow first, not tuning a margin.
            */}
        </section>
    )
}
