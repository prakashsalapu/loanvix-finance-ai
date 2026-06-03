import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Hook for scroll position
 */
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [scrollPercentage, setScrollPercentage] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight
      const percentage = (position / height) * 100

      setScrollPosition(position)
      setScrollPercentage(percentage)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { scrollPosition, scrollPercentage }
}

/**
 * Hook for intersection observer (scroll animations)
 */
export function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting)
    }, {
      threshold: 0.1,
      ...options
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [options])

  return [ref, isInView]
}

/**
 * Hook for animated counter
 */
export function useAnimatedCounter(end, duration = 1000, start = 0) {
  const [count, setCount] = useState(start)
  const [isAnimating, setIsAnimating] = useState(false)

  const animate = useCallback(() => {
    setIsAnimating(true)
    const startTime = performance.now()
    const startValue = start

    const step = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (end - startValue) * easeOut

      setCount(Math.round(current))

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setIsAnimating(false)
      }
    }

    requestAnimationFrame(step)
  }, [end, duration, start])

  return { count, animate, isAnimating }
}

/**
 * Hook for local storage
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

/**
 * Hook for window size
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

/**
 * Hook for media query
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}
