import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, invalidate } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import { Bottle } from './Bottle'
import { BottleStatic } from '../components/BottleStatic'
import { isLowEndDevice } from '../lib/device'

type Props = {
  liquidColor: string
  liquidDeep: string
  subtitle: string
  caption?: string
  accent?: string
  className?: string
}

/**
 * A single real-time-quality 3D bottle for product cards and inline product art.
 *
 * Unlike the hero (BottleScene.tsx), this does NOT run a continuous render loop per
 * instance — with four of these on the Products grid, four "always" loops would be
 * exactly the "multiple expensive WebGL canvases" performance trap. Instead each
 * canvas uses frameloop="demand": it renders once when it mounts/comes into view and
 * then goes idle, so the cost is one frame per card, not one frame per card per tick.
 * Low-end devices (same heuristic as the hero) get the flat SVG fallback instead.
 */
export function BottleCard({ liquidColor, liquidDeep, subtitle, caption, accent, className = '' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [lowEnd, setLowEnd] = useState(false)

  useEffect(() => {
    setLowEnd(isLowEndDevice())
  }, [])

  useEffect(() => {
    const el = wrapRef.current
    if (!el || !('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (lowEnd) {
    return <BottleStatic liquid={liquidColor} liquidDeep={liquidDeep} decorative className={className} />
  }

  return (
    <div ref={wrapRef} className={className}>
      {inView && (
        <Canvas
          dpr={[1, 1.5]}
          frameloop="demand"
          camera={{ position: [1.6, 0.4, 4.4], fov: 32, near: 0.1, far: 20 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          onCreated={({ scene }) => {
            scene.background = null
            // One render once assets/materials are ready, then the canvas goes idle.
            requestAnimationFrame(() => invalidate())
          }}
        >
          <Suspense fallback={null}>
            <Environment files="/hdr/studio_small_03_512.hdr" environmentIntensity={0.5} />
            <spotLight position={[3, 5, 4]} angle={0.45} penumbra={0.85} intensity={5} color="#ffe2b0" />
            <directionalLight position={[-4, 2, -2]} intensity={0.35} color="#fff4e0" />
            <group rotation={[0, 0.5, 0]} scale={0.62} position={[0, -0.55, 0]}>
              <Bottle liquidColor={liquidColor} liquidDeep={liquidDeep} subtitle={subtitle} caption={caption} accent={accent} />
            </group>
            <ContactShadows position={[0, -1.5, 0]} opacity={0.55} scale={5} blur={2.2} far={2} resolution={256} color="#2C2016" frames={1} />
          </Suspense>
        </Canvas>
      )}
    </div>
  )
}

// Re-exported so callers don't need a second import for the plain colour type.
export type { Props as BottleCardProps }
