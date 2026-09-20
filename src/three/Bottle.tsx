import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

/**
 * Lathe profile for the glass shell: [radius, height] pairs from base to lip.
 * A lathe gives a proper shoulder + neck; the body section is a straight cylinder.
 */
const GLASS_PROFILE: [number, number][] = [
  [0, -1.45],
  [0.78, -1.45],
  [0.9, -1.33],
  [0.9, 0.95],
  [0.86, 1.12],
  [0.7, 1.32],
  [0.46, 1.5],
  [0.34, 1.62],
  [0.34, 2.15],
  [0.37, 2.18],
  [0.37, 2.32],
  [0, 2.32],
]

/** Liquid fills the body and half the shoulder, with a flat surface. */
const LIQUID_PROFILE: [number, number][] = [
  [0, -1.36],
  [0.74, -1.36],
  [0.83, -1.28],
  [0.83, 0.93],
  [0.79, 1.08],
  [0.66, 1.22],
  [0, 1.22],
]

/** Paints the label artwork onto a 2D canvas. */
function paintLabel(c: HTMLCanvasElement) {
  const W = c.width
  const H = c.height
  const ctx = c.getContext('2d')
  if (!ctx) return
  ctx.fillStyle = '#F6EFE2'
  ctx.fillRect(0, 0, W, H)
  // faint paper grain
  ctx.fillStyle = 'rgba(44,32,22,0.035)'
  for (let i = 0; i < 1800; i++) {
    ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2)
  }
  // stripes
  ctx.fillStyle = '#C1841A'
  ctx.fillRect(0, 34, W, 8)
  ctx.fillRect(0, H - 42, W, 8)
  // wordmark
  const cx = W * 0.5
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#2C2016'
  ctx.font = '600 150px "Fraunces Variable", "Fraunces", Georgia, serif'
  ctx.fillText('Kedar’s', cx, H * 0.46)
  ctx.fillStyle = '#9C6812'
  ctx.font = '600 44px "Karla", system-ui, sans-serif'
  ctx.fillText('C O L D - P R E S S E D', cx, H * 0.72)
  ctx.fillStyle = '#4A3826'
  ctx.font = '400 30px "Karla", system-ui, sans-serif'
  ctx.fillText('KAPRA · SECUNDERABAD', cx, H * 0.86)
}

/**
 * Canvas-drawn paper label wrapped around the band. The texture is created
 * synchronously (so the material compiles with a map from the start) and
 * repainted once the web fonts are ready.
 */
function useLabelTexture() {
  const { tex, canvas } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2816 // ≈ band circumference / height, so the artwork is not stretched
    canvas.height = 512
    paintLabel(canvas)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    tex.wrapS = THREE.RepeatWrapping
    // Cylinder u=0 faces +z (the camera); the wordmark is at texture u=0.5.
    tex.offset.x = 0.5
    return { tex, canvas }
  }, [])

  useEffect(() => {
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (cancelled) return
      paintLabel(canvas)
      tex.needsUpdate = true
    })
    return () => {
      cancelled = true
      tex.dispose()
    }
  }, [tex, canvas])

  return tex
}

function useLathe(profile: [number, number][], segments = 96) {
  return useMemo(() => {
    const pts = profile.map(([x, y]) => new THREE.Vector2(x, y))
    const geo = new THREE.LatheGeometry(pts, segments)
    geo.computeVertexNormals()
    return geo
  }, [profile, segments])
}

export function Bottle() {
  const glassGeo = useLathe(GLASS_PROFILE)
  const liquidGeo = useLathe(LIQUID_PROFILE)
  const label = useLabelTexture()

  return (
    <group position={[0, -0.35, 0]}>
      {/* Liquid — rendered first so the glass transmission buffer sees it */}
      <mesh geometry={liquidGeo} renderOrder={0}>
        <meshPhysicalMaterial
          color="#C1841A"
          roughness={0.1}
          metalness={0.05}
          clearcoat={0.4}
          clearcoatRoughness={0.2}
          emissive="#8a5210"
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* Glass shell */}
      <mesh geometry={glassGeo} renderOrder={1}>
        <meshPhysicalMaterial
          transmission={1}
          thickness={0.5}
          roughness={0.05}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.05}
          color="#ffffff"
          attenuationColor="#f5e9d2"
          attenuationDistance={2.5}
          envMapIntensity={1.2}
          specularIntensity={1}
        />
      </mesh>

      {/* Paper label band */}
      <mesh position={[0, -0.25, 0]} renderOrder={2}>
        <cylinderGeometry args={[0.915, 0.915, 1.05, 128, 1, true]} />
        <meshStandardMaterial map={label} roughness={0.95} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Cap */}
      <mesh position={[0, 2.48, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.36, 64]} />
        <meshStandardMaterial color="#171310" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Cap ridge detail */}
      <mesh position={[0, 2.31, 0]}>
        <cylinderGeometry args={[0.44, 0.44, 0.05, 64]} />
        <meshStandardMaterial color="#2C2016" roughness={0.7} />
      </mesh>
    </group>
  )
}
