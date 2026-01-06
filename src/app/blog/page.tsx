'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Calendar, Clock, ArrowRight, Search, Sparkles } from 'lucide-react'
import { getBlogPosts, categories } from '@/lib/blog-data'

interface BlogPost {
    id: string
    slug: string
    title: string
    excerpt: string
    coverImage: string
    category: string
    publishedAt: string
    readingTime: number
}

const categoryColors: Record<string, { bg: string; glow: string; text: string }> = {
    marketing: { bg: 'from-purple-500 to-pink-500', glow: 'shadow-purple-500/50', text: 'text-purple-300' },
    development: { bg: 'from-cyan-500 to-blue-500', glow: 'shadow-cyan-500/50', text: 'text-cyan-300' },
    design: { bg: 'from-pink-500 to-rose-500', glow: 'shadow-pink-500/50', text: 'text-pink-300' },
    business: { bg: 'from-amber-500 to-orange-500', glow: 'shadow-amber-500/50', text: 'text-amber-300' },
}

function BlogPostCard({
                          post,
                          index,
                          sectionInView
                      }: {
    post: BlogPost
    index: number
    sectionInView: boolean
}) {
    const cardRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(cardRef, {
        once: false,
        margin: '-35% 0px -35% 0px'
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
        setImageOffset({ x: x * 25, y: y * 25 })
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
                x: Math.sin(time) * 10,
                y: Math.cos(time * 0.8) * 10
            })
        }, 50)
        return () => clearInterval(interval)
    }, [isMobile, isInView])

    return (
        <motion.article
            ref={cardRef}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={sectionInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group"
        >
            <Link href={`/blog/${post.slug}`} className="block">
                <motion.div
                    animate={{
                        scale: isActive ? 1.02 : 1,
                        y: isActive ? -8 : 0
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`
            relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl overflow-hidden
            border border-white/5 transition-all duration-500
            ${isActive ? `shadow-2xl ${colors.glow}` : 'shadow-lg shadow-black/20'}
          `}
                >
                    {/* Animated gradient border */}
                    <div className={`
            absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500
            ${isActive ? 'opacity-100' : ''}
          `}>
                        <div className={`absolute inset-[-2px] bg-gradient-to-r ${colors.bg} rounded-2xl blur-sm`} />
                        <div className="absolute inset-[1px] bg-[#1a1a1a] rounded-2xl" />
                    </div>

                    {/* Image Container with Parallax */}
                    <div className="relative h-56 md:h-64 overflow-hidden rounded-t-2xl">
                        <motion.div
                            animate={{
                                x: imageOffset.x,
                                y: imageOffset.y,
                                scale: isActive ? 1.15 : 1.05
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

                        {/* Gradient Overlay */}
                        <div className={`
              absolute inset-0 transition-all duration-500
              ${isActive
                            ? `bg-gradient-to-t from-[#1a1a1a] via-black/40 to-transparent`
                            : 'bg-gradient-to-t from-[#1a1a1a] via-black/20 to-transparent'
                        }
            `} />

                        {/* Category Tag with glow */}
                        <motion.span
                            animate={{ scale: isActive ? 1.05 : 1 }}
                            className={`
                absolute top-4 left-4 z-20 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase
                bg-gradient-to-r ${colors.bg} text-white
                ${isActive ? `shadow-lg ${colors.glow}` : ''}
              `}
                        >
                            {post.category}
                        </motion.span>

                        {/* Sparkle effect on hover */}
                        {isActive && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute top-4 right-4 z-20"
                            >
                                <Sparkles className={`w-5 h-5 ${colors.text} animate-pulse`} />
                            </motion.div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-6 md:p-7">
                        <motion.h2
                            animate={{ x: isActive ? 4 : 0 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className={`
                text-xl md:text-2xl font-bold mb-3 transition-colors duration-300 line-clamp-2
                ${isActive ? 'text-white' : 'text-white/80'}
              `}
                        >
                            {post.title}
                        </motion.h2>
                        <p className={`
              text-sm mb-5 line-clamp-2 leading-relaxed transition-colors duration-300
              ${isActive ? 'text-white/70' : 'text-white/40'}
            `}>
                            {post.excerpt}
                        </p>

                        {/* Meta & Arrow */}
                        <div className="flex items-center justify-between">
                            <div className={`
                flex items-center gap-4 text-xs transition-colors duration-300
                ${isActive ? 'text-white/60' : 'text-white/30'}
              `}>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                    })}
                </span>
                                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                                    {post.readingTime} min
                </span>
                            </div>

                            {/* Animated Arrow Button */}
                            <motion.div
                                animate={{
                                    x: isActive ? 6 : 0,
                                    scale: isActive ? 1.15 : 1,
                                    rotate: isActive ? -45 : 0
                                }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                className={`
                  w-11 h-11 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${isActive
                                    ? `bg-gradient-to-r ${colors.bg} text-white shadow-lg ${colors.glow}`
                                    : 'bg-white/5 border border-white/10 text-white/40'
                                }
                `}
                            >
                                <ArrowRight className="w-5 h-5" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </Link>
        </motion.article>
    )
}

export default function BlogPage() {
    const posts = getBlogPosts()
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchFocused, setSearchFocused] = useState(false)

    const heroRef = useRef(null)
    const postsRef = useRef(null)

    const heroInView = useInView(heroRef, { once: true })
    const postsInView = useInView(postsRef, { once: true, margin: '-100px' })

    const filteredPosts = posts.filter((post) => {
        const matchesCategory = !selectedCategory || post.category.toLowerCase() === selectedCategory.toLowerCase()
        const matchesSearch = !searchQuery ||
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

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
                        src="/images/blogheader.jpg"
                        alt="Blog header"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0a0a0a]" />
                </div>

                {/* Animated background orbs */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            x: [0, 50, 0],
                            y: [0, -30, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            x: [0, -40, 0],
                            y: [0, 40, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            x: [0, 30, 0],
                            y: [0, 50, 0],
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/15 rounded-full blur-[80px]"
                    />
                </div>

                <div className="container-custom relative z-10 pt-32 pb-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
                        >
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-sm tracking-[0.2em] text-white/70 font-medium">LATEST BLOG</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-wider italic mb-6"
                            style={{ fontFamily: 'serif' }}
                        >
                            BLOG &{' '}
                            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                ARTICLES
              </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={heroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg text-white/50 max-w-2xl mx-auto"
                        >
                            Insights, strategies, and tips to help your business thrive in the digital age
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
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
                    >
                        <motion.div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Filters Section - scrolls on mobile, sticky on desktop */}
            <section className="bg-[#0a0a0a] py-8 md:py-10 border-b border-white/5 md:sticky md:top-0 z-40 md:backdrop-blur-xl md:bg-opacity-90">
                <div className="container-custom">
                    <div className="flex flex-col gap-4 md:gap-6 md:flex-row items-stretch md:items-center justify-between">
                        {/* Search */}
                        <motion.div
                            animate={{
                                scale: searchFocused ? 1.02 : 1,
                                boxShadow: searchFocused ? '0 0 30px rgba(168, 85, 247, 0.2)' : '0 0 0px rgba(168, 85, 247, 0)'
                            }}
                            className="relative w-full md:w-auto md:min-w-[350px]"
                        >
                            <Search className={`
                absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300
                ${searchFocused ? 'text-purple-400' : 'text-white/30'}
              `} />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                className={`
                  w-full pl-12 pr-4 py-3 md:py-4 bg-white/5 rounded-xl text-white 
                  focus:outline-none transition-all duration-300 placeholder:text-white/30
                  border ${searchFocused ? 'border-purple-500/50 bg-white/10' : 'border-white/10'}
                `}
                            />
                        </motion.div>

                        {/* Category Filter - horizontal scroll on mobile */}
                        <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-0 md:overflow-visible md:flex-wrap md:justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCategory(null)}
                                className={`
                  px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 whitespace-nowrap flex-shrink-0
                  ${!selectedCategory
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                                    : 'bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white'
                                }
                `}
                            >
                                ALL
                            </motion.button>
                            {categories.map((category) => {
                                const colors = categoryColors[category.slug] || categoryColors.marketing
                                const isSelected = selectedCategory === category.slug
                                return (
                                    <motion.button
                                        key={category.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedCategory(category.slug)}
                                        className={`
                      px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 whitespace-nowrap flex-shrink-0
                      ${isSelected
                                            ? `bg-gradient-to-r ${colors.bg} text-white shadow-lg ${colors.glow}`
                                            : 'bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white'
                                        }
                    `}
                                    >
                                        {category.name.toUpperCase()}
                                    </motion.button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Posts Grid */}
            <section ref={postsRef} className="bg-[#0a0a0a] py-16 md:py-24 relative">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" />

                <div className="container-custom relative">
                    {filteredPosts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map((post, index) => (
                                <BlogPostCard
                                    key={post.id}
                                    post={post}
                                    index={index}
                                    sectionInView={postsInView}
                                />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                                <Search className="w-8 h-8 text-white/30" />
                            </div>
                            <p className="text-white/50 text-lg">No articles found matching your criteria.</p>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="bg-[#0a0a0a] py-24 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 rounded-full blur-[120px]" />
                </div>

                <div className="container-custom relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl mx-auto text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                            <span className="text-sm text-white/60">NEWSLETTER</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Stay{' '}
                            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Updated
              </span>
                        </h2>
                        <p className="text-white/50 mb-10 text-lg">
                            Get the latest tips and insights delivered to your inbox.
                        </p>

                        <form className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-white/30"
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold tracking-wider rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-shadow"
                            >
                                SUBSCRIBE
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </section>
        </>
    )
}
