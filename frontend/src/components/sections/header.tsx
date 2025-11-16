"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Phone } from "lucide-react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-14 h-14 relative">
            <img
              src="/ian-cares-logo-remove.png.png"
              alt="Ian Cares Foundation"
              className="absolute inset-0 w-full h-full object-contain scale-110 transition-all duration-300"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center text-sm md:text-base font-semibold">
          {[
            { href: "/", label: "HOME" },
            { href: "/about", label: "ABOUT US" },
            { href: "/services", label: "SERVICES" },
            { href: "/stories", label: "STORIES" },
            { href: "/gallery", label: "GALLERY" },
            { href: "/blog", label: "BLOG" },
            { href: "/get-involved", label: "GET INVOLVED" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[#0A4D68] hover:text-[#EFC219] transition-colors duration-300"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Contact button (CTA) */}
        <Link
          href="/contact"
          className="hidden md:flex items-center gap-2 bg-[#EFC219] hover:bg-white text-[#0A4D68] hover:text-[#117EA0] text-sm md:text-base font-semibold px-5 py-2 rounded-full shadow-md transition-all duration-300 hover:shadow-lg"
        >
          <Phone size={18} />
          +91&nbsp;8750075006
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#117EA0]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-lg px-4 pb-4">
          <nav className="flex flex-col gap-4 pt-4 font-semibold text-indigo-900">
            {[
              { href: "/", label: "HOME" },
              { href: "/about", label: "ABOUT US" },
              { href: "/services", label: "SERVICES" },
              { href: "/stories", label: "STORIES" },
              { href: "/gallery", label: "GALLERY" },
              { href: "/blog", label: "BLOG" },
              { href: "/get-involved", label: "GET INVOLVED" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="hover:text-[#EFC219]">
                {label}
              </Link>
            ))}

            {/* Mobile CTA */}
            <Link
              href="/contact"
              className="flex items-center gap-2 bg-[#EFC219] hover:bg-white text-[#0A4D68] hover:text-[#117EA0] px-6 py-2 rounded-full transition-colors justify-center"
            >
              <Phone size={18} />
              +91 8750075006
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
