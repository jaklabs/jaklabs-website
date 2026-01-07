'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, CheckCircle, Send, Sparkles } from 'lucide-react'

const CONTACT_API_URL = 'https://mfo28du4bj.execute-api.us-east-1.amazonaws.com/prod/contact'

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
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const heroRef = useRef(null)
  const contactInfoRef = useRef(null)
  const formRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true })
  const contactInfoInView = useInView(contactInfoRef, { once: true, margin: '-100px' })
  const formInView = useInView(formRef, { once: true, margin: '-100px' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to send message. Please try again.')
      }
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      value: '(123) 456-7890',
      href: 'tel:+1234567890',
      gradient: 'from-neon-purple to-neon-pink',
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'hello@jaklabs.io',
      href: 'mailto:hello@jaklabs.io',
      gradient: 'from-neon-pink to-neon-cyan',
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Remote & Worldwide',
      href: null,
      gradient: 'from-neon-cyan to-neon-blue',
    },
    {
      icon: Clock,
      title: 'Hours',
      value: 'Mon-Fri: 9AM-6PM EST',
      href: null,
      gradient: 'from-neon-blue to-neon-purple',
    },
  ]

  return (
      <>
        {/* Hero Section */}
        <section
            ref={heroRef}
            className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
                src="/images/takingacall.jpg"
                alt="Professional on phone call"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
          </div>

          {/* Floating neon orbs */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-neon-purple/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-neon-cyan/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

          <div className="container-custom relative z-10 pt-32 pb-20">
            <div className="max-w-4xl mx-auto text-center">
              {/* Animated sparkle */}
              <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center mb-6"
              >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-8 h-8 text-neon-purple" />
                </motion.div>
              </motion.div>

              <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6 }}
                  className="text-sm tracking-[0.3em] text-neon-purple font-medium mb-6"
              >
                CONTACT US
              </motion.p>
              <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-wide mb-6"
              >
                LET&apos;S{' '}
                <span className="text-gradient-neon">CREATE</span>
                <br />
                TOGETHER
              </motion.h1>
              <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg text-white/60 max-w-2xl mx-auto"
              >
                Ready to transform your business? We&apos;re here to help you achieve your goals.
              </motion.p>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-6 h-10 border-2 border-neon-purple/50 rounded-full flex items-start justify-center p-2"
            >
              <motion.div className="w-1.5 h-1.5 bg-neon-purple rounded-full" />
            </motion.div>
          </motion.div>
        </section>

        {/* Contact Info Cards */}
        <section ref={contactInfoRef} className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/50 to-background" />

          <div className="container-custom relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {contactInfo.map((item, index) => (
                  <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 40 }}
                      animate={contactInfoInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="group"
                  >
                    <div className="relative p-6 rounded-2xl bg-secondary/50 border border-white/10 hover:border-neon-purple/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                      {/* Gradient background on hover */}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                      <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="relative w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-neon-purple/20 to-transparent flex items-center justify-center"
                      >
                        <item.icon className="w-6 h-6 text-neon-purple group-hover:text-neon-pink transition-colors duration-300" />
                      </motion.div>

                      <span className="block text-xs tracking-[0.2em] text-white/40 font-medium mb-2 uppercase text-center">
                    {item.title}
                  </span>

                      {item.href ? (
                          <a
                              href={item.href}
                              className="block text-white text-sm text-center hover:text-neon-purple transition-colors"
                          >
                            {item.value}
                          </a>
                      ) : (
                          <span className="block text-white text-sm text-center">{item.value}</span>
                      )}
                    </div>
                  </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section ref={formRef} className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-background" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent" />

          {/* Floating decorative elements */}
          <motion.div
              animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-20 left-10 w-32 h-32 bg-neon-purple/10 rounded-full blur-2xl"
          />
          <motion.div
              animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-20 right-10 w-40 h-40 bg-neon-pink/10 rounded-full blur-2xl"
          />

          <div className="container-custom relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 max-w-6xl mx-auto">
              {/* Left Side */}
              <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={formInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col justify-center"
              >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={formInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30 w-fit mb-8"
                >
                  <Send className="w-4 h-4 text-neon-purple" />
                  <span className="text-sm text-neon-purple font-medium">Get in Touch</span>
                </motion.div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-wide leading-tight">
                  READY TO
                  <br />
                  <span className="text-gradient-neon">STAND OUT</span>?
                </h2>

                <p className="text-white/50 text-lg leading-relaxed mb-8">
                  Whether you need a stunning website, powerful marketing strategy, or custom application,
                  we&apos;re here to bring your vision to life.
                </p>

                {/* Feature points */}
                <div className="space-y-4">
                  {[
                    'Free consultation to discuss your needs',
                    'Custom solutions tailored to your business',
                    'Dedicated support throughout your project',
                  ].map((point, index) => (
                      <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={formInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                          className="flex items-center gap-3"
                      >
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink" />
                        <span className="text-white/70">{point}</span>
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
                <div className="relative p-8 md:p-10 rounded-3xl bg-secondary/30 border border-white/10 backdrop-blur-sm hover:border-neon-purple/30 transition-colors duration-300">
                  {/* Glow effect */}
                  <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-neon-purple/20 via-neon-pink/20 to-neon-cyan/20 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />

                  {isSubmitted ? (
                      <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-12"
                      >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                        >
                          <CheckCircle className="w-10 h-10 text-green-500" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                        <p className="text-white/60">
                          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                        </p>
                      </motion.div>
                  ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl"
                            >
                              {error}
                            </motion.div>
                        )}

                        {/* Name & Email */}
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="name" className="block text-sm text-white/70 mb-2 font-medium">
                              Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formState.name}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all duration-300 placeholder:text-white/30 ${
                                    focusedField === 'name'
                                        ? 'border-neon-purple shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                                        : 'border-white/10 hover:border-white/20'
                                }`}
                                placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm text-white/70 mb-2 font-medium">
                              Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formState.email}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all duration-300 placeholder:text-white/30 ${
                                    focusedField === 'email'
                                        ? 'border-neon-pink shadow-[0_0_20px_rgba(255,45,146,0.3)]'
                                        : 'border-white/10 hover:border-white/20'
                                }`}
                                placeholder="john@example.com"
                            />
                          </div>
                        </div>

                        {/* Phone */}
                        <div>
                          <label htmlFor="phone" className="block text-sm text-white/70 mb-2 font-medium">
                            Phone
                          </label>
                          <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formState.phone}
                              onChange={handleChange}
                              onFocus={() => setFocusedField('phone')}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all duration-300 placeholder:text-white/30 ${
                                  focusedField === 'phone'
                                      ? 'border-neon-cyan shadow-[0_0_20px_rgba(0,255,255,0.3)]'
                                      : 'border-white/10 hover:border-white/20'
                              }`}
                              placeholder="(123) 456-7890"
                          />
                        </div>

                        {/* Subject */}
                        <div>
                          <label htmlFor="subject" className="block text-sm text-white/70 mb-2 font-medium">
                            Subject *
                          </label>
                          <input
                              type="text"
                              id="subject"
                              name="subject"
                              required
                              value={formState.subject}
                              onChange={handleChange}
                              onFocus={() => setFocusedField('subject')}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all duration-300 placeholder:text-white/30 ${
                                  focusedField === 'subject'
                                      ? 'border-neon-blue shadow-[0_0_20px_rgba(0,136,255,0.3)]'
                                      : 'border-white/10 hover:border-white/20'
                              }`}
                              placeholder="How can we help?"
                          />
                        </div>

                        {/* Message */}
                        <div>
                          <label htmlFor="message" className="block text-sm text-white/70 mb-2 font-medium">
                            Message *
                          </label>
                          <textarea
                              id="message"
                              name="message"
                              required
                              rows={4}
                              value={formState.message}
                              onChange={handleChange}
                              onFocus={() => setFocusedField('message')}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all duration-300 resize-none placeholder:text-white/30 ${
                                  focusedField === 'message'
                                      ? 'border-neon-purple shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                                      : 'border-white/10 hover:border-white/20'
                              }`}
                              placeholder="Tell us about your project..."
                          />
                        </div>

                        {/* Terms */}
                        <div className="flex items-center gap-3">
                          <button
                              type="button"
                              onClick={() => setAgreedToTerms(!agreedToTerms)}
                              className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                  agreedToTerms
                                      ? 'bg-gradient-to-r from-neon-purple to-neon-pink border-transparent shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                                      : 'bg-transparent border-white/30 hover:border-white/50'
                              }`}
                          >
                            {agreedToTerms && (
                                <motion.svg
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </motion.svg>
                            )}
                          </button>
                          <span className="text-sm text-white/60">
                        I agree to the{' '}
                            <a href="#" className="text-neon-purple hover:text-neon-pink transition-colors">
                          terms and conditions
                        </a>
                      </span>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative w-full py-4 rounded-xl font-medium tracking-wider bg-gradient-to-r from-neon-purple via-neon-pink to-neon-purple bg-[length:200%_100%] text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
                        >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSubmitting ? (
                            <>
                              <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                              />
                              SENDING...
                            </>
                        ) : (
                            <>
                              SEND MESSAGE
                              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                      </span>
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
