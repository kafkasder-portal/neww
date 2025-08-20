import { useGesture } from '@use-gesture/react'
import { useState, useCallback, startTransition } from 'react'

interface SwipeGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  velocity?: number
  preventScroll?: boolean
}

export const useSwipeGestures = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  velocity = 0.3,
  preventScroll = false
}: SwipeGestureOptions) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const resetPosition = useCallback(() => {
    startTransition(() => {
      setDragOffset({ x: 0, y: 0 })
      setIsDragging(false)
    })
  }, [])

  const bind = useGesture(
    {
      onDrag: ({ movement: [mx, my], dragging, velocity: [vx, vy], direction: [dx, dy] }) => {
        startTransition(() => {
          setIsDragging(dragging || false)
        })
        
        if (dragging) {
          startTransition(() => {
            setDragOffset({ x: mx, y: my })
          })
        } else {
          // Check if swipe threshold is met
          const absX = Math.abs(mx)
          const absY = Math.abs(my)
          const absVx = Math.abs(vx)
          const absVy = Math.abs(vy)

          // Horizontal swipe
          if (absX > threshold || absVx > velocity) {
            if (dx > 0 && onSwipeRight) {
              onSwipeRight()
            } else if (dx < 0 && onSwipeLeft) {
              onSwipeLeft()
            }
          }
          
          // Vertical swipe
          if (absY > threshold || absVy > velocity) {
            if (dy > 0 && onSwipeDown) {
              onSwipeDown()
            } else if (dy < 0 && onSwipeUp) {
              onSwipeUp()
            }
          }

          resetPosition()
        }
      },
      onDragEnd: () => {
        resetPosition()
      }
    },
    {
      drag: {
        filterTaps: true,
        threshold: 10,
        preventScroll: preventScroll
      }
    }
  )

  return {
    bind,
    isDragging,
    dragOffset,
    resetPosition
  }
}

// Swipeable card hook with visual feedback
export const useSwipeableCard = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 100
}: {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
}) => {
  const [isRemoving, setIsRemoving] = useState(false)
  
  const { bind, isDragging, dragOffset, resetPosition } = useSwipeGestures({
    onSwipeLeft: () => {
      if (onSwipeLeft) {
        startTransition(() => {
          setIsRemoving(true)
        })
        setTimeout(() => {
          onSwipeLeft()
          startTransition(() => {
            setIsRemoving(false)
          })
        }, 200)
      }
    },
    onSwipeRight: () => {
      if (onSwipeRight) {
        startTransition(() => {
          setIsRemoving(true)
        })
        setTimeout(() => {
          onSwipeRight()
          startTransition(() => {
            setIsRemoving(false)
          })
        }, 200)
      }
    },
    threshold,
    preventScroll: true
  })

  const getSwipeStyle = () => {
    if (isRemoving) {
      return {
        transform: `translateX(${dragOffset.x > 0 ? '100%' : '-100%'})`,
        opacity: 0,
        transition: 'all 0.2s ease-out'
      }
    }
    
    if (isDragging) {
      const opacity = Math.max(0.7, 1 - Math.abs(dragOffset.x) / 200)
      return {
        transform: `translateX(${dragOffset.x}px) rotate(${dragOffset.x * 0.1}deg)`,
        opacity,
        transition: 'none'
      }
    }
    
    return {
      transform: 'translateX(0px) rotate(0deg)',
      opacity: 1,
      transition: 'all 0.2s ease-out'
    }
  }

  return {
    bind,
    isDragging,
    isRemoving,
    getSwipeStyle,
    resetPosition
  }
}