import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { MotionValue } from 'framer-motion'
import { DRIFT_Y, scrollEase, type Anchor } from './scrollMotion'

/** Soft warm glow that always sits directly behind the bottle from the camera's point of view. */
export function Halo({ anchor, scroll }: { anchor: Anchor; scroll?: MotionValue<number> }) {
  const ref = useRef<THREE.Mesh>(null)

  const tex = useMemo(() => {
    const size = 512
    const c = document.createElement('canvas')
    c.width = size
    c.height = size
    const ctx = c.getContext('2d')
    if (ctx) {
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
      const stops: [number, number][] = [
        [0, 0.42],
        [0.08, 0.34],
        [0.16, 0.24],
        [0.24, 0.14],
        [0.32, 0.07],
        [0.4, 0.025],
        [0.46, 0.006],
        [0.52, 0],
        [1, 0],
      ]
      for (const [at, a] of stops) g.addColorStop(at, `rgba(193,132,26,${a})`)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, size, size)
    }
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])

  useEffect(() => () => tex.dispose(), [tex])

  useFrame(({ camera }) => {
    const m = ref.current
    if (!m) return
    // Direction from the bottle (origin) to the camera, flattened; place the halo 3.5 units behind it.
    const dir = camera.position.clone()
    dir.y = 0
    dir.normalize()
    // Follow the bottle's scroll drift so the glow stays behind it.
    const drift = scroll ? scrollEase(scroll.get()) * DRIFT_Y * anchor.scale : 0
    m.position.set(-dir.x * 3.5, 0.2 - drift, -dir.z * 3.5)
    m.lookAt(camera.position)
  })

  return (
    <mesh ref={ref} renderOrder={-1} scale={anchor.scale}>
      <planeGeometry args={[14, 14]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  )
}
