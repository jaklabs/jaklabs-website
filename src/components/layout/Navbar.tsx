'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type NavLink = { name: string; href: string; dropdown?: { name: string; href: string }[] }

// Hood Dev sits at the end, after the buying path.
//
// The nav's job is Services -> Free Audit -> Contact for a business owner. The
// school is a different product for a different person (a developer), so it is
// present and findable without interrupting that sequence. Putting it earlier
// would make the site look like it sells two unrelated things before a visitor
// has worked out what the first one is.
const navLinks: NavLink[] = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    // The three free things, under one item.
    //
    // Listing them flat would have made a nine-item header, and the tools would
    // have crowded out Services and Contact — the two links that actually earn
    // money. Grouped, they stay one hover away and the buying path stays
    // legible.
    //
    // The parent still goes somewhere: /website-audit is the highest-intent
    // page on the site, so a click that never opens the menu lands on the best
    // of the three rather than a dead heading.
    {
        name: 'Free Tools',
        href: '/website-audit',
        dropdown: [
            { name: 'Website Audit', href: '/website-audit' },
            { name: 'Aura Rank', href: '/aura' },
            { name: '水見式 Nen Test', href: '/nen' },
        ],
    },
    { name: 'Blog', href: '/blog' },
    // The two products, grouped — same reasoning as Free Tools above.
    //
    // Hood Dev was a flat item until Verdikt needed a door too. Adding a second
    // flat item would have made an eight-item header and pushed Contact towards
    // the edge, so they share one. "Products" rather than "Services" on purpose:
    // Services is client work I sell my time for, these are things that exist
    // whether or not anyone buys them, and collapsing that distinction in the nav
    // would make the pricing conversation harder later.
    //
    // The parent goes to /hood-dev, the older and better-developed of the two, so
    // a click that never opens the menu still lands somewhere real.
    {
        name: 'Products',
        href: '/hood-dev',
        dropdown: [
            { name: 'Hood Dev', href: '/hood-dev' },
            { name: 'Verdikt', href: '/verdikt' },
            { name: 'Ops Platform', href: '/ops-platform' },
        ],
    },
    // Engineering gets its own top-level slot rather than a dropdown.
    //
    // It used to be reachable only from the footer and /about, on the reasoning
    // that a local business owner never needs it. True — but the reader it IS
    // for (an engineering lead deciding whether to hand a customer relationship
    // to a contractor) arrives looking for exactly this, and burying the page
    // that argues for the contract work behind two other links cost more than
    // the extra nav item does.
    { name: 'Engineering', href: '/engineering' },
    { name: 'Contact', href: '/contact' },
]

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const [mobileDropdown, setMobileDropdown] = useState<string | null>(null)

    // The dropdown closed the instant the cursor left the trigger, which made it
    // very hard to actually reach — you had to travel straight down, and any
    // diagonal path towards an item dismissed the menu first. Two things caused
    // that and both are fixed:
    //
    //   1. A DEAD GAP. The panel used `mt-2`, so 8px of nothing sat between the
    //      trigger and the menu. That gap belonged to no element, so crossing it
    //      fired mouseleave. The margin is now padding INSIDE the positioned
    //      wrapper, so the hoverable area is continuous while the menu still
    //      looks detached.
    //
    //   2. NO GRACE PERIOD. Closing is now deferred, so a cursor that clips a
    //      neighbouring item on its way down does not lose the menu. Re-entering
    //      cancels the pending close.
    //
    // 220ms is long enough to cross a corner and short enough that the menu never
    // feels stuck open.
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const openDropdown = (name: string) => {
        if (closeTimer.current) clearTimeout(closeTimer.current)
        setActiveDropdown(name)
    }
    const scheduleClose = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current)
        closeTimer.current = setTimeout(() => setActiveDropdown(null), 220)
    }
    useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current) }, [])

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

                    <div className="hidden lg:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <div
                                key={link.name}
                                className="relative"
                                onMouseEnter={() => link.dropdown && openDropdown(link.name)}
                                onMouseLeave={() => link.dropdown && scheduleClose()}
                            >
                                <Link
                                    href={link.href}
                                    className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors py-2"
                                >
                                    <span>{link.name}</span>
                                    {link.dropdown && <ChevronDown className="w-4 h-4" />}
                                </Link>

                                {/* Always mounted, hidden by opacity — NOT by AnimatePresence.
                                    *
                                    * It used to unmount when closed, which meant the five pages
                                    * behind these two menus (/website-audit, /aura, /nen,
                                    * /hood-dev, /verdikt) had no <a> pointing at them in any
                                    * served HTML. A crawler reads the response, not a hover, so
                                    * grouping those items into dropdowns had quietly cut every one
                                    * of them off from the site's internal linking — the exact
                                    * reach the grouping was meant to give them.
                                    *
                                    * Kept in the DOM and animated instead. pointer-events-none and
                                    * aria-hidden keep it out of the way of a mouse and a screen
                                    * reader while closed; the href is there either way. */}
                                {link.dropdown && (
                                    <motion.div
                                        initial={false}
                                        animate={
                                            activeDropdown === link.name
                                                ? { opacity: 1, y: 0 }
                                                : { opacity: 0, y: 10 }
                                        }
                                        transition={{ duration: 0.2 }}
                                        aria-hidden={activeDropdown !== link.name}
                                        className={`absolute top-full left-0 pt-2 w-56 ${
                                            activeDropdown === link.name ? '' : 'pointer-events-none'
                                        }`}
                                    >
                                        <div className="bg-secondary border border-white/10 rounded-xl shadow-xl overflow-hidden">
                                            {link.dropdown.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    tabIndex={activeDropdown === link.name ? undefined : -1}
                                                    className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="hidden lg:block">
                        <Link href="/contact" className="btn-primary">
                            Get Started
                        </Link>
                    </div>

                    <button
                        className="lg:hidden text-white p-2"
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
                        className="lg:hidden bg-secondary border-t border-white/10"
                    >
                        <div className="container-custom py-4 space-y-2">
                            {navLinks.map((link) => (
                                <div key={link.name}>
                                    {link.dropdown ? (
                                        <>
                                            <button
                                                className="flex items-center justify-between w-full py-3 text-white/80 hover:text-white transition-colors"
                                                onClick={() =>
                                                    setMobileDropdown(
                                                        mobileDropdown === link.name ? null : link.name
                                                    )
                                                }
                                            >
                                                <span>{link.name}</span>
                                                <ChevronDown
                                                    className={`w-4 h-4 transition-transform duration-200 ${
                                                        mobileDropdown === link.name ? 'rotate-180' : ''
                                                    }`}
                                                />
                                            </button>
                                            <AnimatePresence>
                                                {mobileDropdown === link.name && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="pl-4 border-l border-white/10 ml-2 space-y-1">
                                                            {link.dropdown.map((item) => (
                                                                <Link
                                                                    key={item.name}
                                                                    href={item.href}
                                                                    className="block py-2 text-white/60 hover:text-white transition-colors text-sm"
                                                                    onClick={() => {
                                                                        setIsOpen(false)
                                                                        setMobileDropdown(null)
                                                                    }}
                                                                >
                                                                    {item.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className="block py-3 text-white/80 hover:text-white transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
