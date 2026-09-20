import { Reveal } from './Reveal'

const STATS = [
  { value: '<40°C', label: 'Max temperature during pressing — true cold-press' },
  { value: '0', label: 'Hexane, bleach, or deodorising chemicals used' },
  { value: '90%+', label: 'Of natural Vitamin E retained vs refined oil' },
]

export function StatStrip() {
  return (
    <section aria-label="Key facts" className="border-y divider panel">
      <div className="container-site">
        <ul className="grid divide-y divider sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((s, i) => (
            <Reveal as="li" key={s.value} delay={i * 0.08} className="py-8 sm:px-8 sm:py-10 first:sm:pl-0 last:sm:pr-0">
              <p className="font-heading text-5xl font-semibold tracking-heading text-accent sm:text-6xl">{s.value}</p>
              <p className="mt-3 max-w-xs text-soft">{s.label}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
