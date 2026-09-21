import { Suspense, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Bloom, DepthOfField, EffectComposer } from '@react-three/postprocessing'
import type { MotionValue } from 'framer-motion'
import * as THREE from 'three'
import { Bottle } from './Bottle'
import { Seeds } from './Seeds'
import { BACKDROP_LAYER, GradientBackdrop } from './GradientBackdrop'
import { Halo } from './Halo'
import { DRIFT_Y, scrollEase, type Anchor } from './scrollMotion'

type Props = {
  reducedMotion: boolean
  /** Element the bottle should visually occupy (the hero's bottle slot). */
  anchorRef: RefObject<HTMLElement | null>
  /** 0 → hero fully in view, 1 → hero scrolled past. */
  scroll: MotionValue<number>
  onReady?: () => void
}

const CAMERA_Z = 9.4
const FOV = 30
const BOTTLE_HEIGHT = 5.9 // slot height in world units per bottle unit — bottle fills ~70% of its slot

function restoreAutoClear(gl: THREE.WebGLRenderer) {
  gl.autoClear = true
}


/**
 * Fires once the async assets (Environment HDR) inside Suspense have resolved AND the
 * shaders have been compiled. compileAsync uses KHR_parallel_shader_compile where available,
 * so the (otherwise ~1–3 s) compile stall doesn't block the main thread before the fade-in.
 */
function ReadySignal({ onReady }: { onReady?: () => void }) {
  const { gl, scene, camera } = useThree()
  useEffect(() => {
    let cancelled = false
    gl.compileAsync(scene, camera)
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) onReady?.()
      })
    return () => {
      cancelled = true
    }
  }, [gl, scene, camera, onReady])
  return null
}

/**
 * The bottle lives at the world origin, which OrbitControls orbits around. To make that point
 * land on the layout's bottle slot (right column on desktop, below the copy on mobile) the
 * camera projection is shifted with `setViewOffset` — so drag/auto-rotate keep working and the
 * bottle stays exactly where the layout reserved space. Also scales the bottle to the slot height.
 */
function useAnchor(anchorRef: RefObject<HTMLElement | null>): Anchor {
  const gl = useThree((s) => s.gl)
  const camera = useThree((s) => s.camera)
  const [anchor, setAnchor] = useState<Anchor>({ scale: 1 })

  useLayoutEffect(() => {
    const canvas = gl.domElement
    const compute = () => {
      const el = anchorRef.current
      if (!el) return
      const c = canvas.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      if (!c.width || !c.height) return
      const visibleH = 2 * CAMERA_Z * Math.tan((FOV * Math.PI) / 360)
      const dx = r.left + r.width / 2 - c.left - c.width / 2
      const dy = r.top + r.height / 2 - c.top - c.height / 2
      // Negative offset shifts the rendered image towards +x/+y (right/down).
      camera.setViewOffset(c.width, c.height, -dx, -dy, c.width, c.height)
      camera.updateProjectionMatrix()
      const slotH = (r.height / c.height) * visibleH
      setAnchor({ scale: Math.min(1.1, slotH / BOTTLE_HEIGHT) })
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(canvas)
    if (anchorRef.current) ro.observe(anchorRef.current)
    return () => {
      ro.disconnect()
      camera.clearViewOffset()
    }
  }, [gl, camera, anchorRef])

  return anchor
}

function Scene({ reducedMotion, anchorRef, scroll, onReady }: Props) {
  const anchor = useAnchor(anchorRef)
  const gl = useThree((s) => s.gl)

  // @react-three/postprocessing forces gl.autoClear=false while mounted, but drei's ContactShadows
  // relies on autoClear when it renders its depth pass — without it the orbiting seeds smear into a
  // tinted square. Re-enable it first thing every frame; the composer clears its own buffers explicitly.
  useFrame(() => restoreAutoClear(gl), -1)
  const group = useRef<THREE.Group>(null)
  const animate = !reducedMotion

  // Scroll-linked motion: as the hero leaves, the bottle turns, sinks and shrinks slightly.
  // (No z movement: with a large view offset, off-axis perspective would turn depth into sideways drift.)
  useFrame(() => {
    const g = group.current
    if (!g) return
    const eased = scrollEase(reducedMotion ? 0 : scroll.get())
    g.position.set(0, -0.2 - eased * DRIFT_Y * anchor.scale, 0)
    g.rotation.y = eased * Math.PI * 0.9
    g.rotation.x = eased * 0.18
    g.scale.setScalar(anchor.scale * (1 - eased * 0.15))
  })

  return (
    <>
      <GradientBackdrop animate={animate} />
      <Suspense fallback={null}>
        {/* drei's "studio" preset HDR (studio_small_03), self-hosted and downsampled to 512px:
            no third-party CDN dependency and ~375 KB on the wire instead of 1.7 MB. */}
        <Environment files="/hdr/studio_small_03_512.hdr" environmentIntensity={0.45} />
        <ReadySignal onReady={onReady} />

        {/* Warm key light so the amber liquid catches a highlight */}
        <spotLight position={[4, 6, 4]} angle={0.4} penumbra={0.8} intensity={6} color="#ffe2b0" />
        <directionalLight position={[-5, 3, -3]} intensity={0.4} color="#fff4e0" />

        <Halo anchor={anchor} scroll={reducedMotion ? undefined : scroll} />

        <group ref={group} position={[0, -0.2, 0]} scale={anchor.scale}>
          <Bottle />
          <Seeds animate={animate} />
        </group>

        {/* Kept outside the scaled bottle group: inside a scaled parent its plane z-fights the shadow camera. */}
        <ContactShadows
          position={[0, -0.2 - 1.82 * anchor.scale, 0]}
          opacity={0.7}
          scale={7 * anchor.scale}
          blur={2.4}
          far={3 * anchor.scale}
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
            {/* Focus on the bottle; the gradient backdrop (far plane) and rear seeds soften. */}
            <DepthOfField worldFocusDistance={CAMERA_Z} worldFocusRange={3.2} bokehScale={3.5} height={480} />
            {/* Few, small mip levels keep the glow local to the highlights instead of lifting the whole frame. */}
            <Bloom intensity={0.4} luminanceThreshold={0.9} luminanceSmoothing={0.05} mipmapBlur levels={3} radius={0.45} />
          </EffectComposer>
        )}
      </Suspense>
    </>
  )
}

export default function BottleScene(props: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  // Pause the render loop entirely when the hero is scrolled out of view.
  useEffect(() => {
    const el = wrapRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.02 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Canvas
        // 1.5 is visually indistinguishable here and ~45% fewer pixels than 2 on a full-bleed canvas.
        dpr={[1, 1.5]}
        onCreated={({ gl, camera }) => {
          // Transmission renders the scene into an extra buffer every frame; half-res is plenty for a blurred backdrop.
          gl.transmissionResolutionScale = 0.5
          // With alpha:false three defaults clearAlpha to 1, which would leave ContactShadows' render
          // target opaque (a tinted square under the bottle). The backdrop quad covers the screen anyway.
          gl.setClearColor(0x000000, 0)
          camera.layers.enable(BACKDROP_LAYER)
        }}
        frameloop={inView ? 'always' : 'never'}
        camera={{ position: [0, 0, CAMERA_Z], fov: FOV, near: 0.1, far: 40 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          // No tone mapping so the shader backdrop's colours land exactly as designed.
          toneMapping: THREE.NoToneMapping,
        }}
        // Vertical touch gestures keep scrolling the page; horizontal drags orbit the bottle.
        style={{ touchAction: 'pan-y' }}
        aria-hidden="true"
      >
        <Scene {...props} />
      </Canvas>
    </div>
  )
}
