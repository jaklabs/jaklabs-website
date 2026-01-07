'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    {
        name: 'Services',
        href: '/services',
        dropdown: [
            { name: 'Marketing Strategy', href: '/services#marketing' },
            { name: 'App Development', href: '/services#development' },
            { name: 'Brand Design', href: '/services#branding' },
            { name: 'SEO & Content', href: '/services#seo' },
        ],
    },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
]

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? 'bg-background/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
            }`}
        >
            <div className="container-custom">
                <div className="flex items-center justify-between h-20">
                    <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold font-heading">
              <span className="text-primary">JAK</span>
              <span className="text-white">Labs</span>
            </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <div
                                key={link.name}
                                className="relative"
                                onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link
                                    href={link.href}
                                    className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors py-2"
                                >
                                    <span>{link.name}</span>
                                    {link.dropdown && <ChevronDown className="w-4 h-4" />}
                                </Link>

                                {link.dropdown && (
                                    <AnimatePresence>
                                        {activeDropdown === link.name && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-full left-0 mt-2 w-56 bg-secondary border border-white/10 rounded-xl shadow-xl overflow-hidden"
                                            >
                                                {link.dropdown.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:block">
                        <Link href="/contact" className="btn-primary">
                            Get Started
                        </Link>
                    </div>

                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-secondary border-t border-white/10"
                    >
                        <div className="container-custom py-4 space-y-2">
                            {navLinks.map((link) => (
                                <div key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="block py-3 text-white/80 hover:text-white transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                </div>
                            ))}
                            <Link
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
