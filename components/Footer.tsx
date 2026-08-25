// components/Footer.tsx
// Footer — links, branding, copyright — stitch mockup match

import Link from "next/link";

// Footer link sections — stitch mockup theke newa structure
const FOOTER_SECTIONS = [
  {
    title: "Platform",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Verified Status Guide", href: "/verified-guide" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Tech Stacks", href: "/companies?filter=stacks" },
      { label: "Job Board", href: "/jobs" },
      { label: "Reviews", href: "/companies" },
      { label: "Salaries", href: "/salaries" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Support", href: "/support" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Employer Solutions", href: "/employer" },
    ],
  },
];

export default function Footer() {
  // Current year — copyright e use
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-white border-t border-[var(--outline-variant)] mt-auto"
      role="contentinfo"
    >
      <div className="container">
        {/* ─── MAIN FOOTER CONTENT ───────────────────────────────────────── */}
        <div className="py-16 md:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Brand column — left side (2 columns on large screens) */}
          <div className="lg:col-span-2">
            {/* TechTribe wordmark */}
            <Link href="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs font-mono">TT</span>
              </div>
              <span className="text-[var(--primary)] font-bold text-lg">TechTribe</span>
            </Link>

            {/* Tagline — comfortable max width */}
            <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed max-w-sm">
              The definitive discovery platform for Bangladesh&apos;s growing IT ecosystem. Empowering professionals through transparency and verified data.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              {/* Section title — JetBrains Mono, uppercase */}
              <h3 className="font-mono text-xs font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest mb-5">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-3.5" role="list">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ─── BOTTOM BAR ────────────────────────────────────────────────── */}
        {/* Copyright + system status — stitch mockup match */}
        <div className="border-t border-[var(--outline-variant)] py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[11px] text-[var(--on-surface-variant)] uppercase tracking-widest">
            © {year} TechTribe Bangladesh. All rights reserved.
          </p>

          {/* System status indicator */}
          <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--on-surface-variant)] uppercase tracking-widest">
            {/* Green dot — system online indicator */}
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            System Status: Optimal
          </div>
        </div>
      </div>
    </footer>
  );
}
