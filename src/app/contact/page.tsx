'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    CheckCircle,
    Sparkles,
    Zap,
    Globe,
    MessageCircle
} from 'lucide-react'

// Contact Card Component with scroll-based activation for mobile
function ContactCard({
                         item,
                         index,
                         sectionInView,
                     }: {
    item: {
        icon: React.ReactNode
        title: string
        value: string
        href: string | null
        color: string
        shadowColor: string
        bgGlow: string
    }
    index: number
    sectionInView: boolean
}) {
    const cardRef = useRef(null)
    const isInView = useInView(cardRef, {
        once: false,
        margin: '-40% 0px -40% 0px' // Activates when card is in center 20% of viewport
    })

    const [isMobile, setIsMobile] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // On mobile, use scroll-based activation. On desktop, use hover
    const isActive = isMobile ? isInView : isHovered

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={sectionInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative group"
        >
            <div className={`
        relative p-8 rounded-2xl border bg-secondary/50 backdrop-blur-sm
        transition-all duration-500 cursor-pointer overflow-hidden
        ${isActive
                ? `border-white/30 shadow-2xl ${item.shadowColor} scale-105`
                : 'border-white/10 hover:border-white/20'}
      `}>
                {/* Glow effect on active */}
                <div className={`
          absolute inset-0 transition-opacity duration-500
          ${item.bgGlow} blur-xl
          ${isActive ? 'opacity-100' : 'opacity-0'}
        `} />

                {/* Animated border glow */}
                <div className={`
          absolute inset-0 rounded-2xl transition-opacity duration-500
          ${isActive ? 'opacity-100' : 'opacity-0'}
        `}>
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.color} opacity-20`} />
                </div>

                <div className="relative z-10">
                    {/* Icon with gradient background */}
                    <motion.div
                        animate={isActive ? {
                            rotate: [0, -10, 10, -5, 5, 0],
                            scale: [1, 1.1, 1]
                        } : {}}
                        transition={{ duration: 0.6 }}
                        className={`
              w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} 
              flex items-center justify-center mb-6 text-white
              shadow-lg ${item.shadowColor}
              transition-transform duration-500
              ${isActive ? 'scale-110' : 'scale-100'}
            `}
                    >
                        {item.icon}
                    </motion.div>

                    <h3 className={`
            text-sm tracking-wider uppercase mb-2 transition-colors duration-300
            ${isActive ? 'text-white/80' : 'text-white/50'}
          `}>
                        {item.title}
                    </h3>

                    {item.href ? (
                        <a
                            href={item.href}
                            className={`
                text-lg font-semibold transition-colors duration-300
                ${isActive ? 'text-white' : 'text-white/80'}
                hover:text-purple-400
              `}
                        >
                            {item.value}
                        </a>
                    ) : (
                        <span className={`
              text-lg font-semibold transition-colors duration-300
              ${isActive ? 'text-white' : 'text-white/80'}
            `}>
              {item.value}
            </span>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default function ContactPage() {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    })
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const heroRef = useRef(null)
    const contactInfoRef = useRef(null)
    const formRef = useRef(null)

    const heroInView = useInView(heroRef, { once: true })
    const contactInfoInView = useInView(contactInfoRef, { once: true, margin: '-100px' })
    const formInView = useInView(formRef, { once: true, margin: '-100px' })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!agreedToTerms) {
            alert('Please agree to the terms and conditions')
            return
        }
        setIsSubmitting(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsSubmitting(false)
        setIsSubmitted(true)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const contactInfo = [
        {
            icon: <Phone className="w-7 h-7" />,
            title: 'Call Us',
            value: '(123) 456-7890',
            href: 'tel:+1234567890',
            color: 'from-purple-500 to-pink-500',
            shadowColor: 'shadow-purple-500/30',
            bgGlow: 'bg-purple-500/20'
        },
        {
            icon: <Mail className="w-7 h-7" />,
            title: 'Email Us',
            value: 'hello@jaklabs.io',
            href: 'mailto:hello@jaklabs.io',
            color: 'from-pink-500 to-rose-500',
            shadowColor: 'shadow-pink-500/30',
            bgGlow: 'bg-pink-500/20'
        },
        {
            icon: <Globe className="w-7 h-7" />,
            title: 'Location',
            value: 'Remote & Worldwide',
            href: null,
            color: 'from-cyan-500 to-blue-500',
            shadowColor: 'shadow-cyan-500/30',
            bgGlow: 'bg-cyan-500/20'
        },
        {
            icon: <Zap className="w-7 h-7" />,
            title: 'Response Time',
            value: 'Within 24 Hours',
            href: null,
            color: 'from-amber-500 to-orange-500',
            shadowColor: 'shadow-amber-500/30',
            bgGlow: 'bg-amber-500/20'
        },
    ]

    return (
        <>
            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image src="/images/takingacall.jpg" alt="Professional on phone call" fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background" />
                </div>

                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
                        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
                    />
                </div>

                <div className="container-custom relative z-10 pt-32 pb-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
                        >
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-white/80">Let&apos;s Build Something Amazing</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-6"
                        >
                            GET IN{' '}
                            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                TOUCH
              </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto"
                        >
                            Ready to transform your business? We&apos;d love to hear from you.
                            Let&apos;s discuss how we can help you dominate your market.
                        </motion.p>
                    </div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
                    >
                        <motion.div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Contact Info Cards */}
            <section ref={contactInfoRef} className="py-20 bg-gradient-to-b from-background to-secondary/30">
                <div className="container-custom">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((item, index) => (
                            <ContactCard
                                key={index}
                                item={item}
                                index={index}
                                sectionInView={contactInfoInView}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section ref={formRef} className="py-24 bg-secondary/30">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 max-w-6xl mx-auto">
                        {/* Left Side */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={formInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6">
                                <MessageCircle className="w-4 h-4 text-purple-400" />
                                <span className="text-sm text-purple-400">Start a Conversation</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                                LET&apos;S CREATE
                                <br />
                                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                  SOMETHING GREAT
                </span>
                            </h2>

                            <p className="text-white/50 text-lg leading-relaxed mb-8">
                                Whether you need a complete digital transformation or just want to chat about possibilities,
                                we&apos;re here to help turn your vision into reality.
                            </p>

                            {/* Features */}
                            <div className="space-y-4">
                                {[
                                    { icon: <Zap className="w-5 h-5" />, text: 'Fast response within 24 hours' },
                                    { icon: <Globe className="w-5 h-5" />, text: 'Working with clients worldwide' },
                                    { icon: <Sparkles className="w-5 h-5" />, text: 'Free consultation call' },
                                ].map((feature, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={formInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                                            {feature.icon}
                                        </div>
                                        <span className="text-white/70">{feature.text}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right Side - Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={formInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative p-8 md:p-10 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                                {/* Decorative gradient */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />

                                {isSubmitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", duration: 0.6 }}
                                            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center"
                                        >
                                            <CheckCircle className="w-12 h-12 text-green-400" />
                                        </motion.div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                        <p className="text-white/60">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="group">
                                                <label htmlFor="name" className="block text-sm text-white/70 mb-2">Name *</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    required
                                                    value={formState.name}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div className="group">
                                                <label htmlFor="email" className="block text-sm text-white/70 mb-2">Email *</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    required
                                                    value={formState.email}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                                                    placeholder="john@company.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm text-white/70 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formState.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                                                placeholder="(123) 456-7890"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-sm text-white/70 mb-2">Subject *</label>
                                            <input
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                required
                                                value={formState.subject}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                                                placeholder="How can we help?"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm text-white/70 mb-2">Message *</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                required
                                                rows={4}
                                                value={formState.message}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 resize-none"
                                                placeholder="Tell us about your project..."
                                            />
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setAgreedToTerms(!agreedToTerms)}
                                                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                                    agreedToTerms
                                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500'
                                                        : 'bg-transparent border-white/30 hover:border-white/50'
                                                }`}
                                            >
                                                {agreedToTerms && (
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </button>
                                            <span className="text-sm text-white/60">
                        I agree to the <a href="#" className="text-purple-400 hover:underline">terms and conditions</a>
                      </span>
                                        </div>

                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-[length:200%_100%] bg-left hover:bg-right text-white font-semibold rounded-xl transition-all duration-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center justify-center gap-2">
                          <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Sending...
                        </span>
                                            ) : (
                                                'Send Message'
                                            )}
                                        </motion.button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    )
}
