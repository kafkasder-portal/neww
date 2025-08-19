import React, { Profiler } from 'react'
import { PerformanceService } from '@services/performanceService'

interface ReactProfilerProps {
  id: string
  children: React.ReactNode
  enabled?: boolean
  threshold?: number // Minimum render time to record (ms)
}

/**
 * React Profiler wrapper component
 * Render performansını otomatik olarak ölçer ve kaydeder
 */
export default function ReactProfilerWrapper({ 
  id, 
  children, 
  enabled = process.env.NODE_ENV === 'development',
  threshold = 5 
}: ReactProfilerProps) {
  const onRenderCallback = ((
    profileId: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number,
    interactions?: any
  ) => {
    // Sadece threshold'u aşan render'ları kaydet
    if (actualDuration >= threshold) {
      PerformanceService.recordRenderPerformance(
        `${profileId}-${phase}`,
        actualDuration,
        baseDuration,
        startTime,
        commitTime
      )
      
      // Development'ta console'a yazdır
      if (process.env.NODE_ENV === 'development' && actualDuration > 16) {
        console.warn(
          `🐌 Slow render detected: ${profileId} (${phase}) - ${actualDuration.toFixed(2)}ms`,
          {
            actualDuration,
            baseDuration,
            phase,
            interactions: interactions ? Array.from(interactions) : [],
          }
        )
      }
    }
  }) as React.ProfilerOnRenderCallback

  if (!enabled) {
    return <>{children}</>
  }

  return (
    <Profiler id={id} onRender={onRenderCallback}>
      {children}
    </Profiler>
  )
}

/**
 * HOC version of React Profiler
 */
export function withReactProfiler<P extends Record<string, never>>(
  WrappedComponent: React.ComponentType<P>,
  profileId?: string,
  options?: Omit<ReactProfilerProps, 'id' | 'children'>
) {
  const displayName = profileId || WrappedComponent.displayName || WrappedComponent.name || 'Component'
  
  const ProfiledComponent = React.forwardRef<any, P>((props, ref) => {
    return (
      <ReactProfilerWrapper id={displayName} {...options}>
        <WrappedComponent {...props as P} ref={ref} />
      </ReactProfilerWrapper>
    )
  })
  
  ProfiledComponent.displayName = `withReactProfiler(${displayName})`
  
  return ProfiledComponent
}

/**
 * Hook for measuring custom performance metrics
 */
export function usePerformanceMeasure(measureName: string) {
  const startMeasure = React.useCallback(() => {
    performance.mark(`${measureName}-start`)
  }, [measureName])
  
  const endMeasure = React.useCallback(() => {
    try {
      performance.mark(`${measureName}-end`)
      performance.measure(measureName, `${measureName}-start`, `${measureName}-end`)
      
      const measure = performance.getEntriesByName(measureName, 'measure')[0]
      if (measure) {
        PerformanceService.recordCustomMetric(`custom-${measureName}`, measure.duration, {
          measureName,
          timestamp: Date.now(),
        })
        
        // Cleanup
        performance.clearMarks(`${measureName}-start`)
        performance.clearMarks(`${measureName}-end`)
        performance.clearMeasures(measureName)
        
        return measure.duration
      }
    } catch (error) {
      console.warn('Performance measurement failed:', error)
    }
    return null
  }, [measureName])
  
  return { startMeasure, endMeasure }
}

/**
 * Hook for measuring component lifecycle performance
 */
export function useComponentPerformance(componentName: string) {
  const mountTimeRef = React.useRef<number>()
  const renderCountRef = React.useRef(0)
  const lastRenderTimeRef = React.useRef<number>()
  
  // Mount time measurement
  React.useEffect(() => {
    const mountTime = performance.now()
    mountTimeRef.current = mountTime
    
    PerformanceService.recordCustomMetric(`component-mount-${componentName}`, mountTime, {
      componentName,
      lifecycle: 'mount',
    })
    
    return () => {
      // Unmount time measurement
      const unmountTime = performance.now()
      const lifeTime = mountTime ? unmountTime - mountTime : 0
      
      PerformanceService.recordCustomMetric(`component-lifetime-${componentName}`, lifeTime, {
        componentName,
        lifecycle: 'unmount',
        renderCount: renderCountRef.current,
      })
    }
  }, [componentName])
  
  // Render time measurement
  React.useEffect(() => {
    const renderTime = performance.now()
    renderCountRef.current++
    
    if (lastRenderTimeRef.current) {
      const timeSinceLastRender = renderTime - lastRenderTimeRef.current
      
      PerformanceService.recordCustomMetric(`component-render-gap-${componentName}`, timeSinceLastRender, {
        componentName,
        lifecycle: 'render',
        renderCount: renderCountRef.current,
      })
    }
    
    lastRenderTimeRef.current = renderTime
  })
  
  return {
    renderCount: renderCountRef.current,
    mountTime: mountTimeRef.current,
  }
}

/**
 * Component for measuring expensive operations
 */
interface PerformanceBoundaryProps {
  name: string
  children: React.ReactNode
  onSlowRender?: (duration: number) => void
  threshold?: number
}

export function PerformanceBoundary({ 
  name, 
  children, 
  onSlowRender,
  threshold = 16 
}: PerformanceBoundaryProps) {
  const startTimeRef = React.useRef<number>()
  
  React.useLayoutEffect(() => {
    startTimeRef.current = performance.now()
  })
  
  React.useEffect(() => {
    if (startTimeRef.current) {
      const duration = performance.now() - startTimeRef.current
      
      if (duration > threshold) {
        PerformanceService.recordCustomMetric(`boundary-${name}`, duration, {
          boundaryName: name,
          threshold,
          exceeded: true,
        })
        
        onSlowRender?.(duration)
        
        if (process.env.NODE_ENV === 'development') {
          console.warn(`🐌 Slow boundary: ${name} - ${duration.toFixed(2)}ms`)
        }
      }
    }
  })
  
  return <>{children}</>
}

/**
 * Hook for debounced performance measurements
 */
export function useDebouncedPerformance(callback: () => void, delay: number, deps: React.DependencyList) {
  const { startMeasure, endMeasure } = usePerformanceMeasure('debounced-operation')
  
  React.useEffect(() => {
    startMeasure()
    const timer = setTimeout(() => {
      callback()
      endMeasure()
    }, delay)
    
    return () => {
      clearTimeout(timer)
      endMeasure() // End measurement even if cancelled
    }
  }, [...deps, delay])
}

/**
 * Performance monitoring for async operations
 */
export function useAsyncPerformance<T>(
  asyncOperation: () => Promise<T>,
  operationName: string
): {
  execute: () => Promise<T>
  isLoading: boolean
  lastDuration: number | null
} {
  const [isLoading, setIsLoading] = React.useState(false)
  const [lastDuration, setLastDuration] = React.useState<number | null>(null)
  
  const execute = React.useCallback(async (): Promise<T> => {
    const startTime = performance.now()
    setIsLoading(true)
    
    try {
      const result = await asyncOperation()
      const duration = performance.now() - startTime
      
      setLastDuration(duration)
      PerformanceService.recordCustomMetric(`async-${operationName}`, duration, {
        operationName,
        success: true,
      })
      
      return result
    } catch (error) {
      const duration = performance.now() - startTime
      
      setLastDuration(duration)
      PerformanceService.recordCustomMetric(`async-${operationName}`, duration, {
        operationName,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [asyncOperation, operationName])
  
  return { execute, isLoading, lastDuration }
}
