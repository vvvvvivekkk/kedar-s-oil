import { MotionConfig } from 'framer-motion'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { StatStrip } from './components/StatStrip'
import { ColdPressVsRefined } from './components/ColdPressVsRefined'
import { VirginOilExplainer } from './components/VirginOilExplainer'
import { UsesGrid } from './components/UsesGrid'
import { Products } from './components/Products'
import { Process } from './components/Process'
import { Pricing } from './components/Pricing'
import { B2B } from './components/B2B'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main id="main">
        <Hero />
        <StatStrip />
        <ColdPressVsRefined />
        <VirginOilExplainer />
        <UsesGrid />
        <Products />
        <Process />
        <Pricing />
        <B2B />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}
