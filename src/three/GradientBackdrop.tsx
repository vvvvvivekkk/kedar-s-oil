import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Palette = [THREE.Color, THREE.Color, THREE.Color, THREE.Color]

/** cream · amber · olive · base — light and dark variants of the same four tones. */
const LIGHT: Palette = [
  new THREE.Color('#F6EFE2'),
  new THREE.Color('#E9C98A'),
  new THREE.Color('#CFD6B4'),
  new THREE.Color('#EEE4D2'),
]
const DARK: Palette = [
  new THREE.Color('#4A3620'),
  new THREE.Color('#6B4514'),
  new THREE.Color('#2E3C22'),
  new THREE.Color('#1B140D'),
]

/** Render layer for the backdrop quad; the main camera enables it in BottleScene. */
export const BACKDROP_LAYER = 1

type Uniforms = {
  uTime: { value: number }
  uAspect: { value: number }
  uC0: { value: THREE.Color }
  uC1: { value: THREE.Color }
  uC2: { value: THREE.Color }
  uC3: { value: THREE.Color }
}

function setPalette(mat: THREE.ShaderMaterial | null, pal: Palette) {
  const u = mat?.uniforms as Uniforms | undefined
  if (!u) return
  u.uC0.value.copy(pal[0])
  u.uC1.value.copy(pal[1])
  u.uC2.value.copy(pal[2])
  u.uC3.value.copy(pal[3])
}

function tick(mat: THREE.ShaderMaterial | null, time: number, aspect: number) {
  const u = mat?.uniforms as Uniforms | undefined
  if (!u) return
  u.uTime.value = time
  u.uAspect.value = aspect
}

function isDark(): boolean {
  const forced = document.documentElement.dataset.theme
  if (forced === 'dark') return true
  if (forced === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // Full-screen quad in clip space, pushed to the far plane so depth-of-field treats it as background.
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;
  uniform vec3 uC0; // cream
  uniform vec3 uC1; // amber
  uniform vec3 uC2; // olive
  uniform vec3 uC3; // base

  // Hash / value noise / fbm — cheap enough to run every frame at any resolution.
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = vec2(uv.x * uAspect, uv.y);
    float t = uTime * 0.045;

    // Two drifting noise fields warp a third — the classic "mesh gradient" look.
    vec2 q = vec2(fbm(p * 0.9 + vec2(t, -t * 0.7)), fbm(p * 0.9 + vec2(-t * 0.6, t)));
    float n = fbm(p * 1.1 + 1.8 * q + vec2(t * 0.3));
    float m = fbm(p * 0.6 - 1.2 * q - vec2(t * 0.2));

    // Base → amber where n is high, olive where m is high, cream highlights where both peak.
    vec3 col = uC3;
    col = mix(col, uC1, smoothstep(0.35, 0.8, n) * 0.85);
    col = mix(col, uC2, smoothstep(0.45, 0.85, m) * 0.75);
    col = mix(col, uC0, smoothstep(0.6, 0.95, n * m * 2.2) * 0.6);

    // Gentle vignette so the edges settle back to the page background.
    float vig = smoothstep(1.25, 0.35, distance(uv, vec2(0.5, 0.55)) * 1.15);
    // …and settle fully to the page background along the bottom/top edges so the canvas has no visible edge.
    vig *= smoothstep(0.0, 0.26, uv.y) * smoothstep(1.0, 0.9, uv.y);
    col = mix(uC3, col, vig);

    // Fine grain to avoid banding.
    col += (hash(uv * 1024.0 + fract(uTime)) - 0.5) * 0.012;

    gl_FragColor = vec4(col, 1.0);
    // Correct output encoding whether we render to the screen or into the post-processing buffer.
    #include <colorspace_fragment>
  }
`

/**
 * Animated noise-based mesh gradient that fills the whole canvas behind the scene.
 * Palette follows the colour scheme (OS or data-theme override).
 */
export function GradientBackdrop({ animate }: { animate: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  // Initial uniform values; afterwards they are mutated through the material ref only.
  const uniforms = useMemo<Uniforms>(() => {
    const pal = isDark() ? DARK : LIGHT
    return {
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uC0: { value: pal[0].clone() },
      uC1: { value: pal[1].clone() },
      uC2: { value: pal[2].clone() },
      uC3: { value: pal[3].clone() },
    }
  }, [])

  // Swap palette when the scheme changes.
  useEffect(() => {
    const apply = () => setPalette(matRef.current, isDark() ? DARK : LIGHT)
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', apply)
    const mo = new MutationObserver(apply)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => {
      mq.removeEventListener('change', apply)
      mo.disconnect()
    }
  }, [])

  useFrame(({ clock, size }) => {
    // Reduced motion: freeze the field at a pleasant offset instead of drifting.
    tick(matRef.current, animate ? clock.getElapsedTime() : 40, size.width / size.height)
  })

  // Layer 1: only the main camera renders it, so ContactShadows' depth pass never sees the quad.
  const meshRef = useRef<THREE.Mesh>(null)
  useLayoutEffect(() => {
    meshRef.current?.layers.set(BACKDROP_LAYER)
  }, [])

  return (
    <mesh ref={meshRef} frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        depthWrite
        depthTest={false}
        toneMapped={false}
      />
    </mesh>
  )
}
