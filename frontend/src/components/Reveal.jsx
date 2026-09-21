import { useEffect, useRef } from 'react'

// Framer-style scroll reveal: children start slightly translated + blurred
// and animate in with an expo-out ease when they enter the viewport.
// `delay` (ms) staggers siblings, `y` controls the rise distance,
// `as` picks the wrapper element.
const Reveal = ({
  children,
  delay = 0,
  y = 28,
  blur = true,
  scale = 1,
  className = '',
  id,
}) => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible')
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { threshold: 0.01, rootMargin: '0px 0px 80px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      id={id}
      className={`reveal ${className}`}
      style={{
        '--reveal-delay': `${delay}ms`,
        '--reveal-y': `${y}px`,
        '--reveal-blur': blur ? '8px' : '0px',
        '--reveal-scale': scale,
      }}
    >
      {children}
    </div>
  )
}

export default Reveal
