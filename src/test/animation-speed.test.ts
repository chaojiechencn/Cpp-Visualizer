import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderHook } from "@testing-library/react";
import { AnimationScaleProvider, scaledSpring, useAnimationScale } from "@/lib/animation-speed";

// Undamped angular frequency sqrt(k) and damping ratio c / (2 sqrt(k)), mass 1.
const omega = (s: { stiffness: number }) => Math.sqrt(s.stiffness);
const zeta = (s: { stiffness: number; damping: number }) => s.damping / (2 * Math.sqrt(s.stiffness));

describe("animation speed", () => {
  it("defaults to 1x outside a provider", () => {
    const { result } = renderHook(() => useAnimationScale());
    expect(result.current).toBe(1);
  });

  it("reads the scale from the provider", () => {
    const { result } = renderHook(() => useAnimationScale(), {
      wrapper: ({ children }) => createElement(AnimationScaleProvider, { value: 4 }, children),
    });
    expect(result.current).toBe(4);
  });

  it("leaves the spring untouched at 1x", () => {
    expect(scaledSpring(400, 30, 1)).toEqual({ type: "spring", stiffness: 400, damping: 30 });
  });

  it.each([0.05, 0.5, 1.5, 4])("stretches time by %s without changing the bounce", (scale) => {
    const base = scaledSpring(400, 30, 1);
    const scaled = scaledSpring(400, 30, scale);
    expect(omega(base) / omega(scaled)).toBeCloseTo(scale);
    expect(zeta(scaled)).toBeCloseTo(zeta(base));
  });
});
