'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'

export function CTA() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <section ref={ref} className="section-padding">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 via-secondary to-accent-purple/20 border border-white/10 p-12 md:p-16"
                >
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent" />
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent-purple/20 rounded-full blur-3xl" />

                    <div className="relative z-10 max-w-3xl">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="subheading mb-4"
                        >
                            Ready to Grow?
                        </motion.p>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="heading-lg mb-6"
                        >
                            Let&apos;s Build Something{' '}
                            <span className="text-gradient">Amazing</span> Together
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-white/60 text-lg mb-8"
                        >
                            Whether you need a complete marketing overhaul or a custom application,
                            we are here to help you achieve your business goals. Let&apos;s start with
                            a conversation.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link href="/contact" className="btn-primary group">
                                Schedule a Call
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a href="mailto:hello@jaklabs.io" className="btn-secondary">
                                <Mail className="mr-2 w-5 h-5" />
                                hello@jaklabs.io
                            </a>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
