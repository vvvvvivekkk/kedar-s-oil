import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { BottleStatic } from './BottleStatic'

const POINTS = [
  {
    title: 'Hair',
    body: 'Reduces protein loss and breakage — virgin coconut oil penetrates the hair shaft rather than sitting on top of it.',
  },
  {
    title: 'Skin',
    body: 'A natural emollient that reduces moisture loss, with no fragrance or preservative added.',
  },
  {
    title: 'Food',
    body: 'A stable cooking oil with a ~175°C smoke point — right for everyday sautéing, tempering and baking.',
  },
]

export function VirginOilExplainer() {
  return (
    <section id="virgin" className="section tone-warm scroll-mt-16 border-y divider">
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <Reveal>
            <SectionHeading eyebrow="What “virgin” means" title="Virgin isn’t a marketing word. It describes the source." />
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed">
              <p>
                Virgin oil isn’t a marketing word — it describes the source. It’s pressed directly from the fresh fruit
                (fresh coconut meat or milk) in a single mechanical step, without first drying it into copra or storing
                it.
              </p>
              <p>
                Regular cold-pressed coconut oil is still pressed from dried copra without chemicals — it’s clean, but
                virgin oil skips a step further back in the chain.
              </p>
              <p>
                Because there’s no drying, no storage gap, and no heat, virgin oil holds the highest levels of
                polyphenols and antioxidants of any coconut oil — refined or otherwise.
              </p>
            </div>
          </Reveal>

          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {POINTS.map((p, i) => (
              <Reveal as="li" key={p.title} delay={0.1 + i * 0.07} className="card p-5">
                <h3 className="font-heading text-2xl font-semibold tracking-heading text-secondary">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-soft">{p.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={0.15} className="mx-auto w-full max-w-xs lg:max-w-sm">
          <figure className="card relative overflow-hidden p-8">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-moss/10 to-transparent" />
            <BottleStatic
              liquid="#F3EBDC"
              liquidDeep="#DDD0B8"
              className="relative mx-auto h-72 w-auto"
              title="A bottle of Kedar’s virgin coconut oil — clear, pale liquid"
            />
            <figcaption className="relative mt-4 text-center text-sm text-soft">
              Virgin coconut oil — pressed from fresh coconut, never copra.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
