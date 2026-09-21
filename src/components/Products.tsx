import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { BottleCard } from '../three/BottleCard'
import { WhatsAppIcon } from './Header'
import { WHATSAPP_URL } from '../lib/site'

type Product = {
  name: string
  tag: string
  description: string
  liquid: string
  liquidDeep: string
  /** Label stripe/subtitle colour — distinct per oil so the four cards read as different products, not one recoloured icon. */
  accent: string
}

const PRODUCTS: Product[] = [
  {
    name: 'Mustard Oil',
    tag: 'Kachi ghani',
    description:
      'Wood-pressed from whole mustard seed under 40°C — sharp, pungent and full-flavoured, with a smoke point high enough for deep frying.',
    liquid: '#C9921C',
    liquidDeep: '#8F5E12',
    accent: '#9C6812',
  },
  {
    name: 'Cold-Pressed Coconut Oil',
    tag: 'From copra',
    description:
      'Pressed from sun-dried copra without solvents, bleach or deodorising — clean, mild, and the everyday choice for South Indian cooking.',
    liquid: '#F1E4C9',
    liquidDeep: '#D9C7A3',
    accent: '#7E9A6A',
  },
  {
    name: 'Virgin Coconut Oil',
    tag: 'From fresh coconut',
    description:
      'Pressed from fresh coconut meat in a single step — no drying, no storage gap, no heat — so it keeps the highest polyphenols of any coconut oil.',
    liquid: '#F6F0E4',
    liquidDeep: '#E3D8C2',
    accent: '#4C6B3A',
  },
  {
    name: 'Sesame (Til) Oil',
    tag: 'Gingelly',
    description:
      'Slow-pressed white sesame with its natural nuttiness intact — for tempering, pickles, and the abhyanga massage tradition.',
    liquid: '#B8761E',
    liquidDeep: '#7D4E12',
    accent: '#7D4E12',
  },
]

export function Products() {
  return (
    <section id="products" className="section tone-cool scroll-mt-16 border-y divider">
      <div className="container-site">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Products" title="Four oils. One method." />
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-outline self-start sm:self-auto">
            <WhatsAppIcon />
            Ask for today’s rate
          </a>
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <Reveal as="li" key={p.name} delay={i * 0.07} className="card group flex flex-col overflow-hidden">
              <div className="relative flex h-56 items-end justify-center overflow-hidden bg-gradient-to-b from-mustard/[0.08] to-transparent pt-6">
                <BottleCard
                  liquidColor={p.liquid}
                  liquidDeep={p.liquidDeep}
                  subtitle={p.tag}
                  accent={p.accent}
                  className="h-full w-full translate-y-2 transition-transform duration-500 group-hover:-translate-y-0"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="eyebrow">{p.tag}</p>
                <h3 className="mt-2 font-heading text-2xl font-semibold tracking-heading">{p.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-soft">{p.description}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
