/** Shared scroll-motion constants for the hero scene (bottle group + halo). */

/** World units the bottle sinks by the time the hero has scrolled past (× bottle scale). */
export const DRIFT_Y = 2.4

/** Smoothstep easing of the 0→1 hero scroll progress. */
export function scrollEase(p: number): number {
  return p * p * (3 - 2 * p)
}

/** Bottle scale so it fills its layout slot. */
export type Anchor = { scale: number }
