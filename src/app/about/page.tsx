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
        description: 'If it does not save you time or make you money, I will say so rather than build it.',
        glowColor: 'shadow-[0_0_30px_rgba(168,85,247,0.3),0_0_60px_rgba(168,85,247,0.1)]',
    },
    {
        icon: Lightbulb,
        title: 'Plain answers',
        description: 'Published pricing, honest scope, and "you do not need this" when that is the answer.',
        glowColor: 'shadow-[0_0_30px_rgba(255,45,146,0.3),0_0_60px_rgba(255,45,146,0.1)]',
    },
    {
        icon: Users,
        title: 'One person',
        description: 'The person you talk to is the person building it. Nothing gets handed to a junior.',
        glowColor: 'shadow-[0_0_30px_rgba(0,255,255,0.3),0_0_60px_rgba(0,255,255,0.1)]',
    },
    {
        icon: Award,
        title: 'Built it myself first',
        description: 'My own service business runs on software I wrote. I would not sell you something I would not run.',
        glowColor: 'shadow-[0_0_30px_rgba(0,136,255,0.3),0_0_60px_rgba(0,136,255,0.1)]',
    },
]

// Everything here is true and checkable. The previous version claimed a 100th
// project delivery, a team of specialists, an enterprise partnership and clients
// worldwide — none of which had happened. On a page whose only job is to make a
// stranger trust you, an invented track record is the most expensive possible
// thing to be caught in.
const milestones = [
    { year: 'The problem', title: 'Running a service business', description: 'I run Haslett Handyman. Quotes lived in my head, jobs lived in a group chat, and invoices went out when I remembered. Nothing was broken exactly — it just all depended on me being available.' },
    { year: 'The build', title: 'I wrote the software I needed', description: 'Email comes in, a ticket is created, the job gets scheduled, the invoice goes out. I can see what I am owed without asking anyone. I built it because I needed it, not because I planned to sell it.' },
    { year: 'The proof', title: 'It runs without me', description: 'The business operates on that system today. That is the entire pitch and the reason I can show you a working thing rather than a slide about one.' },
    { year: 'Now', title: 'Building it for other people', description: 'Same three problems, different trades — getting work in, running the work, getting paid. Mostly local businesses around Lansing and mid-Michigan, where I can come and see the place.' },
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

                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse " />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-pink/20 rounded-full blur-3xl animate-pulse delay-1000 " />

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
                            Software That Runs{' '}
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
                    <motion.div style={{ x: achieveX }} className="whitespace-nowrap will-change-transform">
                        <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white/90 tracking-tight">
                            Achieve Business
                        </h2>
                    </motion.div>
                    <motion.div style={{ x: growthX }} className="whitespace-nowrap will-change-transform">
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
                            <p className="subheading mb-4">Why I do this</p>
                            <h2 className="heading-lg mb-6">
                                Empowering Service Businesses to{' '}
                                <span className="text-gradient-neon">Reach Their Full Potential</span>
                            </h2>
                            <div className="space-y-4 text-white/70">
                                <p>
                                    Every local service business deserves software that fits how it actually works, not a platform it has to bend around. Most of them are running on spreadsheets and memory because the alternative was priced for someone bigger. That is the gap I builng
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
                            <p className="subheading mb-4">How this started</p>
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
                        <p className="subheading mb-4">How I work</p>
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
                            Let us show you how I can help — or tell you honestly that you do not need me.
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
