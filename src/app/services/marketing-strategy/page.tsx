'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight,
  Target,
  Search,
  Megaphone,
  BarChart3,
  Brain,
  Zap,
  TrendingUp,
  Mail,
  MessageSquare,
  Sparkles,
} from 'lucide-react'

const phases = [
  {
    number: '01',
    title: 'Research & Archetyping',
    icon: Search,
    color: 'neon-purple',
    description:
      'We kick things off by defining SMART goals — Specific, Measurable, Achievable, Relevant, and Time-bound. Then we dig into primary and secondary research to build detailed Buyer Personas, so your messaging actually hits the pain points of your ideal customer.',
  },
  {
    number: '02',
    title: 'Positioning & Unique Value (UVP)',
    icon: Target,
    color: 'neon-pink',
    description:
      'We identify your Unique Value Proposition — the "secret sauce" that makes you better than the competition. Then we map it across a messaging matrix to keep things consistent across every digital touchpoint.',
  },
  {
    number: '03',
    title: 'Channel Optimization & Budgeting',
    icon: Megaphone,
    color: 'neon-cyan',
    description:
      'Based on how your audience actually behaves, we pick the high-ROI channels — whether that\'s Meta Ads, SEO, or Email Marketing. Your budget gets allocated strategically, prioritizing tactics that offer the fastest path to growth.',
  },
  {
    number: '04',
    title: 'Measurement & Agile Adaptation',
    icon: BarChart3,
    color: 'neon-blue',
    description:
      'Marketing is a living system. We set up Key Performance Indicators (KPIs) and use advanced analytics to monitor traffic, conversion rates, and acquisition costs. We stay agile, refining the strategy based on real-time data.',
  },
]

const aiAdvantages = [
  {
    icon: TrendingUp,
    title: 'Predictive Analytics',
    description: 'Forecasting market trends and ROI before you spend a dime.',
  },
  {
    icon: Sparkles,
    title: 'Hyper-Personalization',
    description: 'Tailoring the customer journey at scale — like having a 1-on-1 conversation with thousands.',
  },
  {
    icon: Zap,
    title: 'Automated Optimization',
    description: 'Running A/B tests and campaign adjustments at lightning speed, 24/7.',
  },
]

const strategicOptions = [
  {
    icon: Target,
    title: 'Inbound Marketing',
    description: 'Engineering a magnet for high-value leads that come to you.',
  },
  {
    icon: MessageSquare,
    title: 'Content & Social Systems',
    description: 'Building authority through value-driven media that people actually want to share.',
  },
  {
    icon: Mail,
    title: 'Email & SMS Automation',
    description: 'Nurturing prospects into loyal brand advocates on autopilot.',
  },
]

export default function MarketingStrategyPage() {
  const heroRef = useRef(null)
  const introRef = useRef(null)
  const whyRef = useRef(null)
  const phasesRef = useRef(null)
  const aiRef = useRef(null)
  const optionsRef = useRef(null)
  const ctaRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true })
  const introInView = useInView(introRef, { once: true, margin: '-100px' })
  const whyInView = useInView(whyRef, { once: true, margin: '-100px' })
  const phasesInView = useInView(phasesRef, { once: true, margin: '-100px' })
  const aiInView = useInView(aiRef, { once: true, margin: '-100px' })
  const optionsInView = useInView(optionsRef, { once: true, margin: '-100px' })
  const ctaInView = useInView(ctaRef, { once: true, margin: '-100px' })

  return (
    <>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/marketing-strategy-hero.jpg"
            alt="Marketing strategy workspace"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
        </div>

        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-neon-purple/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="container-custom relative z-10 pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-sm tracking-[0.3em] text-neon-purple font-medium mb-6"
            >
              MARKETING STRATEGY
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-wide mb-6"
            >
              STOP GUESSING.
              <br />
              <span className="text-gradient-neon">START DOMINATING.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto"
            >
              Your competitors have a plan. Do you? Let&apos;s build you a marketing strategy that actually works.
            </motion.p>
          </div>
        </div>

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

      {/* Intro Section */}
      <section ref={introRef} className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={introInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                The Strategic Blueprint:{' '}
                <span className="text-gradient-neon">Engineering Market Dominance</span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={introInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-white/70 leading-relaxed text-center"
            >
              At JAK Labs, we believe that high-growth marketing isn&apos;t an accident — it&apos;s a documented, tactical science.
              Moving beyond simple guesswork, a robust marketing strategy aligns your overarching business goals with
              data-driven execution to maximize your Return on Investment (ROI).
            </motion.p>
          </div>
        </div>
      </section>

      {/* Why Strategy Section */}
      <section ref={whyRef} className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={whyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <p className="text-sm tracking-[0.3em] text-neon-purple font-medium mb-4">
                THE EDGE
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Why Strategy is Your{' '}
                <span className="text-gradient-neon">Greatest Competitive Edge</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed">
                A marketing strategy is your professional playbook, designed to amplify your &quot;share of voice&quot;
                and convert leads into revenue. Without this roadmap, businesses risk targeting irrelevant audiences
                and wasting resources on stuff that just doesn&apos;t resonate.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={whyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-6"
            >
              {[
                {
                  icon: Search,
                  title: 'Deep Market Insight',
                  description: 'Truly understand the psychographics of your ideal client — what makes them tick, what keeps them up at night.',
                },
                {
                  icon: Target,
                  title: 'Defined Value Proposition',
                  description: 'Articulate exactly why you are the #1 choice. No fluff, no filler — just the real reasons people should pick you.',
                },
                {
                  icon: Megaphone,
                  title: 'Precision Positioning',
                  description: 'Outmaneuver competitors by owning a specific niche. Be the go-to, not the one-of-many.',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={whyInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="group relative p-6 rounded-2xl bg-secondary/50 border border-white/10 hover:border-neon-purple/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple/20 to-transparent flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-neon-purple group-hover:text-neon-pink transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4-Phase Framework */}
      <section ref={phasesRef} className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={phasesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm tracking-[0.3em] text-neon-pink font-medium mb-4">
              OUR PROCESS
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              The JAK Labs{' '}
              <span className="text-gradient-neon">4-Phase Execution Framework</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-lg">
              We distinguish between Strategy (the high-level &quot;Why&quot;) and Planning (the tactical &quot;How&quot;).
              Our approach follows a rigorous order of operations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {phases.map((phase, index) => {
              const colorMap: Record<string, string> = {
                'neon-purple': 'from-neon-purple/20 to-neon-purple/5 border-neon-purple/30 hover:border-neon-purple/60 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]',
                'neon-pink': 'from-neon-pink/20 to-neon-pink/5 border-neon-pink/30 hover:border-neon-pink/60 hover:shadow-[0_0_40px_rgba(255,45,146,0.2)]',
                'neon-cyan': 'from-neon-cyan/20 to-neon-cyan/5 border-neon-cyan/30 hover:border-neon-cyan/60 hover:shadow-[0_0_40px_rgba(0,255,255,0.2)]',
                'neon-blue': 'from-neon-blue/20 to-neon-blue/5 border-neon-blue/30 hover:border-neon-blue/60 hover:shadow-[0_0_40px_rgba(0,136,255,0.2)]',
              }
              const textColorMap: Record<string, string> = {
                'neon-purple': 'text-neon-purple',
                'neon-pink': 'text-neon-pink',
                'neon-cyan': 'text-neon-cyan',
                'neon-blue': 'text-neon-blue',
              }

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={phasesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className={`relative p-8 rounded-2xl bg-gradient-to-br border transition-all duration-300 ${colorMap[phase.color]}`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`text-4xl font-bold ${textColorMap[phase.color]} opacity-50`}>
                      {phase.number}
                    </span>
                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center`}>
                      <phase.icon className={`w-6 h-6 ${textColorMap[phase.color]}`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{phase.title}</h3>
                  <p className="text-white/60 leading-relaxed">{phase.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* AI Advantage Section */}
      <section ref={aiRef} className="section-padding bg-secondary/30 overflow-hidden">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={aiInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 mb-6">
              <Brain className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm text-neon-cyan font-medium">The Lab Advantage</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              The AI Advantage:{' '}
              <span className="text-gradient-neon">Hyper-Personalization</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-lg">
              In 2026, the &quot;Lab&quot; approach means leveraging Artificial Intelligence to gain an unfair advantage.
              We integrate AI into every layer of your marketing strategy.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {aiAdvantages.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={aiInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative p-8 rounded-2xl bg-secondary/50 border border-white/10 hover:border-neon-cyan/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,255,255,0.15)] text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-transparent flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-neon-cyan group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/50 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Options */}
      <section ref={optionsRef} className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={optionsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm tracking-[0.3em] text-neon-purple font-medium mb-4">
              GROWTH ENGINES
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Strategic Options for{' '}
              <span className="text-gradient-neon">Your Growth</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {strategicOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={optionsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative p-8 rounded-2xl bg-secondary/50 border border-white/10 hover:border-neon-purple/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
              >
                <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-pink/10 flex items-center justify-center">
                  <option.icon className="w-7 h-7 text-neon-purple group-hover:text-neon-pink transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{option.title}</h3>
                <p className="text-white/50 leading-relaxed">{option.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="section-padding bg-secondary/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-neon-purple/20 via-secondary to-neon-pink/20 border border-white/10 p-12 md:p-16"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-purple/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-neon-pink/20 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
              >
                Ready to Stop Playing Small and{' '}
                <span className="text-gradient-neon">Start Winning</span>?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-white/60 text-lg mb-8"
              >
                Let&apos;s map out a strategy that turns your business into a market leader.
                Book a free discovery call and let&apos;s get to work.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link
                  href="/contact"
                  className="btn-primary group inline-flex items-center text-lg px-8 py-4"
                >
                  Let&apos;s Talk Strategy
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
