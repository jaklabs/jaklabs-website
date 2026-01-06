'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Target, Lightbulb, Users, Award, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui'

const values = [
    {
        icon: Target,
        title: 'Results First',
        description: 'Everything we do is measured by the impact it has on your business growth.',
        glowColor: 'shadow-[0_0_30px_rgba(168,85,247,0.3),0_0_60px_rgba(168,85,247,0.1)]',
    },
    {
        icon: Lightbulb,
        title: 'Innovation',
        description: 'We stay ahead of trends to give you a competitive advantage in your market.',
        glowColor: 'shadow-[0_0_30px_rgba(255,45,146,0.3),0_0_60px_rgba(255,45,146,0.1)]',
    },
    {
        icon: Users,
        title: 'Partnership',
        description: 'We work as an extension of your team, invested in your long-term success.',
        glowColor: 'shadow-[0_0_30px_rgba(0,255,255,0.3),0_0_60px_rgba(0,255,255,0.1)]',
    },
    {
        icon: Award,
        title: 'Excellence',
        description: 'We hold ourselves to the highest standards in every project we deliver.',
        glowColor: 'shadow-[0_0_30px_rgba(0,136,255,0.3),0_0_60px_rgba(0,136,255,0.1)]',
    },
]

const milestones = [
    { year: '2014', title: 'Founded', description: 'JAKLabs was born with a mission to help service businesses grow.' },
    { year: '2017', title: 'First Major Client', description: 'Landed our first enterprise client and expanded our team.' },
    { year: '2020', title: '100 Projects', description: 'Celebrated our 100th successful project delivery.' },
    { year: '2024', title: 'National Reach', description: 'Now serving clients across all 50 states.' },
]

export default function AboutPage() {
    const heroRef = useRef(null)
    const scrollTextRef = useRef(null)
    const founderRef = useRef(null)
    const missionRef = useRef(null)
    const logoRef = useRef(null)
    const valuesRef = useRef(null)
    const storyRef = useRef(null)

    const heroInView = useInView(heroRef, { once: true })
    const founderInView = useInView(founderRef, { once: true, margin: '-100px' })
    const missionInView = useInView(missionRef, { once: true, margin: '-100px' })
    // logoRef is used for scroll animations via useScroll below
    const valuesInView = useInView(valuesRef, { once: true, margin: '-100px' })
    const storyInView = useInView(storyRef, { once: true, margin: '-100px' })

    // Scrolling text animation
    const { scrollYProgress: textScrollProgress } = useScroll({
        target: scrollTextRef,
        offset: ['start end', 'end start'],
    })
    const achieveX = useTransform(textScrollProgress, [0, 1], [300, -300])
    const growthX = useTransform(textScrollProgress, [0, 1], [-300, 300])

    // Logo reveal scroll animation
    const { scrollYProgress } = useScroll({
        target: logoRef,
        offset: ['start end', 'center center'],
    })
    const logoScale = useTransform(scrollYProgress, [0, 1], [0.5, 1])
    const logoOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])

    return (
        <>
            {/* Hero Section */}
            <section ref={heroRef} className="relative pt-32 pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/about-hero.jpg"
                        alt="JAKLabs Office"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
                </div>

                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-pink/20 rounded-full blur-3xl animate-pulse" />

                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6 }}
                            className="subheading mb-4"
                        >
                            About JAKLabs
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="heading-xl mb-6"
                        >
                            We Build Brands That{' '}
                            <span className="text-gradient-neon">Dominate Markets</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-white/70"
                        >
                            JAKLabs is a full-service marketing and development agency dedicated to helping
                            service-based businesses attract more customers and grow sustainably.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Scrolling Text Section */}
            <section ref={scrollTextRef} className="py-24 md:py-32 overflow-hidden bg-secondary/30">
                <div className="space-y-4 md:space-y-6">
                    <motion.div style={{ x: achieveX }} className="whitespace-nowrap">
                        <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white/90 tracking-tight">
                            Achieve Business
                        </h2>
                    </motion.div>
                    <motion.div style={{ x: growthX }} className="whitespace-nowrap">
                        <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight">
                            <span className="text-gradient-neon">✦ Growth</span>
                        </h2>
                    </motion.div>
                </div>
            </section>

            {/* Founder Section */}
            <section ref={founderRef} className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={founderInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(168,85,247,0.3),0_0_100px_rgba(168,85,247,0.1)]">
                                <Image
                                    src="/images/founder-standing.jpg"
                                    alt="JD Kemp - Founder of JAKLabs"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                            </div>
                            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-neon-purple/50 rounded-2xl" />
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 border-2 border-neon-pink/50 rounded-2xl" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={founderInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <p className="subheading mb-4">Meet the Founder</p>
                            <h2 className="heading-lg mb-4">
                                JD <span className="text-gradient-neon">Kemp</span>
                            </h2>
                            <p className="text-neon-purple font-medium mb-6">Founder & CEO</p>
                            <div className="space-y-4 text-white/70">
                                <p>
                                    With over a decade of experience in marketing and software development,
                                    I founded JAKLabs with a singular mission: to help service-based businesses
                                    thrive in the digital age.
                                </p>
                                <p>
                                    Having worked with hundreds of businesses across various industries,
                                    I understand the unique challenges that service providers face.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section ref={missionRef} className="section-padding">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={missionInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8 }}
                        >
                            <p className="subheading mb-4">Our Mission</p>
                            <h2 className="heading-lg mb-6">
                                Empowering Service Businesses to{' '}
                                <span className="text-gradient-neon">Reach Their Full Potential</span>
                            </h2>
                            <div className="space-y-4 text-white/70">
                                <p>
                                    We believe every service business deserves access to world-class marketing
                                    and technology solutions.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={missionInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,255,255,0.2)]">
                                <Image
                                    src="/images/working-laptop.jpg"
                                    alt="Working at JAKLabs"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Logo Reveal */}
            <section ref={logoRef} className="py-32 bg-secondary/30">
                <div className="container-custom">
                    <motion.div style={{ scale: logoScale, opacity: logoOpacity }} className="max-w-md mx-auto">
                        <div className="relative aspect-square rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(168,85,247,0.4)]">
                            <Image src="/images/jaklabs-logo.png" alt="JAKLabs Logo" fill className="object-contain p-8" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Story / Timeline */}
            <section ref={storyRef} className="section-padding">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={storyInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="subheading mb-4">Our Story</p>
                            <h2 className="heading-lg mb-6">
                                From Idea to <span className="text-gradient-neon">Industry Leader</span>
                            </h2>
                            <div className="space-y-4 text-white/70">
                                <p>JAKLabs started with a simple observation: service businesses were being underserved.</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={storyInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-neon-purple via-neon-pink to-transparent" />
                            <div className="space-y-8">
                                {milestones.map((milestone, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={storyInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                        className="relative pl-20"
                                    >
                                        <div className="absolute left-4 top-1 w-8 h-8 rounded-full bg-neon-purple/20 border-2 border-neon-purple flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-neon-purple" />
                                        </div>
                                        <div className="text-sm text-neon-purple font-medium mb-1">{milestone.year}</div>
                                        <div className="font-semibold mb-1">{milestone.title}</div>
                                        <div className="text-sm text-white/60">{milestone.description}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section ref={valuesRef} className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <p className="subheading mb-4">Our Values</p>
                        <h2 className="heading-lg mb-6">
                            What <span className="text-gradient-neon">Drives Us</span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                            >
                                <Card className={`h-full text-center ${value.glowColor}`}>
                                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-neon-purple/10 flex items-center justify-center">
                                        <value.icon className="w-7 h-7 text-neon-purple" />
                                    </div>
                                    <h3 className="font-semibold mb-2">{value.title}</h3>
                                    <p className="text-sm text-white/60">{value.description}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="heading-lg mb-6">
                            Ready to Work <span className="text-gradient-neon">Together</span>?
                        </h2>
                        <p className="text-white/60 mb-8">
                            Let us show you how we can help your business reach its full potential.
                        </p>
                        <Link href="/contact" className="btn-primary group">
                            Get in Touch
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
