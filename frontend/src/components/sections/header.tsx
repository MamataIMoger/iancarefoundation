"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Phone } from "lucide-react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header
        className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-md shadow-md transition-all duration-300"
      >
        <div className="section-container flex justify-between items-center py-2 md:py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-transparent relative">
              <img
                src="/ian-cares-logo-remove.png.png"
                alt="Ian Cares Foundation"
                className="absolute w-[150%] h-[150%] object-contain scale-110 md:scale-125 transition-all duration-300"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 items-center text-sm md:text-base font-semibold">
            <Link
              href="/"
              className="text-[#0A4D68] hover:text-[#EFC219] transition-colors duration-300"
            >
              HOME
            </Link>
            <Link
              href="/about"
              className="text-[#0A4D68] hover:text-[#EFC219] transition-colors duration-300"
            >
              ABOUT US
            </Link>
            <Link
              href="/services"
              className="text-[#0A4D68] hover:text-[#EFC219] transition-colors duration-300"
            >
              SERVICES
            </Link>
            <Link
              href="/stories"
             className="text-[#0A4D68] hover:text-[#EFC219] transition-colors duration-300"
            >
              STORIES
            </Link>
            <Link
              href="/gallery"
             className="text-[#0A4D68] hover:text-[#EFC219] transition-colors duration-300"
            >
              GALLERY
            </Link>
            <Link
              href="/blog"
             className="text-[#0A4D68] hover:text-[#EFC219] transition-colors duration-300"
            >
              BLOG
            </Link>
            <Link
              href="/get-involved"
              className="text-[#0A4D68] hover:text-[#EFC219] transition-colors duration-300"
            >
              GET INVOLVED
            </Link>
          </nav>

          {/* Contact button (CTA) */}
          <Link
            href="/contact"
            className="hidden md:flex items-center gap-2 bg-[#EFC219] hover:bg-white text-[#0A4D68] hover:text-[#117EA0] text-sm md:text-base font-semibold px-4 md:px-5 py-2 rounded-full shadow-md transition-all duration-300 hover:shadow-lg"
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
          <div className="md:hidden bg-white/90 backdrop-blur-lg">
            <nav className="flex flex-col gap-4 p-4">
              <Link href="/" className="text-indigo-900 hover:text-[#EFC219] font-semibold">
                HOME
              </Link>
              <Link href="/about" className="text-indigo-900 hover:text-[#EFC219] font-semibold">
                ABOUT US
              </Link>
              <Link href="/services" className="text-indigo-900 hover:text-[#EFC219] font-semibold">
                SERVICES
              </Link>
              <Link href="/stories" className="text-indigo-900 hover:text-[#EFC219] font-semibold">
                STORIES
              </Link>
              <Link href="/blog" className="text-indigo-900 hover:text-[#EFC219] font-semibold">
                BLOG
              </Link>
              <Link href="/get-involved" className="text-indigo-900 hover:text-[#EFC219] font-semibold">
                GET INVOLVED
              </Link>

              {/* Mobile CTA */}
              <Link
                href="/contact"
                className="flex items-center gap-2 bg-[#EFC219] hover:bg-white text-[#0A4D68] hover:text-[#117EA0] px-6 py-2 rounded-full transition-colors font-semibold w-full justify-center"
              >
                <Phone size={18} />
                +91 8750075006
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
