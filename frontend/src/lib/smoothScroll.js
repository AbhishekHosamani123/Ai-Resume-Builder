// Buttery smooth scrolling (Lenis) + a shared rAF parallax engine.
//
// Lenis is what gives premium sites (Framer, Studio Freight…) that
// "surfing on butter" inertial wheel scrolling. We run one Lenis instance
// for the whole app and one rAF loop that also drives every
// [data-parallax] element (scroll-linked translate) for the Framer-style
// scroll effects.

import Lenis from 'lenis'

let lenis = null
let rafId = null
let parallaxEls = []

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return () => {}

  lenis = new Lenis({
    // long, weighted glide — the "butter" feel
    duration: 1.35,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
  })

  const collectParallax = () => {
    parallaxEls = [...document.querySelectorAll('[data-parallax]')]
  }
  collectParallax()
  window.addEventListener('DOMContentLoaded', collectParallax)

  const raf = (time) => {
    lenis.raf(time)

    // parallax: translate elements based on their distance from viewport center
    const vh = window.innerHeight
    for (const el of parallaxEls) {
      const rect = el.getBoundingClientRect()
      if (rect.bottom < -100 || rect.top > vh + 100) continue
      const speed = parseFloat(el.dataset.parallax) || 0.12
      const delta = (rect.top + rect.height / 2 - vh / 2) * -speed
      el.style.transform = `translate3d(0, ${delta.toFixed(1)}px, 0)`
    }

    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)

  return () => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('DOMContentLoaded', collectParallax)
    lenis.destroy()
    lenis = null
  }
}

// Smoothly scroll to a section/route hash target (used by nav links)
export function scrollToTarget(selector, offset = -76) {
  if (selector.startsWith('#')) {
    const el = document.querySelector(selector)
    if (!el) return
    if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 })
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  if (lenis) lenis.scrollTo(0, { duration: 1.2 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
