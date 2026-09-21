import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

type Winner = 'cold' | 'refined' | 'none'

type Row = {
  metric: string
  cold: string
  refined: string
  /** Which column is the better outcome for a home cook. Marked with the --good colour. */
  winner: Winner
}

const ROWS: Row[] = [
  { metric: 'Extraction', cold: 'Slow mechanical wood-press, under 40–50°C', refined: 'Hexane solvent + high heat', winner: 'cold' },
  { metric: 'Vitamin E retained', cold: '90–95%', refined: '30–50%', winner: 'cold' },
  { metric: 'Natural antioxidants', cold: 'Fully intact', refined: 'Mostly destroyed by bleaching', winner: 'cold' },
  { metric: 'Trans fats formed', cold: 'None', refined: 'Small amounts, from deodorising', winner: 'cold' },
  { metric: 'Chemical residue', cold: 'None', refined: 'Trace hexane possible (within FSSAI limits)', winner: 'cold' },
  { metric: 'Flavour', cold: 'Full, natural', refined: 'Neutral — stripped intentionally', winner: 'cold' },
  { metric: 'Smoke point', cold: 'Moderate, varies', refined: 'Higher — better for deep frying', winner: 'refined' },
  { metric: 'Shelf life', cold: '6–9 months', refined: '12–18 months', winner: 'refined' },
]

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true" className="shrink-0">
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Cell({ text, win }: { text: string; win: boolean }) {
  return (
    <span className={`inline-flex items-start gap-2 ${win ? 'font-semibold text-secondary' : ''}`}>
      {win && (
        <span className="mt-[0.3em]">
          <Check />
          <span className="sr-only">(better)</span>
        </span>
      )}
      <span>{text}</span>
    </span>
  )
}

export function ColdPressVsRefined() {
  return (
    <section id="why-cold-pressed" className="section scroll-mt-16 pt-10 sm:pt-16">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            eyebrow="Cold-pressed vs refined"
            title="What refining takes out — and what pressing keeps in."
            intro="Same seed, very different oil. Refined oil wins on shelf life and deep-frying — we say so below. On everything that makes oil worth eating, pressing wins."
          />
        </Reveal>

        {/* Desktop / tablet table */}
        <Reveal className="mt-12 hidden md:block" delay={0.1}>
          <div className="card overflow-hidden">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Comparison of cold-pressed and refined oil across eight metrics</caption>
              <thead>
                <tr className="bg-sesame text-[#F1E7D6]">
                  <th scope="col" className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em]">Metric</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em]">
                    Cold-pressed <span className="font-heading normal-case tracking-heading text-dk-accent">(Kedar’s)</span>
                  </th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em]">Refined</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.metric} className="border-t divider align-top">
                    <th scope="row" className="px-6 py-4 font-heading text-lg font-semibold tracking-heading">
                      {r.metric}
                    </th>
                    <td className="px-6 py-4">
                      <Cell text={r.cold} win={r.winner === 'cold'} />
                    </td>
                    <td className="px-6 py-4 text-soft">
                      <Cell text={r.refined} win={r.winner === 'refined'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* Mobile stacked layout */}
        <ul className="mt-10 grid gap-4 md:hidden">
          {ROWS.map((r, i) => (
            <Reveal as="li" key={r.metric} delay={Math.min(i, 3) * 0.05} className="card p-5">
              <h3 className="font-heading text-xl font-semibold tracking-heading">{r.metric}</h3>
              <dl className="mt-4 grid gap-3">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Cold-pressed (Kedar’s)</dt>
                  <dd className="mt-1">
                    <Cell text={r.cold} win={r.winner === 'cold'} />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-soft">Refined</dt>
                  <dd className="mt-1 text-soft">
                    <Cell text={r.refined} win={r.winner === 'refined'} />
                  </dd>
                </div>
              </dl>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1} className="mt-8">
          <aside
            className="rounded-2xl border-l-4 border-caution bg-caution/[0.06] p-6 sm:p-8 dark:bg-caution/[0.14]"
            aria-labelledby="transfat-heading"
          >
            <h3 id="transfat-heading" className="font-heading text-xl font-semibold tracking-heading text-caution dark:text-[#E0866B]">
              On refined oil and heart health
            </h3>
            <p className="mt-3 max-w-3xl">
              The deodorising step in refining (steam-stripping oil at 220–270°C) can generate small amounts of
              industrial trans fats — the category the WHO’s REPLACE initiative targets globally, since diets high in
              trans fats are linked to increased cardiovascular disease risk. Cold-pressing skips this step entirely.
            </p>
            <p className="mt-3 text-sm text-soft">This is general nutrition information, not medical advice.</p>
          </aside>
        </Reveal>
      </div>
    </section>
  )
}
