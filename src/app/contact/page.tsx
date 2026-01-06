'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, CheckCircle } from 'lucide-react'

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
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone',
      value: '(123) 456-7890',
      href: 'tel:+1234567890',
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      value: 'hello@jaklabs.io',
      href: 'mailto:hello@jaklabs.io',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Location',
      value: 'Remote & Worldwide',
      href: null,
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Hours',
      value: 'Mon-Fri: 9AM-6PM EST',
      href: null,
    },
  ]

  return (
    <>
      {/* Hero Section with Background Image */}
      <section
        ref={heroRef}
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
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
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="container-custom relative z-10 pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-sm tracking-[0.3em] text-white/80 font-medium mb-6"
            >
              CONTACT US
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-wider italic"
              style={{ fontFamily: 'serif' }}
            >
              GET IN TOUCH
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Contact Info Row */}
      <section ref={contactInfoRef} className="bg-[#2a2a2a] py-16 border-b border-white/10">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={contactInfoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-4 text-white/70">
                  {item.icon}
                </div>
                <span className="text-xs tracking-[0.2em] text-white/50 font-medium mb-2 uppercase">
                  {item.title}
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-white text-sm hover:text-primary transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="text-white text-sm">{item.value}</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect With Us / Form Section */}
      <section ref={formRef} className="bg-[#1a1a1a] py-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 max-w-6xl mx-auto">
            {/* Left Side - Connect With Us */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-wide leading-tight">
                CONNECT<br />WITH US
              </h2>
              <p className="text-white/50 text-lg leading-relaxed">
                Ready to take your business to the next level? Fill out the form and we&apos;ll get back to you within 24 hours.
              </p>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full border border-green-500/30 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-white/60">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}

                  {/* Name & Email Row */}
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="name" className="block text-sm text-white/70 mb-3">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formState.name}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-white/30 pb-3 text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/30"
                        placeholder=""
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm text-white/70 mb-3">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formState.email}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-white/30 pb-3 text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/30"
                        placeholder=""
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm text-white/70 mb-3">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formState.phone}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/30 pb-3 text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/30"
                      placeholder=""
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm text-white/70 mb-3">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formState.subject}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/30 pb-3 text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/30"
                      placeholder=""
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm text-white/70 mb-3">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={formState.message}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/30 pb-3 text-white focus:outline-none focus:border-white transition-colors resize-none placeholder:text-white/30"
                      placeholder=""
                    />
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setAgreedToTerms(!agreedToTerms)}
                      className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 transition-colors ${
                        agreedToTerms
                          ? 'bg-white border-white'
                          : 'bg-transparent border-white/50'
                      }`}
                    >
                      {agreedToTerms && (
                        <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <span className="text-sm text-white/60">
                      I agree to the{' '}
                      <a href="#" className="text-white hover:underline">
                        terms and conditions
                      </a>
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-12 py-4 bg-white text-black font-medium tracking-wider hover:bg-white/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'SENDING...' : 'PROCEED TO SUBMIT'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
