'use client'

import { useRef, useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Calendar, ArrowLeft, ArrowRight, Linkedin, Twitter, Facebook, Clock, Sparkles, Quote } from 'lucide-react'
import { getBlogPostBySlug, getBlogPosts } from '@/lib/blog-data'
import { BlogPost } from '@/types/blog'

interface BlogPostPageProps {
    params: {
        slug: string
    }
}

const categoryColors: Record<string, { bg: string; glow: string; text: string }> = {
    marketing: { bg: 'from-purple-500 to-pink-500', glow: 'shadow-purple-500/50', text: 'text-purple-400' },
    development: { bg: 'from-cyan-500 to-blue-500', glow: 'shadow-cyan-500/50', text: 'text-cyan-400' },
    design: { bg: 'from-pink-500 to-rose-500', glow: 'shadow-pink-500/50', text: 'text-pink-400' },
    business: { bg: 'from-amber-500 to-orange-500', glow: 'shadow-amber-500/50', text: 'text-amber-400' },
}

// More Articles Card Component
function MoreArticleCard({
                             post,
                             index,
                             isReversed
                         }: {
    post: BlogPost
    index: number
    isReversed: boolean
}) {
    const cardRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(cardRef, {
        once: false,
        margin: '-30% 0px -30% 0px'
    })

    const [isMobile, setIsMobile] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 })

    const colors = categoryColors[post.category.toLowerCase()] || categoryColors.marketing

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile) return
        const rect = cardRef.current?.getBoundingClientRect()
        if (!rect) return
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        setImageOffset({ x: x * 20, y: y * 20 })
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        setImageOffset({ x: 0, y: 0 })
    }

    const isActive = isMobile ? isInView : isHovered

    useEffect(() => {
        if (!isMobile || !isInView) {
            if (isMobile) setImageOffset({ x: 0, y: 0 })
            return
        }
        const interval = setInterval(() => {
            const time = Date.now() / 1000
            setImageOffset({
                x: Math.sin(time) * 8,
                y: Math.cos(time * 0.8) * 8
            })
        }, 50)
        return () => clearInterval(interval)
    }, [isMobile, isInView])

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="grid md:grid-cols-2 gap-8 md:gap-16 items-center"
        >
            {/* Image */}
            <Link
                href={`/blog/${post.slug}`}
                className={`relative h-72 md:h-96 overflow-hidden rounded-2xl group ${isReversed ? 'md:order-2' : ''}`}
            >
                <motion.div
                    animate={{
                        x: imageOffset.x,
                        y: imageOffset.y,
                        scale: isActive ? 1.1 : 1.02
                    }}
                    transition={{ type: 'spring', stiffness: 150, damping: 15 }}
                    className="absolute inset-[-30px]"
                >
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                    />
                </motion.div>

                {/* Gradient overlay on hover */}
                <div className={`
          absolute inset-0 transition-all duration-500 rounded-2xl
          ${isActive
                    ? `bg-gradient-to-t from-black/60 via-transparent to-transparent`
                    : 'bg-black/0'
                }
        `} />

                {/* Glowing border on hover */}
                <div className={`
          absolute inset-0 rounded-2xl transition-opacity duration-500
          ${isActive ? 'opacity-100' : 'opacity-0'}
        `}>
                    <div className={`absolute inset-[-2px] bg-gradient-to-r ${colors.bg} rounded-2xl blur-sm opacity-50`} />
                </div>

                {/* Category badge */}
                <motion.span
                    animate={{ scale: isActive ? 1.05 : 1, y: isActive ? -4 : 0 }}
                    className={`
            absolute top-4 left-4 z-20 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase
            bg-gradient-to-r ${colors.bg} text-white
            ${isActive ? `shadow-lg ${colors.glow}` : ''}
          `}
                >
                    {post.category}
                </motion.span>

                {/* Sparkle on hover */}
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-4 right-4 z-20"
                    >
                        <Sparkles className={`w-5 h-5 ${colors.text} animate-pulse`} />
                    </motion.div>
                )}
            </Link>

            {/* Content */}
            <div className={isReversed ? 'md:order-1' : ''}>
                <motion.span
                    animate={{ x: isActive ? 8 : 0 }}
                    className={`text-xs tracking-[0.2em] uppercase mb-4 block transition-colors duration-300 ${isActive ? colors.text : 'text-white/40'}`}
                >
                    {post.category}
                </motion.span>
                <Link href={`/blog/${post.slug}`}>
                    <motion.h3
                        animate={{ x: isActive ? 12 : 0 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className={`
              text-2xl md:text-4xl font-light mb-4 transition-colors duration-300 leading-tight
              ${isActive ? 'text-white' : 'text-white/70'}
            `}
                        style={{ fontFamily: 'serif' }}
                    >
                        {post.title}
                    </motion.h3>
                </Link>
                <motion.p
                    animate={{ x: isActive ? 8 : 0 }}
                    className={`
            text-sm leading-relaxed mb-8 transition-colors duration-300
            ${isActive ? 'text-white/60' : 'text-white/30'}
          `}
                >
                    {post.excerpt}
                </motion.p>
                <Link href={`/blog/${post.slug}`}>
                    <motion.div
                        animate={{
                            x: isActive ? 12 : 0,
                            scale: isActive ? 1.1 : 1
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className={`
              inline-flex items-center justify-center w-14 h-14 rounded-full
              transition-all duration-300
              ${isActive
                            ? `bg-gradient-to-r ${colors.bg} text-white shadow-lg ${colors.glow}`
                            : 'border border-white/20 text-white/40'
                        }
            `}
                    >
                        <ArrowRight className="w-6 h-6" />
                    </motion.div>
                </Link>
            </div>
        </motion.div>
    )
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
    const post = getBlogPostBySlug(params.slug)
    const heroRef = useRef(null)
    const heroInView = useInView(heroRef, { once: true })

    const { scrollYProgress } = useScroll()
    const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3])

    if (!post) {
        notFound()
    }

    const colors = categoryColors[post.category?.toLowerCase()] || categoryColors.marketing

    const relatedPosts = getBlogPosts()
        .filter((p) => p.id !== post.id)
        .slice(0, 4)

    return (
        <>
            {/* Hero Section - Full Width Background Image */}
            <section
                ref={heroRef}
                className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
            >
                {/* Background Image with Parallax */}
                <motion.div
                    style={{ scale: heroScale, opacity: heroOpacity }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-[#0a0a0a]" />
                </motion.div>

                {/* Animated background orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            x: [0, 30, 0],
                            y: [0, -20, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            x: [0, -40, 0],
                            y: [0, 30, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            x: [0, 20, 0],
                            y: [0, 40, 0],
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/15 rounded-full blur-[80px]"
                    />
                </div>

                <div className="container-custom relative z-10 pt-32 pb-20">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Category Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                            transition={{ duration: 0.6 }}
                            className="mb-6"
                        >
              <span className={`
                inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold tracking-wider
                bg-gradient-to-r ${colors.bg} text-white shadow-lg ${colors.glow}
              `}>
                <Sparkles className="w-4 h-4" />
                  {post.category?.toUpperCase()}
              </span>
                        </motion.div>

                        {/* Date */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="flex items-center justify-center gap-2 text-white/60 mb-8"
                        >
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm tracking-[0.15em]">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                }).toUpperCase()}
              </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-4xl md:text-5xl lg:text-7xl font-light text-white tracking-wide italic leading-tight"
                            style={{ fontFamily: 'serif' }}
                        >
                            {post.title.split(' ').map((word, i, arr) => (
                                <span key={i}>
                  {i === Math.floor(arr.length / 2) ? (
                      <span className={`bg-gradient-to-r ${colors.bg} bg-clip-text text-transparent`}>
                      {word}
                    </span>
                  ) : (
                      word
                  )}
                                    {i < arr.length - 1 ? ' ' : ''}
                </span>
                            ))}
                        </motion.h1>

                        {/* Reading time */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex items-center justify-center gap-2 text-white/40 mt-8"
                        >
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{post.readingTime} min read</span>
                        </motion.div>
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
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
                    >
                        <motion.div className={`w-1.5 h-1.5 bg-gradient-to-r ${colors.bg} rounded-full`} />
                    </motion.div>
                </motion.div>
            </section>

            {/* Content Section */}
            <section className="bg-[#0a0a0a] py-16 md:py-24 relative">
                {/* Subtle background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" />

                <div className="container-custom relative">
                    <div className="max-w-3xl mx-auto">
                        {/* Back Link */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-colors mb-12 group"
                            >
                                <motion.div
                                    whileHover={{ x: -4 }}
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </motion.div>
                                <span className="text-sm tracking-wider">BACK TO BLOG</span>
                            </Link>
                        </motion.div>

                        {/* Quote Block */}
                        <motion.blockquote
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative mb-16"
                        >
                            <div className={`absolute -left-4 top-0 w-1 h-full bg-gradient-to-b ${colors.bg} rounded-full`} />
                            <Quote className={`${colors.text} w-10 h-10 mb-4 opacity-50`} />
                            <p
                                className="text-2xl md:text-3xl text-white/90 font-light italic leading-relaxed pl-6"
                                style={{ fontFamily: 'serif' }}
                            >
                                {post.excerpt}
                            </p>
                        </motion.blockquote>

                        {/* Main Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="prose prose-invert prose-lg max-w-none mb-16"
                        >
                            <p className="text-white/60 leading-relaxed text-lg mb-8">
                                Lorem ipsum dolor sit amet consectetur. Varius tincidunt in euismod velit adipiscing auctor ullamcorper. Facilisi malesuada commodo urna rhoncus nunc commodo hendrerit amet lectus. Nulla commodo sed leo eu lectus diam pulvinar nascetur. Faucibus lacinia mi eu viverra pharetra odio. Sed suspendisse gravida.
                            </p>
                            <p className="text-white/60 leading-relaxed text-lg mb-8">
                                Erat odio tempor nisi mauris aenean pellentesque. Porta lectus quis ac turpis faucibus a cras massa tincidunt. Pellentesque purus nunc in diam enim faucibus sit dictum. Amet egestas enim pharetra leo risus praesent quam integer at.
                            </p>
                        </motion.div>

                        {/* Full Width Image with Glow */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative mb-16 group"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                            <div className="relative h-72 md:h-[500px] rounded-2xl overflow-hidden">
                                <Image
                                    src={post.coverImage}
                                    alt="Article image"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>

                        {/* Two Column Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="grid md:grid-cols-2 gap-12 mb-16"
                        >
                            <div className="relative">
                                <div className={`absolute -left-4 top-0 w-1 h-full bg-gradient-to-b ${colors.bg} rounded-full opacity-50`} />
                                <p className="text-white/60 leading-relaxed pl-6">
                                    Erat odio tempor nisi mauris aenean pellentesque. Porta lectus quis ac turpis faucibus a cras massa tincidunt. Pellentesque purus nunc in diam enim faucibus sit dictum. Amet egestas enim pharetra leo risus praesent quam integer at. Quis suspendisse nunc tempus proin. Eleifend aenean vestibulum fringilla arcu tincidunt at massa odio amet.
                                </p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full opacity-50" />
                                <p className="text-white/60 leading-relaxed pl-6">
                                    Habitant sit velit pretium metus pellentesque facilisis bibendum. Urna placerat nullam mi. Parturient sed arcu congue diam morbi gravida urna augue. Nibh viverra elit dolor lectus a maecenas lorem.
                                </p>
                            </div>
                        </motion.div>

                        {/* Two Images Side by Side */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="grid md:grid-cols-2 gap-6 mb-16"
                        >
                            <div className="relative h-56 md:h-72 rounded-xl overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                                <Image
                                    src={post.coverImage}
                                    alt="Article image 1"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="relative h-56 md:h-72 rounded-xl overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                                <Image
                                    src={post.coverImage}
                                    alt="Article image 2"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </motion.div>

                        {/* Final Paragraph */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="text-white/60 leading-relaxed text-lg mb-16">
                                Parturient sed arcu congue diam morbi gravida urna augue. Nibh viverra elit dolor lectus a maecenas lorem. Erat odio tempor nisi mauris aenean pellentesque. Porta lectus quis ac turpis faucibus a cras massa tincidunt.
                            </p>
                        </motion.div>

                        {/* Share Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-white/40 text-sm tracking-wider">SHARE</span>
                                <div className="flex gap-3">
                                    {[
                                        { icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://jaklabs.io/blog/${post.slug}`)}`, color: 'hover:bg-sky-500 hover:shadow-sky-500/50' },
                                        { icon: Linkedin, href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://jaklabs.io/blog/${post.slug}`)}&title=${encodeURIComponent(post.title)}`, color: 'hover:bg-blue-600 hover:shadow-blue-600/50' },
                                        { icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://jaklabs.io/blog/${post.slug}`)}`, color: 'hover:bg-blue-500 hover:shadow-blue-500/50' },
                                    ].map(({ icon: Icon, href, color }) => (
                                        <motion.a
                                            key={href}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`
                        w-11 h-11 rounded-full border border-white/10 flex items-center justify-center 
                        text-white/40 hover:text-white hover:border-transparent transition-all duration-300
                        hover:shadow-lg ${color}
                      `}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors.bg} animate-pulse`} />
                                <span className="text-white/40 text-sm">{post.readingTime} min read</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* More Articles Section */}
            {relatedPosts.length > 0 && (
                <section className="bg-[#0a0a0a] py-24 md:py-32 relative overflow-hidden">
                    {/* Background effects */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-cyan-500/5 rounded-full blur-[150px]" />
                    </div>

                    <div className="container-custom relative">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-20"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                                <span className="text-xs tracking-[0.3em] text-white/60 uppercase">Read More</span>
                            </div>
                            <h2
                                className="text-4xl md:text-6xl font-light text-white tracking-wide italic"
                                style={{ fontFamily: 'serif' }}
                            >
                                MORE{' '}
                                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  ARTICLES
                </span>
                            </h2>
                        </motion.div>

                        {/* Articles Grid - Alternating Layout */}
                        <div className="space-y-20 md:space-y-32">
                            {relatedPosts.map((relatedPost, index) => (
                                <MoreArticleCard
                                    key={relatedPost.id}
                                    post={relatedPost}
                                    index={index}
                                    isReversed={index % 2 !== 0}
                                />
                            ))}
                        </div>

                        {/* View All Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mt-20"
                        >
                            <Link href="/blog">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold tracking-wider hover:shadow-xl hover:shadow-purple-500/30 transition-shadow group"
                                >
                                    <span>VIEW ALL ARTICLES</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.div>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            )}
        </>
    )
}
