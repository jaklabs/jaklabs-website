'use client'

import { useEffect, useRef } from 'react'

/**
 * The pointer light — the one piece of this page's lighting that needs JS.
 *
 * Everything else on /engineering is driven by `animation-timeline: view()`,
 * which the browser runs off scroll with no script. A cursor position is not
 * derivable from scroll, so this one gets a listener — and it is kept to exactly
 * what that buys:
 *
 *   • ONE passive pointermove listener, rAF-throttled, so at most one write per
 *     frame no matter how fast the mouse moves.
 *   • It writes two CSS custom properties and nothing else. No React state, so a
 *     mouse moving across the page never re-renders a component tree.
 *   • It does not run at all under prefers-reduced-motion, or on a device with
 *     no fine pointer. On a phone there is no cursor to follow, and mounting it
 *     there would cost a listener to animate something nobody can aim.
 *
 * The element starts unlit and fades in on first move, so it never swings in
 * from a corner on load.
 */
export function PointerLight() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Both gates are real: reduced motion is a stated preference, and a coarse
    // pointer means there is nothing to track.
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (still.matches || !fine.matches) return

    let frame = 0
    let x = 0
    let y = 0

    const paint = () => {
      frame = 0
      el.style.setProperty('--fx-x', `${x}px`)
      el.style.setProperty('--fx-y', `${y}px`)
      el.dataset.lit = 'true'
    }

    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      // Coalesce to one write per frame. Without this a 1000Hz mouse would
      // schedule a style write per event.
      if (!frame) frame = requestAnimationFrame(paint)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={ref} className="fx-lamp-pointer" aria-hidden="true" />
}

/**
 * A card that lights from wherever the cursor sits inside it.
 *
 * Same discipline as above — two custom properties, rAF-throttled, no state. The
 * visual itself is `.fx-spot` in globals.css, which draws nothing until :hover
 * and is gated on a fine pointer, so on touch this renders as a plain card and
 * the handler never fires.
 */
export function SpotlightCard({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef(0)

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || frame.current) return
    const { clientX, clientY } = e
    frame.current = requestAnimationFrame(() => {
      frame.current = 0
      const r = el.getBoundingClientRect()
      el.style.setProperty('--sx', `${clientX - r.left}px`)
      el.style.setProperty('--sy', `${clientY - r.top}px`)
    })
  }

  useEffect(() => () => { if (frame.current) cancelAnimationFrame(frame.current) }, [])

  return (
    <div ref={ref} onPointerMove={onMove} className={`fx-spot ${className}`}>
      {children}
    </div>
  )
}
