import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { BottleStatic } from './BottleStatic'
import { WhatsAppIcon } from './Header'
import { WHATSAPP_URL } from '../lib/site'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { isLowEndDevice } from '../lib/device'

// three.js + fiber + drei + postprocessing live in their own chunk and never block first paint.
const BottleScene = lazy(() => import('../three/BottleScene'))

export function Hero() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const slotRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<'pending' | 'static' | '3d'>('pending')
  const [sceneReady, setSceneReady] = useState(false)
  const onReady = useCallback(() => setSceneReady(true), [])

  // 0 while the hero is fully in view → 1 once it has scrolled past; drives the bottle's scroll motion.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [0.7, 0])

  // Progressive enhancement: the static bottle + CSS gradient paint immediately. The 3D scene
  // is only started once the page has settled (a few seconds after `load`) or the user starts
  // interacting — whichever comes first — and only if the device qualifies. The device probe
  // creates a WebGL context (expensive), so it runs at that point, not on mount.
  useEffect(() => {
    let done = false
    let timer = 0
    const start = () => {
      if (done) return
      done = true
      cleanup()
      setMode(isLowEndDevice() ? 'static' : '3d')
    }
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'pointermove', 'touchstart', 'wheel', 'scroll', 'keydown']
    const onLoad = () => {
      timer = window.setTimeout(start, 3500)
    }
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, start))
      window.removeEventListener('load', onLoad)
      window.clearTimeout(timer)
    }
    events.forEach((e) => window.addEventListener(e, start, { passive: true, once: true }))
    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad, { once: true })
    return cleanup
  }, [])

  const show3d = mode === '3d'
  const live = show3d && sceneReady

  return (
    <section ref={sectionRef} id="top" className="ambient relative overflow-hidden">
      {/* WebGL layer: animated mesh-gradient backdrop + bottle. Sits under the content, fades in when ready. */}
      {show3d && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${live ? 'opacity-100' : 'opacity-0'}`}>
          <Suspense fallback={null}>
            <BottleScene reducedMotion={reducedMotion} anchorRef={slotRef} scroll={scrollYProgress} onReady={onReady} />
          </Suspense>
        </div>
      )}
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0" />

      <div className="container-site relative grid items-center gap-10 pb-28 pt-14 sm:pb-32 sm:pt-20 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pb-32 lg:pt-10">
        {/* Copy column — pointer events restored on links so they work over the canvas */}
        <div className="pointer-events-none relative z-10 max-w-2xl [&_a]:pointer-events-auto">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Cold-pressed &amp; virgin oils · Kapra, Secunderabad
          </motion.p>
          <motion.h1
            className="h-display mt-5"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            Real oil still exists. It’s just <em className="not-italic text-accent">pressed</em>, not processed.
          </motion.h1>
          <motion.p
            className="lead mt-6 max-w-xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16 }}
          >
            Kedar’s presses mustard, coconut, and virgin coconut oil the traditional way — slow, cold, and
            chemical-free — so nothing is lost between the seed and your kitchen.
          </motion.p>
          <motion.div
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24 }}
          >
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <WhatsAppIcon />
              WhatsApp Us
            </a>
            <a href="#why-cold-pressed" className="btn btn-outline">
              Why Cold-Pressed?
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </motion.div>
          <p className="mt-8 text-sm text-soft">Family-run mill · Mustard · Coconut · Virgin coconut · Sesame</p>
        </div>

        {/* Bottle slot: the 3D bottle is anchored to this box; the SVG fills it until the scene is live */}
        <div
          ref={slotRef}
          className="pointer-events-none relative mx-auto aspect-[4/5] w-full max-w-[24rem] sm:max-w-[28rem] lg:aspect-auto lg:h-[min(76vh,42rem)] lg:max-w-none"
        >
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
              live ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mustard/25 blur-3xl dark:bg-dk-accent/20"
            />
            <BottleStatic className="relative h-full w-auto max-h-full drop-shadow-xl" />
          </div>
          {live && (
            <motion.p
              style={{ opacity: hintOpacity }}
              className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-soft"
              aria-hidden="true"
            >
              Drag to inspect the bottle
            </motion.p>
          )}
        </div>
      </div>
    </section>
  )
}
