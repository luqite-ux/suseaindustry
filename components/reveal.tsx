"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: React.ElementType
}

/**
 * Reveals children when they actually intersect the viewport. Content is
 * visible by default (progressive enhancement): if the observer or script
 * fails to run, `.reveal` still renders at full opacity via the
 * `reveal-fallback-visible` class applied on mount failure detection.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const Comp = as as any

  return (
    <Comp
      ref={ref}
      className={cn("reveal", visible && "is-visible", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Comp>
  )
}

export function RevealGroup({
  children,
  className,
  staggerMs = 70,
  maxStaggerMs = 210,
}: {
  children: React.ReactNode[]
  className?: string
  staggerMs?: number
  maxStaggerMs?: number
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} delay={Math.min(i * staggerMs, maxStaggerMs)} className="h-full">
          {child}
        </Reveal>
      ))}
    </div>
  )
}
