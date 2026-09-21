import { Reveal } from './Reveal'
import { WhatsAppIcon } from './Header'
import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from '../lib/site'

export function Pricing() {
  return (
    <section id="pricing" className="tone-deep scroll-mt-16 pb-16 sm:pb-24">
      <div className="container-site">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-3xl bg-sesame px-6 py-12 text-[#F1E7D6] sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-mustard/40 to-moss/30 blur-3xl"
            />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="eyebrow !text-moss-soft">Pricing</p>
                <h2 className="h-section mt-4">Current price list is being finalised.</h2>
                <p className="mt-5 max-w-xl text-lg text-[#F1E7D6]/80">
                  Message us on WhatsApp for today’s rate per litre on any oil, retail or bulk. Rates move with the
                  seed market, so we quote fresh rather than post a stale number.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-mustard text-sesame hover:bg-dk-accent"
                >
                  <WhatsAppIcon />
                  Get today’s rate
                </a>
                <a href={PHONE_TEL} className="btn text-[#F1E7D6] shadow-[inset_0_0_0_1.5px_rgba(241,231,214,0.35)] hover:shadow-[inset_0_0_0_1.5px_#E0A83B]">
                  Call {PHONE_DISPLAY}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
