import { Reveal } from './Reveal'

const STATS = [
  { value: '<40°C', label: 'Max temperature during pressing — true cold-press' },
  { value: '0', label: 'Hexane, bleach, or deodorising chemicals used' },
  { value: '90%+', label: 'Of natural Vitamin E retained vs refined oil' },
]

/** Frosted-glass stat cards that overlap the bottom edge of the hero's 3D backdrop. */
export function StatStrip() {
  return (
    <section aria-label="Key facts" className="relative z-20 -mt-20 sm:-mt-24">
      <div className="container-site">
        <ul className="grid gap-4 sm:grid-cols-3">
          {STATS.map((s, i) => (
            <Reveal as="li" key={s.value} delay={i * 0.08} className="glass rounded-2xl p-6 sm:p-7">
              <p className="font-heading text-5xl font-semibold tracking-heading sm:text-[3.4rem]">{s.value}</p>
              <span aria-hidden="true" className="mt-4 block h-1 w-10 rounded-full bg-moss" />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-soft sm:text-base">{s.label}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
