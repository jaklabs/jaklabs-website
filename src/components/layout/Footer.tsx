import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone } from 'lucide-react'

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
    { icon: Twitter, href: 'REMOVE_TWITTER', label: 'Twitter' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/jd-alexander-kemp-99b07064/', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/jaklabs.io?igsh=eHhmYnBvOXc4eGQ1&utm_source=qr', label: 'Instagram' },
]

export function Footer() {
    return (
        <footer className="bg-secondary-dark border-t border-white/10">
            <div className="container-custom section-padding">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-bold font-heading">
                <span className="text-primary">JAK</span>
                <span className="text-white">Labs</span>
              </span>
                        </Link>
                        <p className="text-white/60 mb-6 max-w-md">
                            Premier marketing consulting and application development for service-based businesses.
                            We help you stand out, attract clients, and grow your business.
                        </p>
                        <div className="space-y-3">
                            {/* NOT jdakemp@jaklabs.io — the apex domain has no MX record, so that
    address receives nothing. Mail is configured on email.jaklabs.io.
    Add an MX record on the apex (or Google Workspace) and this can
    become the professional address everywhere. */}
                            <a href="mailto:jdakemp@gmail.com" className="flex items-center space-x-3 text-white/60 hover:text-primary transition-colors">
                                <Mail className="w-5 h-5" />
                                <span>jdakemp@gmail.com</span>
                            </a>
                            <a href="tel:+15175057135" className="flex items-center space-x-3 text-white/60 hover:text-primary transition-colors">
                                <Phone className="w-5 h-5" />
                                <span>(517) 505-7135</span>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-3">
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
                        <ul className="space-y-3">
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
                        <ul className="space-y-3">
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
