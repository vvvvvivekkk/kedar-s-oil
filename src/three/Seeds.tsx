import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Seed = {
  radius: number
  height: number
  speed: number
  phase: number
  size: number
  bob: number
}

const SEED_COUNT = 9

function makeSeeds(): Seed[] {
  // Deterministic layout so the scene looks the same on every load.
  const out: Seed[] = []
  for (let i = 0; i < SEED_COUNT; i++) {
    const t = i / SEED_COUNT
    out.push({
      radius: 1.55 + ((i * 7) % 5) * 0.14,
      height: -0.9 + t * 2.4 + ((i % 3) - 1) * 0.12,
      speed: 0.18 + ((i * 3) % 4) * 0.045,
      phase: t * Math.PI * 2,
      size: 0.055 + ((i * 5) % 3) * 0.012,
      bob: 0.12 + ((i * 2) % 3) * 0.05,
    })
  }
  return out
}

export function Seeds({ animate = true }: { animate?: boolean }) {
  const seeds = useMemo(() => makeSeeds(), [])
  const refs = useRef<(THREE.Mesh | null)[]>([])

  useFrame(({ clock }) => {
    if (!animate) return
    const t = clock.getElapsedTime()
    seeds.forEach((s, i) => {
      const m = refs.current[i]
      if (!m) return
      const a = s.phase + t * s.speed
      m.position.set(
        Math.cos(a) * s.radius,
        s.height + Math.sin(t * 0.8 + s.phase) * s.bob,
        Math.sin(a) * s.radius,
      )
      m.rotation.y = a
    })
  })

  return (
    <group position={[0, -0.35, 0]}>
      {seeds.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          position={[Math.cos(s.phase) * s.radius, s.height, Math.sin(s.phase) * s.radius]}
        >
          <sphereGeometry args={[s.size, 24, 24]} />
          <meshStandardMaterial color="#9C6812" roughness={0.55} metalness={0.05} />
        </mesh>
      ))}
    </group>
  )
}
