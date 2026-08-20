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
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand column — left side */}
          <div className="md:col-span-1">
            {/* TechTribe wordmark */}
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="w-7 h-7 bg-[var(--primary)] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs font-mono">TT</span>
              </div>
              <span className="text-[var(--primary)] font-bold text-base">TechTribe</span>
            </Link>

            {/* Tagline */}
            <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed max-w-[200px]">
              The definitive discovery platform for Bangladesh&apos;s growing IT ecosystem. Empowering professionals through transparency and data.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              {/* Section title — JetBrains Mono, uppercase */}
              <h3 className="font-mono text-[11px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest mb-4">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2.5" role="list">
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
        {/* Copyright + system status — stitch mockup e aache */}
        <div className="border-t border-[var(--outline-variant)] py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[10px] text-[var(--on-surface-variant)] uppercase tracking-widest">
            © {year} TechTribe Bangladesh. All rights reserved.
          </p>

          {/* System status indicator */}
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--on-surface-variant)] uppercase tracking-widest">
            {/* Green dot — system online indicator */}
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            System Status: Optimal
          </div>
        </div>
      </div>
    </footer>
  );
}
