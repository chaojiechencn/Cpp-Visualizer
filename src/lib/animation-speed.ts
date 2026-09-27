import { createContext, useContext } from 'react';

// The playback interval at 1x. Every animation duration in the panels was tuned
// against it, so the chosen interval divided by this is how much to stretch them.
export const BASE_STEP_MS = 500;

// Duration multiplier: 1 at 1x, 4 at 0.25x, 0.05 at 20x.
const AnimationScaleContext = createContext(1);

export const AnimationScaleProvider = AnimationScaleContext.Provider;

export const useAnimationScale = () => useContext(AnimationScaleContext);

// A spring has no duration to multiply. Stretching its time axis by `scale`
// means dividing stiffness by scale² and damping by scale, which keeps the
// damping ratio — so it plays slower or faster but bounces the same.
export const scaledSpring = (stiffness: number, damping: number, scale: number) => ({
  type: 'spring' as const,
  stiffness: stiffness / (scale * scale),
  damping: damping / scale,
});
