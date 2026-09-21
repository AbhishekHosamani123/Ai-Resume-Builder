import React, { useEffect, useRef, useState } from 'react'

const CustomCursor = () => {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  const mousePos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const rafId = useRef(null)

  useEffect(() => {
    // Check if the device has a coarse pointer (mobile / tablet touch)
    if (typeof window !== 'undefined') {
      const touchQuery = window.matchMedia('(pointer: coarse)')
      if (touchQuery.matches) {
        setIsTouchDevice(true)
        return
      }
    }

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)

      // Fast check if hovering over interactive elements
      const target = e.target
      if (target) {
        const interactive = target.closest('button, a, input, textarea, select, [role="button"], label, .cursor-pointer')
        setIsHovered(Boolean(interactive))
      }
    }

    const onMouseDown = () => setIsClicking(true)
    const onMouseUp = () => setIsClicking(false)
    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    // Smooth lerp loop for the ring and dot
    const render = () => {
      // Ring follows with slight lag (lerp factor 0.2)
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.22
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.22

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`
      }

      rafId.current = requestAnimationFrame(render)
    }

    rafId.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [isVisible])

  if (isTouchDevice) return null

  return (
    <>
      {/* Outer subtle follower ring */}
      <div
        ref={ringRef}
        className={`custom-cursor-ring fixed top-0 left-0 pointer-events-none z-[999998] rounded-full transition-[width,height,border-color,background-color,opacity] duration-200 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${
          isHovered
            ? 'w-10 h-10 border border-white/60 bg-white/10'
            : isClicking
            ? 'w-6 h-6 border border-white/80'
            : 'w-7 h-7 border border-white/40'
        }`}
        style={{
          mixBlendMode: 'difference',
        }}
      />

      {/* Main black dot (inverts to white over dark areas via mix-blend-mode: difference) */}
      <div
        ref={dotRef}
        className={`custom-cursor-dot fixed top-0 left-0 pointer-events-none z-[999999] rounded-full transition-[width,height,transform,opacity] duration-150 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${
          isHovered
            ? 'w-3 h-3 bg-white scale-125'
            : isClicking
            ? 'w-2 h-2 bg-white scale-90'
            : 'w-2.5 h-2.5 bg-white'
        }`}
        style={{
          mixBlendMode: 'difference',
        }}
      />
    </>
  )
}

export default CustomCursor
