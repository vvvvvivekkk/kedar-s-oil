import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'
import { Bottle } from './Bottle'
import { Seeds } from './Seeds'
import { SceneBackdrop } from './SceneBackdrop'

type Props = {
  reducedMotion: boolean
  onReady?: () => void
}

/** Fires once the async assets (Environment HDR) inside Suspense have resolved. */
function ReadySignal({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.()
  }, [onReady])
  return null
}

export default function BottleScene({ reducedMotion, onReady }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  // Pause the render loop entirely when the hero is scrolled out of view.
  useEffect(() => {
    const el = wrapRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const animate = !reducedMotion

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        frameloop={inView ? 'always' : 'never'}
        camera={{ position: [0, 0.3, 9.4], fov: 30, near: 0.1, far: 40 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          // No tone mapping: the clear colour must round-trip exactly to match the page background.
          toneMapping: THREE.NoToneMapping,
        }}
        aria-hidden="true"
      >
        <SceneBackdrop />
        <Suspense fallback={null}>
          {/* drei's "studio" preset HDR (studio_small_03), self-hosted and downsampled to 512px:
              no third-party CDN dependency and ~375 KB on the wire instead of 1.7 MB. */}
          <Environment files="/hdr/studio_small_03_512.hdr" environmentIntensity={0.45} />
          <ReadySignal onReady={onReady} />

          {/* Warm key light so the amber liquid catches a highlight */}
          <spotLight position={[4, 6, 4]} angle={0.4} penumbra={0.8} intensity={6} color="#ffe2b0" />
          <directionalLight position={[-5, 3, -3]} intensity={0.4} color="#fff4e0" />

          <Bottle />
          <Seeds animate={animate} />

          <ContactShadows
            position={[0, -1.82, 0]}
            opacity={0.7}
            scale={7}
            blur={2.4}
            far={3}
            resolution={512}
            color="#2C2016"
            frames={animate ? Infinity : 1}
          />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={animate}
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 2.6}
            maxPolarAngle={Math.PI / 1.75}
            dampingFactor={0.08}
            enableDamping
            makeDefault
          />

          {!reducedMotion && (
            <EffectComposer multisampling={0}>
              {/* Few, small mip levels keep the glow local to the highlights instead of lifting the whole frame. */}
              <Bloom intensity={0.4} luminanceThreshold={0.9} luminanceSmoothing={0.05} mipmapBlur levels={3} radius={0.45} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}
