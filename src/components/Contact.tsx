import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { WhatsAppIcon } from './Header'
import { ADDRESS_LINES, HOURS, MAPS_URL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from '../lib/site'

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t divider py-6 first:border-t-0 first:pt-0">
      <h3 className="eyebrow">{label}</h3>
      <div className="mt-3">{children}</div>
    </div>
  )
}

export function Contact() {
  return (
    <section id="contact" className="section scroll-mt-16">
      <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <SectionHeading
            eyebrow="Contact"
            title="Visit the mill, or message us."
            intro="We’re in Kapra, Secunderabad. Walk in for a bottle, or WhatsApp us for rates and bulk orders."
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <WhatsAppIcon />
              WhatsApp Us
            </a>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Get Directions
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="card p-6 sm:p-8">
          <Item label="Address">
            <address className="not-italic leading-relaxed">
              <span className="font-heading text-xl font-semibold tracking-heading">Kedar’s</span>
              <br />
              {ADDRESS_LINES.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
          </Item>
          <Item label="Phone / WhatsApp">
            <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <a href={PHONE_TEL} className="font-heading text-2xl font-semibold tracking-heading hover:text-accent">
                {PHONE_DISPLAY}
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary"
              >
                <WhatsAppIcon />
                Open in WhatsApp
              </a>
            </p>
          </Item>
          <Item label="Hours">
            <dl className="grid max-w-xs grid-cols-[auto_1fr] gap-x-6 gap-y-1">
              {HOURS.map((h) => (
                <div key={h.days} className="contents">
                  <dt className="font-semibold">{h.days}</dt>
                  <dd className="text-soft">{h.time}</dd>
                </div>
              ))}
            </dl>
          </Item>
        </Reveal>
      </div>
    </section>
  )
}
