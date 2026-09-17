"use client"

import { useEffect, useState } from "react"

/**
 * A single, one-time filament-line draw used as the site's industry signature
 * in the Hero. Never loops. Falls back to a fully drawn static line when
 * `prefers-reduced-motion` is set or before hydration completes.
 */
export function FilamentPath({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setDrawn(true)
      return
    }
    const timeout = setTimeout(() => setDrawn(true), 150)
    return () => clearTimeout(timeout)
  }, [])

  const d =
    variant === "desktop"
      ? "M10,300 C150,260 190,110 350,100 C470,92 500,55 590,30"
      : "M10,180 C90,150 120,70 220,55 C280,48 290,25 340,10"

  const viewBox = variant === "desktop" ? "0 0 600 320" : "0 0 350 200"

  return (
    <svg
      viewBox={viewBox}
      className={variant === "desktop" ? "hidden h-full w-full sm:block" : "block h-full w-full sm:hidden"}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <path
        d={d}
        fill="none"
        stroke="white"
        strokeOpacity="0.9"
        strokeWidth={variant === "desktop" ? 3 : 2.5}
        strokeLinecap="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: drawn ? 0 : 1,
          transition: drawn ? "stroke-dashoffset 750ms cubic-bezier(0.16,1,0.3,1)" : "none",
        }}
      />
    </svg>
  )
}
