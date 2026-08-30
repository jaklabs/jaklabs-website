'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Wrench } from 'lucide-react'

/**
 * Hood Dev on the homepage.
 *
 * Placed LAST, after the CTA that asks a business owner to book an audit.
 *
 * The homepage has one job — convert a local business owner — and this section
 * speaks to somebody else entirely. Putting a school for developers above the
 * booking CTA would interrupt the buying path with an offer the reader cannot
 * use. Below it, it costs the primary conversion nothing and catches the
 * developer who scrolled to the bottom looking for something else.
 *
 * Visually separated on purpose: it reads as a second thing this business does,
 * not as another service for the same reader. That is honest, and it stops the
 * page looking like it sells two unrelated products to one person.
 */
export function HoodDev() {
    return (
        <section className="py-20 border-t border-white/10">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-lg bg-neon-purple/10 flex items-center justify-center">
                            <Wrench className="w-5 h-5 text-neon-purple" />
                        </div>
                        <p className="subheading">Also from JAK Labs — for developers</p>
                    </div>

                    <h2 className="heading-lg mb-5">
                        Hood Dev — <span className="text-gradient-neon">software is a trade</span>
                    </h2>

                    <div className="grid lg:grid-cols-2 gap-10 items-start">
                        <div className="space-y-4 text-white/70">
                            <p>
                                A school that assesses you first, tells you what kind of developer you
                                actually are and where you actually leak, then builds a track around
                                that — applied to a real project of your own.
                            </p>
                            <p>
                                Not another curriculum sold to everybody at a different pace. A good
                                mechanic looks at your engine before touching a wrench.
                            </p>
                            <p className="text-white/50 text-sm">
                                Free while I build it. Not for absolute beginners — it diagnoses
                                developers, so there has to be something to diagnose.
                            </p>
                        </div>

                        <div className="lg:pt-1">
                            <div className="flex flex-wrap gap-4">
                                <Link href="/hood-dev" className="btn-primary group">
                                    About the school
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="https://hood.jaklabs.io/signup"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary"
                                >
                                    Sign up
                                </Link>
                            </div>
                            <p className="mt-4 text-xs text-white/40">
                                The school lives at hood.jaklabs.io
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
