import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/** Reads the page background token so the opaque canvas matches the section behind it. */
function readPageBg(): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
  return v || '#EEE4D2'
}

/**
 * Keeps the renderer clear colour in sync with the CSS `--bg` token (light/dark,
 * OS changes, or a data-theme override) and draws a soft warm halo behind the bottle.
 * Rendering opaque avoids the alpha artefacts the post-processing pass leaves on
 * a transparent canvas.
 */
export function SceneBackdrop() {
  const gl = useThree((s) => s.gl)

  useEffect(() => {
    const apply = () => gl.setClearColor(new THREE.Color(readPageBg()), 1)
    apply()
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', apply)
    const mo = new MutationObserver(apply)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => {
      mq.removeEventListener('change', apply)
      mo.disconnect()
    }
  }, [gl])

  const halo = useMemo(() => {
    const size = 512
    const c = document.createElement('canvas')
    c.width = size
    c.height = size
    const ctx = c.getContext('2d')
    if (ctx) {
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
      // Fully transparent well inside the view so the canvas edge never shows a tint step.
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

  useEffect(() => () => halo.dispose(), [halo])

  // Keep the halo directly behind the bottle from wherever the camera is orbiting.
  const haloRef = useRef<THREE.Mesh>(null)
  useFrame(({ camera }) => {
    const m = haloRef.current
    if (!m) return
    m.position.copy(camera.position).setY(0).normalize().multiplyScalar(-3.5)
    m.position.y = 0.2
    m.lookAt(camera.position)
  })

  return (
    <mesh ref={haloRef} position={[0, 0.2, -3.5]} renderOrder={-1}>
      <planeGeometry args={[14, 14]} />
      <meshBasicMaterial map={halo} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  )
}
