import { useState, useEffect } from 'react'

export const useCountUp = (end, duration = 1500) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime = null
    let animationFrame = null

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const progressRatio = Math.min(progress / duration, 1)
      
      // Easing function (easeOutQuad)
      const easedProgress = progressRatio * (2 - progressRatio)
      
      setCount(Math.floor(easedProgress * end))
      
      if (progressRatio < 1) {
        animationFrame = requestAnimationFrame(step)
      } else {
        setCount(end)
      }
    }

    animationFrame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return count
}
