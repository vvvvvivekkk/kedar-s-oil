import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const STEPS = [
  {
    n: '01',
    title: 'Wood-pressed extraction',
    body: 'Seeds are crushed slowly in a traditional ghani. The press never exceeds ~40–50°C, so heat-sensitive vitamins and aroma stay in the oil.',
  },
  {
    n: '02',
    title: 'No chemical refining',
    body: 'No solvents, no bleaching, no deodorising. The oil is settled and filtered — nothing is added and nothing is stripped away.',
  },
  {
    n: '03',
    title: 'Hand-checked quality',
    body: 'Every batch is checked by people who’ve run this mill for years — by colour, aroma and taste — before it’s bottled.',
  },
]

export function Process() {
  return (
    <section id="process" className="section scroll-mt-16">
      <div className="container-site">
        <Reveal>
          <SectionHeading eyebrow="Process" title="Three steps. No shortcuts." align="center" />
        </Reveal>
        <ol className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.1} className="relative">
              <div className="flex items-baseline gap-4 md:block">
                <span className="font-heading text-6xl font-semibold tracking-heading text-mustard/40 md:text-7xl" aria-hidden="true">
                  {s.n}
                </span>
                <span className="sr-only">Step {i + 1}:</span>
                <div className="md:mt-4 md:border-t md:divider md:pt-6">
                  <h3 className="font-heading text-2xl font-semibold tracking-heading">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-soft">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
