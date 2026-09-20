import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { WhatsAppIcon } from './Header'
import { WHATSAPP_URL } from '../lib/site'

const BULLETS = [
  { title: 'Bulk pricing on all four oils', body: 'Mustard, cold-pressed coconut, virgin coconut and sesame — priced per litre by volume.' },
  { title: 'Flexible container sizes', body: 'From retail bottles to 5, 15 and 20-litre tins and cans. Custom labelling on request.' },
  { title: 'Reliable recurring supply agreements', body: 'Weekly or monthly schedules so your kitchen or shelf never runs dry.' },
]

export function B2B() {
  return (
    <section id="b2b" className="section panel scroll-mt-16 border-y divider">
      <div className="container-site grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <SectionHeading
            eyebrow="B2B / Wholesale"
            title="Supplying shops, kitchens & distributors"
            intro="Beyond retail, Kedar’s supplies bulk quantities to grocers, restaurants, and distributors across Secunderabad and beyond. Custom packaging and recurring supply schedules available."
          />
          <a href={`${WHATSAPP_URL}?text=${encodeURIComponent('Hi Kedar’s, I’d like to discuss a wholesale order.')}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8">
            <WhatsAppIcon />
            Discuss a wholesale order
          </a>
        </Reveal>
        <ul className="grid gap-4">
          {BULLETS.map((b, i) => (
            <Reveal as="li" key={b.title} delay={0.08 + i * 0.07} className="card flex gap-4 p-5 sm:p-6">
              <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mustard/15 text-accent">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <h3 className="font-heading text-xl font-semibold tracking-heading">{b.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-soft">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
