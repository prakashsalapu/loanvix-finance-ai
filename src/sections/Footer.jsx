import { motion } from 'framer-motion'
import { IndianRupee, Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram } from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'EMI Calculator', href: '#calculator' },
    { name: 'Analytics', href: '#analytics' },
    { name: 'Schedule', href: '#schedule' },
    { name: 'Features', href: '#features' }
  ],
  company: [
    { name: 'About Us', href: '#about' },
    { name: 'Careers', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Press', href: '#' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Help Centre', href: '#' },
    { name: 'Documentation', href: '#' }
  ]
}

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' }
]

function handleNav(href) {
  const el = document.querySelector(href)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 lg:gap-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); handleNav('#home') }}
              className="flex items-center gap-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg w-fit"
              aria-label="LoanVix home"
            >
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center" aria-hidden="true">
                <IndianRupee className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Loan<span className="gradient-text">Wise</span>
              </span>
            </a>
            <p className="text-sm text-gray-500 mb-5 max-w-xs leading-relaxed">
              Your trusted partner for smart financial planning. Calculate EMIs,
              analyse loans, and make informed decisions.
            </p>
            <address className="not-italic space-y-3">
              <a href="mailto:hello@loanvix.app" className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                hello@loanvix.app
              </a>
              <a href="tel:+911234567890" className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                +91 123 456 7890
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                Mumbai, India
              </div>
            </address>
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, links]) => (
            <div key={key}>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm capitalize">{key}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        if (link.href.startsWith('#')) {
                          e.preventDefault()
                          handleNav(link.href)
                        }
                      }}
                      className="text-sm text-gray-500 hover:text-blue-600 transition-colors focus:outline-none focus:underline"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mt-12 pt-8 sm:pt-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>&copy; 2024 LoanVix. All rights reserved.</p>
            <p>Designed for optimal financial planning.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
