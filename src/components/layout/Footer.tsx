import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone } from 'lucide-react'

const footerLinks = {
    company: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Team', href: '/about#team' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' },
    ],
    services: [
        { name: 'Marketing Strategy', href: '/services#marketing' },
        { name: 'App Development', href: '/services#development' },
        { name: 'Brand Design', href: '/services#branding' },
        { name: 'SEO & Content', href: '/services#seo' },
    ],
    industries: [
        { name: 'Real Estate', href: '/industries/real-estate' },
        { name: 'Trades', href: '/industries/trades' },
        { name: 'Home Services', href: '/industries/home-services' },
        { name: 'Professional', href: '/industries/professional' },
        { name: 'Healthcare', href: '/industries/healthcare' },
        { name: 'Legal', href: '/industries/legal' },
        { name: 'Automotive', href: '/industries/automotive' },
        { name: 'Restaurants', href: '/industries/restaurants' },
    ],
}

const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
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
                            <a href="mailto:hello@jaklabs.io" className="flex items-center space-x-3 text-white/60 hover:text-primary transition-colors">
                                <Mail className="w-5 h-5" />
                                <span>hello@jaklabs.io</span>
                            </a>
                            <a href="tel:+1234567890" className="flex items-center space-x-3 text-white/60 hover:text-primary transition-colors">
                                <Phone className="w-5 h-5" />
                                <span>(123) 456-7890</span>
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
