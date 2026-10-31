import Link from 'next/link'
import { Facebook, Linkedin, Instagram, Mail, Phone } from 'lucide-react'
import { EMAIL, MAILTO, PHONE_DISPLAY, PHONE_HREF } from '@/lib/business'

// Every link here now resolves. It previously carried ten that did not: eight
// /industries/* pages that had never been built, /careers, and /about#team —
// on every page of the site. The service anchors were dead too (#marketing,
// #development, #branding) and named offerings that are no longer sold.
//
// Slugs must match src/lib/industries.ts. A footer link is the cheapest thing
// on a site to leave broken and one of the most expensive to be caught on:
// somebody clicking "Healthcare" and getting a 404 has learned something about
// how carefully the rest of it was built.
const footerLinks = {
    company: [
        { name: 'About JD', href: '/about' },
        // Sitewide, so the two outbound links on /work are reachable from every
        // page rather than orphaned. A portfolio link nothing points at is a
        // link nothing crawls.
        { name: 'Work', href: '/work' },
        { name: 'Engineering', href: '/engineering' },
        { name: 'Hood Dev (school)', href: '/hood-dev' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '/contact' },
    ],
    services: [
        { name: 'AI Reliability Audit', href: '/services#ai-reliability' },
        { name: 'LLM Integration Sprint', href: '/services#llm-sprint' },
        { name: 'Ops-Automation Build', href: '/services#ops-automation' },
        { name: 'Embedded Engineering', href: '/services#embedded' },
        { name: 'Free website audit', href: '/website-audit' },
        { name: 'Aura Rank (free tool)', href: '/aura' },
        { name: '水見式 Nen test (free tool)', href: '/nen' },
    ],
    industries: [
        { name: 'Home & Trade Services', href: '/industries/home-and-trade-services' },
        { name: 'Health, Wellness & Beauty', href: '/industries/health-wellness-and-beauty' },
        { name: 'Financial & Insurance', href: '/industries/financial-and-insurance' },
        { name: 'Real Estate & Property', href: '/industries/real-estate-and-property' },
        { name: 'Staffing & Recruiting', href: '/industries/staffing-and-recruiting' },
        { name: 'Logistics & Field Ops', href: '/industries/logistics-and-field-operations' },
        { name: 'Technology & AI', href: '/industries/technology-and-ai-products' },
        { name: 'All industries', href: '/industries' },
    ],
}

const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/jakthedev', label: 'Facebook' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/jd-alexander-kemp-99b07064/', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/jaklabs.io', label: 'Instagram' },
]

export function Footer() {
    return (
        <footer className="bg-secondary-dark border-t border-white/10">
            <div className="container-custom section-padding">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10 md:gap-12">
                    <div className="col-span-2">
                        <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-bold font-heading">
                <span className="text-primary">JAK</span>
                <span className="text-white">Labs</span>
              </span>
                        </Link>
                        {/* The old copy read "Premier marketing consulting and application
    development... We help you stand out" — two services next.config.mjs
    redirects away from, in a voice that implies a team. This sits on
    EVERY page, so it was the most-repeated sentence on the site and the
    last place the old positioning survived after the logo tagline and
    the share card were fixed. First person, because JAK Labs is one
    person and that is the argument. */}
                        <p className="text-white/60 mb-6 max-w-md">
                            I build the scheduling, quoting and invoicing software that lets a local
                            service business run without its owner. One engineer, Lansing, Michigan.
                        </p>
                        <div className="space-y-3">
                            {/* The address and phone come from src/lib/business.ts and are
    hard-coded nowhere — check-contact.mjs fails the build on a copy.
    This comment USED TO SAY the apex had no MX record and that mail
    was configured on email.jaklabs.io. Both were false (checked
    2026-10-31): the apex resolves 10 inbound-smtp.us-east-1.amazonaws.com,
    and email.jaklabs.io has no MX, no A and no CNAME at all. Its
    conclusion -- do not publish jdakemp@jaklabs.io -- happens to be
    right, because that address is a verified SES SENDING identity and
    not an alias on either WorkMail user, so mail to it bounces. Right
    answer, invented reason: see src/lib/business.ts. */}
                            <a href={MAILTO} className="flex items-center space-x-3 text-white/60 hover:text-primary transition-colors">
                                <Mail className="w-5 h-5" />
                                <span>{EMAIL}</span>
                            </a>
                            <a href={PHONE_HREF} className="flex items-center space-x-3 text-white/60 hover:text-primary transition-colors">
                                <Phone className="w-5 h-5" />
                                <span>{PHONE_DISPLAY}</span>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 md:space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-white/60 hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Services</h4>
                        <ul className="space-y-2 md:space-y-3">
                            {footerLinks.services.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-white/60 hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Industries</h4>
                        <ul className="space-y-2 md:space-y-3">
                            {footerLinks.industries.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-white/60 hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-white/40 text-sm">
                        &copy; {new Date().getFullYear()} JAKLabs. All rights reserved.
                    </p>

                    <div className="flex items-center space-x-4">
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-all"
                                aria-label={social.label}
                            >
                                <social.icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
