import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react'

// Map GSAP / common easing string names to standard CSS cubic-bezier curves
const EASING_MAP = {
  'power3.out': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  'power2.out': 'cubic-bezier(0.25, 1, 0.5, 1)',
  'power1.out': 'cubic-bezier(0.33, 1, 0.68, 1)',
  'power4.out': 'cubic-bezier(0.16, 1, 0.3, 1)',
  'expo.out': 'cubic-bezier(0.19, 1, 0.22, 1)',
  'sine.out': 'cubic-bezier(0.39, 0.575, 0.565, 1)',
  'circ.out': 'cubic-bezier(0.075, 0.82, 0.165, 1)',
  'back.out': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
  'ease': 'ease',
  'linear': 'linear'
}

/**
 * DepthCarousel - Bilateral 3D Depth Carousel
 * Displays the active card in the center with sharp, clearly readable
 * template cards visible on both the left and right sides.
 */
export default function DepthCarousel({
  items = [],
  depth = 180,
  spread = 150,
  tilt = 20,
  tiltDirection = 'both',
  perspective = 1400,
  visibleCards = 3,
  falloff = 0.15,
  blur = 0,
  autoplay = false,
  loop = true,
  cardWidth = 300,
  cardHeight = 380,
  radius = 18,
  tint = '#05060a',
  duration = 700,
  ease = 'power3.out',
  autoplayDelay = 3200,
  showControls = true,
  showIndicators = true,
  onCardClick,
  className = '',
  style = {}
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [containerWidth, setContainerWidth] = useState(1000)
  const containerRef = useRef(null)

  const total = items.length

  // Measure container width for responsive scaling
  useEffect(() => {
    if (!containerRef.current) return
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    updateWidth()
    const resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  // Responsive scale down on small viewports so 3D fanning never overflows
  const responsiveScale = useMemo(() => {
    if (containerWidth < 380) return 0.62
    if (containerWidth < 480) return 0.72
    if (containerWidth < 640) return 0.82
    if (containerWidth < 768) return 0.9
    return 1
  }, [containerWidth])

  const effectiveCardWidth = Math.round(cardWidth * responsiveScale)
  const effectiveCardHeight = Math.round(cardHeight * responsiveScale)
  const effectiveSpread = Math.round(spread * responsiveScale)
  const effectiveDepth = Math.round(depth * responsiveScale)

  // Clamp visible cards on very narrow mobile screens
  const effectiveVisibleCards = useMemo(() => {
    if (containerWidth < 480) return Math.min(visibleCards, 1)
    if (containerWidth < 768) return Math.min(visibleCards, 2)
    return visibleCards
  }, [containerWidth, visibleCards])

  // Clamp active index if items change
  useEffect(() => {
    if (total === 0) {
      setActiveIndex(0)
    } else if (activeIndex >= total) {
      setActiveIndex(0)
    }
  }, [total, activeIndex])

  // Navigation handlers
  const goToNext = useCallback(() => {
    if (total <= 1) return
    setActiveIndex((prev) => {
      if (loop) return (prev + 1) % total
      return Math.min(prev + 1, total - 1)
    })
  }, [total, loop])

  const goToPrev = useCallback(() => {
    if (total <= 1) return
    setActiveIndex((prev) => {
      if (loop) return (prev - 1 + total) % total
      return Math.max(prev - 1, 0)
    })
  }, [total, loop])

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay || isHovered || total <= 1) return
    const timer = setInterval(() => {
      goToNext()
    }, autoplayDelay)
    return () => clearInterval(timer)
  }, [autoplay, isHovered, total, autoplayDelay, goToNext])

  // Touch and mouse drag gestures
  const dragStartX = useRef(null)
  const isDragging = useRef(false)

  const handlePointerDown = (clientX) => {
    dragStartX.current = clientX
    isDragging.current = true
  }

  const handlePointerUp = (clientX) => {
    if (!isDragging.current || dragStartX.current === null) return
    const deltaX = clientX - dragStartX.current
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        goToNext()
      } else {
        goToPrev()
      }
    }
    dragStartX.current = null
    isDragging.current = false
  }

  const resolvedEase = EASING_MAP[ease] || ease || 'cubic-bezier(0.215, 0.61, 0.355, 1)'

  if (total === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
        No items to display
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden select-none flex flex-col justify-between ${className}`}
      style={{
        perspective: `${perspective}px`,
        perspectiveOrigin: '50% 50%',
        ...style
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        isDragging.current = false
        dragStartX.current = null
      }}
      onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
      onTouchEnd={(e) => handlePointerUp(e.changedTouches[0].clientX)}
      onMouseDown={(e) => handlePointerDown(e.clientX)}
      onMouseUp={(e) => handlePointerUp(e.clientX)}
    >
      {/* 3D Scene Rail - Centered for bilateral presentation */}
      <div
        className="relative flex-1 w-full flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          transition: `transform ${duration}ms ${resolvedEase}`
        }}
      >
        {items.map((item, index) => {
          // Calculate relative position to active index with circular shortest-path
          let diff = index - activeIndex
          if (loop && total > 2) {
            while (diff > total / 2) diff -= total
            while (diff < -total / 2) diff += total
          }

          const absDiff = Math.abs(diff)
          const sign = Math.sign(diff)
          const isVisible = absDiff <= effectiveVisibleCards
          const isActive = diff === 0

          // Bilateral 3D transformations:
          // Left side (sign < 0): negative X, positive rotateY (angled inward)
          // Center (diff === 0): X=0, rotateY=0, full focus
          // Right side (sign > 0): positive X, negative rotateY (angled inward)
          let translateX = 0
          let translateY = 0
          let translateZ = 0
          let rotateYDeg = 0
          let opacity = 0
          let blurPx = 0
          let tintOpacity = 0
          let zIndex = 1

          if (isActive) {
            // Center active card
            translateX = 0
            translateY = 0
            translateZ = 0
            rotateYDeg = 0
            opacity = 1
            blurPx = 0
            tintOpacity = 0
            zIndex = effectiveVisibleCards * 2 + 10
          } else if (isVisible) {
            // Symmetrical side cards on left and right
            translateX = sign * absDiff * effectiveSpread
            translateY = 0
            translateZ = -absDiff * effectiveDepth
            rotateYDeg = -sign * tilt
            opacity = Math.max(0.35, 1 - absDiff * falloff)
            // Zero blur so template designs and text are completely sharp and readable!
            blurPx = blur > 0 ? Math.min(absDiff * blur, 4) : 0
            tintOpacity = Math.min(0.18, absDiff * (falloff * 0.4))
            zIndex = effectiveVisibleCards * 2 - absDiff
          } else {
            // Hidden cards beyond visible range
            translateX = sign * (effectiveVisibleCards + 1) * effectiveSpread
            translateY = 0
            translateZ = -(effectiveVisibleCards + 1) * effectiveDepth
            rotateYDeg = -sign * tilt
            opacity = 0
            blurPx = 0
            tintOpacity = 0.4
            zIndex = 0
          }

          return (
            <div
              key={item.id || index}
              onClick={() => {
                if (!isDragging.current) {
                  if (isActive) {
                    if (onCardClick) onCardClick(item, index)
                    else if (item.onClick) item.onClick()
                  } else if (isVisible) {
                    setActiveIndex(index)
                  }
                }
              }}
              className={`group absolute top-1/2 left-1/2 cursor-pointer transition-shadow ${
                isActive ? 'cursor-pointer' : 'cursor-pointer hover:brightness-105'
              }`}
              style={{
                width: `${effectiveCardWidth}px`,
                height: `${effectiveCardHeight}px`,
                marginLeft: `-${effectiveCardWidth / 2}px`,
                marginTop: `-${effectiveCardHeight / 2}px`,
                borderRadius: `${radius}px`,
                zIndex,
                opacity: isVisible ? opacity : 0,
                pointerEvents: isVisible ? 'auto' : 'none',
                transformStyle: 'preserve-3d',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',
                willChange: 'transform, opacity',
                transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateYDeg}deg)`,
                filter: blurPx > 0 ? `blur(${blurPx}px)` : 'none',
                transition: `transform ${duration}ms ${resolvedEase}, opacity ${duration}ms ${resolvedEase}, filter ${duration}ms ${resolvedEase}`
              }}
            >
              {/* Card Container with Crisp Elevation and Border */}
              <div
                className={`relative w-full h-full overflow-hidden bg-white border border-slate-200/90 transition-all duration-300 ${
                  isActive
                    ? 'shadow-[0_24px_50px_-12px_rgba(15,23,42,0.25),0_4px_16px_-2px_rgba(15,23,42,0.12)] ring-2 ring-brand-500/85'
                    : 'shadow-[0_12px_32px_-8px_rgba(15,23,42,0.18)]'
                }`}
                style={{ borderRadius: `${radius}px` }}
              >
                {/* Template Image Preview (Crisp & High-Res) */}
                <div className="relative w-full h-full bg-slate-50 flex items-center justify-center p-2.5 sm:p-3.5">
                  <img
                    src={item.image}
                    alt={item.alt || item.title || `Template ${index + 1}`}
                    className="w-full h-full object-contain rounded-md bg-white shadow-xs pointer-events-none"
                    style={{ imageRendering: 'auto' }}
                    loading="lazy"
                  />

                  {/* ATS Score Badge (if present) */}
                  {item.atsScore && (
                    <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10">
                      <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 rounded-full bg-emerald-600 text-white shadow-sm tracking-wide">
                        <Check size={10} strokeWidth={2.5} /> ATS {item.atsScore}
                      </span>
                    </div>
                  )}

                  {/* Layout / Category Badge */}
                  {(item.layoutType || item.category) && (
                    <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
                      <span className="inline-flex items-center text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 sm:px-2 rounded-full bg-white/95 text-slate-700 shadow-xs border border-slate-200/60 backdrop-blur-xs">
                        {item.layoutType || item.category}
                      </span>
                    </div>
                  )}

                  {/* Bottom Info Bar & Action Button */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-2.5 sm:p-3.5 pt-7 flex items-end justify-between gap-2 text-white">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-bold truncate drop-shadow-xs">
                        {item.title || item.alt}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-slate-300 font-medium truncate">
                        {item.category || 'Professional Template'}
                      </p>
                    </div>

                    {isActive && (
                      <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-brand-500 hover:bg-brand-600 px-2.5 py-1 text-[9px] sm:text-[10px] font-bold text-white shadow-sm transition-transform active:scale-95">
                        <Sparkles size={10} /> Use
                      </span>
                    )}
                  </div>
                </div>

                {/* Depth Falloff Tint Overlay (Subtle, preserves readability) */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity"
                  style={{
                    backgroundColor: tint,
                    opacity: tintOpacity,
                    borderRadius: `${radius}px`,
                    transitionDuration: `${duration}ms`,
                    transitionTimingFunction: resolvedEase
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Controls & Indicators Bottom Row */}
      <div className="relative z-30 mt-4 flex items-center justify-between px-4 sm:px-8 pointer-events-auto">
        {/* Left Control Button */}
        {showControls && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goToPrev()
            }}
            disabled={!loop && activeIndex === 0}
            className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white text-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-slate-200/80 transition-all hover:bg-slate-900 hover:text-white hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-30 disabled:pointer-events-none ${
              !loop && activeIndex === 0 ? 'invisible' : ''
            }`}
            aria-label="Previous template"
            title="Previous template"
          >
            <ChevronLeft size={20} strokeWidth={2.2} />
          </button>
        )}

        {/* Dots Indicators */}
        {showIndicators && total > 1 && (
          <div className="mx-auto flex items-center justify-center gap-1.5 py-2">
            {items.slice(0, Math.min(16, total)).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex(i)
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeIndex
                    ? 'w-6 bg-brand-600 shadow-xs'
                    : 'w-2 bg-slate-300/80 hover:bg-slate-400'
                }`}
                aria-label={`Jump to template ${i + 1}`}
                title={`Template ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Right Control Button */}
        {showControls && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            disabled={!loop && activeIndex === total - 1}
            className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white text-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-slate-200/80 transition-all hover:bg-slate-900 hover:text-white hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-30 disabled:pointer-events-none ${
              !loop && activeIndex === total - 1 ? 'invisible' : ''
            }`}
            aria-label="Next template"
            title="Next template"
          >
            <ChevronRight size={20} strokeWidth={2.2} />
          </button>
        )}
      </div>
    </div>
  )
}
