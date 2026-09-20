/**
 * Heuristic for "should we spin up WebGL at all?".
 * Low-end devices get a static bottle illustration instead of the 3D canvas.
 */
export function isLowEndDevice(): boolean {
  if (typeof navigator === 'undefined') return true
  const cores = navigator.hardwareConcurrency ?? 0
  if (cores > 0 && cores < 4) return true

  // Chrome exposes approximate RAM in GB; treat <= 2 GB as low-end.
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  if (typeof mem === 'number' && mem <= 2) return true

  // Data-saver hint – users on constrained connections shouldn't download three.js.
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  if (conn?.saveData) return true

  // No WebGL, or WebGL without GPU acceleration (SwiftShader / llvmpipe / Mesa software
  // rasterisers). Software GL renders the scene at a crawl and blocks the main thread,
  // so those environments get the static bottle instead.
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl2') ?? canvas.getContext('webgl')) as WebGLRenderingContext | null
    if (!gl) return true
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : ''
    if (/swiftshader|llvmpipe|softpipe|software|mesa offscreen|microsoft basic render/i.test(renderer)) return true
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    return true
  }
  return false
}
