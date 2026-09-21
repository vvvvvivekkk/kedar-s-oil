import { NAV, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from '../lib/site'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-sesame text-[#F1E7D6]">
      <div className="container-site py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="font-heading text-3xl font-semibold tracking-heading">Kedar’s</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#F1E7D6]/70">
              A family-run cold-pressed and virgin edible oil mill in Kapra, Secunderabad. Mustard, coconut, virgin
              coconut and sesame — pressed, not processed.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss-soft">Explore</p>
            <ul className="mt-4 grid gap-2 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="opacity-80 hover:opacity-100">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss-soft">Reach us</p>
            <ul className="mt-4 grid gap-2 text-sm">
              <li>
                <a href={PHONE_TEL} className="opacity-80 hover:opacity-100">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100">
                  WhatsApp
                </a>
              </li>
              <li className="opacity-80">Kapra, Secunderabad, Telangana 500103</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs leading-relaxed text-[#F1E7D6]/60">
          <p>
            Health and nutrition information on this page is general educational content, not medical advice.
          </p>
          <p className="mt-2">© {year} Kedar’s. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
