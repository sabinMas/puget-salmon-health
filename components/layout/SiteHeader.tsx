"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const nav = [
  { label: "Dashboard",   href: "/dashboard"   },
  { label: "Nations",     href: "/nations"     },
  { label: "Learn",       href: "/learn"       },
  { label: "Stewardship", href: "/stewardship" },
  { label: "About",       href: "/about"       },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-90">
          Puget Sound Salmon Health
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <nav aria-label="Primary navigation" className="hidden sm:block">
          <ul className="flex gap-6 text-sm font-medium">
            {nav.map(({ label, href }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={
                      active
                        ? "underline underline-offset-4"
                        : "opacity-80 hover:opacity-100 hover:underline underline-offset-4"
                    }
                    aria-current={active ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Hamburger button — visible on mobile only */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex sm:hidden flex-col justify-center gap-1.5 p-1"
        >
          <span
            className={`block h-0.5 w-6 bg-white transition-transform duration-200 ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-opacity duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-transform duration-200 ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <nav id="mobile-menu" aria-label="Mobile navigation" className="sm:hidden">
          <ul className="flex flex-col border-t border-white/20 text-sm font-medium">
            {nav.map(({ label, href }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block px-4 py-3 ${
                      active
                        ? "bg-white/10 underline underline-offset-4"
                        : "hover:bg-white/10"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
