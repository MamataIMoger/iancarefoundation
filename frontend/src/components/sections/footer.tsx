// File: frontend/src/components/sections/footer.tsx
"use client";

import React, { type ReactNode } from "react";
import Link from "next/link";

type ContactItem = {
  title: string;
  value: string;
  icon: ReactNode;
};

export default function IANCaresFooter(): React.JSX.Element {
  const LOGO_URL = "/ian-cares-logo-remove.png";

  const BRAND = {
    yellow: "#FFC72C",
    teal: "#00ADB5",
    blackTransparent: "rgba(0, 0, 0, 0.8)",
  };

  const contactItems: ContactItem[] = [
    {
      title: "Call Us",
      value: "+91 97402 96297",
      icon: (
        <svg
          className="w-9 h-9 text-[#FFC72C]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
    },
    {
      title: "Mail us",
      value: "iancaresfoundation@gmail.com",
      icon: (
        <svg
          className="w-9 h-9 text-[#FFC72C]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8.5l9 5 9-5M21 6H3v12a2 2 0 002 2h14a2 2 0 002-2V6z"
          />
        </svg>
      ),
    },
    {
      title: "Visit Our Head Office",
      value:
        "'Ian Cares' Foundation, Quila, Kinnigoli Town Panchayat, Postal Code 574150, Dakshina Kannada Dist. Karnataka State, India",
      icon: (
        <svg
          className="w-9 h-9 text-[#FFC72C]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z"
          />
        </svg>
      ),
    },
  ];

  const navLinks: string[] = [
    "Home",
    "About",
    "Services",
    "Stories",
    "Gallery",
    "Blog",
    "Get Involved",
    "Contact Us",
    "Privacy Policy",
    "Sitemap",
  ];

  return (
    <footer
      className="w-full text-white border-t border-white/20 shadow-inner"
      style={{ background: BRAND.blackTransparent, backdropFilter: "blur(8px)" }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* CONTACT ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8 border-b border-white/20">
          {contactItems.map((c: ContactItem, i: number) => (
            <div key={i} className="flex items-start gap-3">
              <div>{c.icon}</div>
              <div>
                <h4 className="text-lg font-semibold text-[#FFC72C]">{c.title}</h4>
                <p className="text-sm font-medium text-gray-200">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* LOGO / DESCRIPTION / NAV */}
        <div className="text-center py-10">
          <img
            src={LOGO_URL}
            alt="IAN Cares Logo"
            className="h-28 mx-auto mb-4 object-contain"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.onerror = null;
              target.src = "https://placehold.co/90x90/FFFFFF/007681?text=Logo";
            }}
          />

          <p className="max-w-lg mx-auto text-lg leading-relaxed mb-6 text-gray-300">
            We offer a sanctuary for healing and transformation, providing holistic therapies amidst serene natural
            surroundings.
          </p>

          {/* NAV LINKS */}
          <div className="flex justify-center flex-wrap gap-x-8 gap-y-2 mb-6">
            {navLinks.map((n) => {
              let href = `/${n.replace(/\s+/g, "").toLowerCase()}`;
              let target: string | undefined = undefined;
              let rel: string | undefined = undefined;

              if (n === "Home") href = "/";
              if (n === "Get Involved") href = "/get-involved";
              if (n === "Contact Us") href = "/contact";
              if (n === "Privacy Policy") href = "/privacy";
              if (n === "Sitemap") {
                href = "https://maps.app.goo.gl/cCDt8rgp9Mqc7WWR7";
                target = "_blank";
                rel = "noopener noreferrer";
              }

              if (target) {
                return (
                  <a
                    key={n}
                    href={href}
                    target={target}
                    rel={rel}
                    className="text-sm uppercase tracking-widest font-semibold text-gray-200 hover:text-[#FFC72C] transition-colors"
                  >
                    {n}
                  </a>
                );
              }

              return (
                <Link
                  key={n}
                  href={href}
                  className="text-sm uppercase tracking-widest font-semibold text-gray-200 hover:text-[#FFC72C] transition-colors"
                >
                  {n}
                </Link>
              );
            })}
          </div>

          {/* SOCIAL ICONS */}
          <div className="flex justify-center gap-6 mt-6">
            <a
              href="https://www.instagram.com/iancaresfoundation/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FFC72C] transition"
              aria-label="Ian Cares Instagram"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.5 2h9A5.5 5.5 0 0122 7.5v9A5.5 5.5 0 0116.5 22h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2zm0 2A3.5 3.5 0 004 7.5v9A3.5 3.5 0 007.5 20h9a3.5 3.5 0 003.5-3.5v-9A3.5 3.5 0 0016.5 4h-9zm4.5 3.25A4.75 4.75 0 1112 16.75 4.75 4.75 0 0112 7.25zm0 2A2.75 2.75 0 1014.75 12 2.75 2.75 0 0012 9.25zm4.75-.75a.75.75 0 11.75-.75.75.75 0 01-.75.75z" />
              </svg>
            </a>

            <a
              href="https://www.linkedin.com/company/ian-cares-foundation/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FFC72C] transition"
              aria-label="Ian Cares LinkedIn"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3A2 2 0 0121 5v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zM8.34 17.34V10.7H6v6.64h2.34zm-1.17-7.72a1.35 1.35 0 11.01-2.7 1.35 1.35 0 01-.01 2.7zM18 17.34v-3.56c0-1.9-.4-3.37-2.57-3.37-1.11 0-1.86.61-2.17 1.18h-.03V10.7H11v6.64h2.23v-3.29c0-.87.17-1.72 1.25-1.72 1.06 0 1.08.99 1.08 1.78v3.23H18z" />
              </svg>
            </a>

            <a
              href="https://www.facebook.com/IanCaresFoundation/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FFC72C] transition"
              aria-label="Ian Cares Facebook"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 10-11.5 9.95V15h-2v-3h2v-2.3C10.5 7.9 11.92 6.5 14.4 6.5c1.02 0 2.1.18 2.1.18v2.3h-1.18c-1.16 0-1.52.72-1.52 1.45V12h2.58l-.41 3h-2.17v6.95A10 10 0 0022 12z" />
              </svg>
            </a>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/20 mt-6">
          <div className="py-5 flex flex-col md:flex-row items-center justify-between gap-1 text-gray-300">
            <p className="text-sm font-semibold">
              © {new Date().getFullYear()}{" "}
              <span className="font-bold text-[#FFC72C]">Ian Cares Foundation</span>. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm font-semibold">
              <Link href="/privacy" className="hover:text-[#FFC72C] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#FFC72C] transition-colors">
                Terms
              </Link>
            </div>
            <div className="py-4">
          <Link href="/admin_login" className="hover:text-[#FFC72C] transition-colors">
            Admin Login
          </Link>
        </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
