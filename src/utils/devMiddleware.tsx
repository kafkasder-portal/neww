// Development middleware for hot reload optimizations
import React from 'react'

// Hot reload state management
class HotReloadManager {
  private static instance: HotReloadManager
  private updateQueue: Set<string> = new Set()
  private debounceTimer: NodeJS.Timeout | null = null
  private readonly debounceDelay = 100

  static getInstance(): HotReloadManager {
    if (!HotReloadManager.instance) {
      HotReloadManager.instance = new HotReloadManager()
    }
    return HotReloadManager.instance
  }

  registerComponent(componentName: string) {
    this.updateQueue.add(componentName)
    this.scheduleUpdate()
  }

  private scheduleUpdate() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    this.debounceTimer = setTimeout(() => {
      this.processUpdates()
    }, this.debounceDelay)
  }

  private processUpdates() {
    if (this.updateQueue.size > 0) {
      console.debug('Processing hot reload updates:', Array.from(this.updateQueue))
      this.updateQueue.clear()
    }
  }

  clearQueue() {
    this.updateQueue.clear()
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }
  }
}

// Hook for hot reload optimization
export function useHotReload(componentName: string) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const manager = HotReloadManager.getInstance()
      manager.registerComponent(componentName)
    }
  }, [componentName])
}

// HOC for hot reload optimization
export function withHotReload<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component'
  
  const HotReloadWrapper = (props: P) => {
    useHotReload(displayName)
    return React.createElement(WrappedComponent, props)
  }

  HotReloadWrapper.displayName = `withHotReload(${displayName})`
  return HotReloadWrapper
}

// Error boundary for hot reload errors
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error }>
}

export class HotReloadErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[HMR] Component error caught:', error, errorInfo)
      
      // Try to recover from hot reload errors
      if (error.message.includes('Cannot read property') || error.message.includes('is not a function')) {
        // Reset error state after a short delay
        setTimeout(() => {
          this.setState({ hasError: false, error: null })
        }, 100)
      }
    }
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback
      
      if (FallbackComponent && this.state.error) {
        return React.createElement(FallbackComponent, { error: this.state.error })
      }
      
      return React.createElement('div', {
        style: { 
          padding: '20px', 
          border: '2px solid #ff6b6b', 
          borderRadius: '8px', 
          backgroundColor: '#ffe0e0',
          color: '#d63031',
          fontFamily: 'monospace'
        }
      }, [
        React.createElement('h3', { key: 'title' }, '🔥 Hot Reload Error'),
        React.createElement('p', { key: 'message' }, 'Component failed to hot reload. This is usually temporary.'),
        React.createElement('button', {
          key: 'retry',
          onClick: () => this.setState({ hasError: false, error: null }),
          style: {
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#d63031',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }
        }, 'Retry')
      ])
    }

    return this.props.children
  }
}

// Fast refresh utilities
export const fastRefreshUtils = {
  // Preserve component state during hot reload
  preserveState: function<T>(key: string, initialValue: T): [T, (value: T) => void] {
    if (process.env.NODE_ENV !== 'development') {
      return React.useState(initialValue)
    }

    // Use a global store to preserve state across hot reloads
    const globalStore = (window as any).__DEV_STATE_STORE__ || {}
    if (!(window as any).__DEV_STATE_STORE__) {
      (window as any).__DEV_STATE_STORE__ = globalStore
    }

    const [state, setState] = React.useState(() => {
      return globalStore[key] !== undefined ? globalStore[key] : initialValue
    })

    const setStateWithPersist = React.useCallback((value: T) => {
      globalStore[key] = value
      setState(value)
    }, [key])

    return [state, setStateWithPersist]
  },

  // Clear preserved state
  clearPreservedState: function(key?: string) {
    if (process.env.NODE_ENV !== 'development') return
    
    const globalStore = (window as any).__DEV_STATE_STORE__
    if (!globalStore) return

    if (key) {
      delete globalStore[key]
    } else {
      Object.keys(globalStore).forEach(k => delete globalStore[k])
    }
  },

  // Get all preserved state keys
  getPreservedStateKeys: function(): string[] {
    if (process.env.NODE_ENV !== 'development') return []
    
    const globalStore = (window as any).__DEV_STATE_STORE__
    return globalStore ? Object.keys(globalStore) : []
  }
}

// Development performance monitor for hot reload
export class HotReloadPerformanceMonitor {
  private static instance: HotReloadPerformanceMonitor
  private reloadTimes: number[] = []
  private startTime: number = 0

  static getInstance(): HotReloadPerformanceMonitor {
    if (!HotReloadPerformanceMonitor.instance) {
      HotReloadPerformanceMonitor.instance = new HotReloadPerformanceMonitor()
    }
    return HotReloadPerformanceMonitor.instance
  }

  startReload() {
    this.startTime = performance.now()
  }

  endReload() {
    if (this.startTime === 0) return
    
    const reloadTime = performance.now() - this.startTime
    this.reloadTimes.push(reloadTime)
    
    // Keep only last 50 reload times
    if (this.reloadTimes.length > 50) {
      this.reloadTimes.shift()
    }

    console.debug(`Hot reload completed in ${reloadTime.toFixed(2)}ms`)
    
    this.startTime = 0
  }

  getStats() {
    if (this.reloadTimes.length === 0) {
      return { average: 0, min: 0, max: 0, total: 0 }
    }

    const total = this.reloadTimes.length
    const sum = this.reloadTimes.reduce((a, b) => a + b, 0)
    const average = sum / total
    const min = Math.min(...this.reloadTimes)
    const max = Math.max(...this.reloadTimes)

    return { average, min, max, total }
  }

  logStats() {
    const stats = this.getStats()
    console.debug('Hot reload stats:', {
      'Average reload': stats.average.toFixed(2) + 'ms',
      'Fastest reload': stats.min.toFixed(2) + 'ms',
      'Slowest reload': stats.max.toFixed(2) + 'ms',
      'Total reloads': stats.total
    })
  }
}

// Initialize hot reload optimizations
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const manager = HotReloadManager.getInstance()
  const monitor = HotReloadPerformanceMonitor.getInstance()
  
  // Listen for Vite HMR events
  if (import.meta.hot) {
    import.meta.hot.on('vite:beforeUpdate', function() {
      monitor.startReload()
    })
    
    import.meta.hot.on('vite:afterUpdate', function() {
      monitor.endReload()
    })
    
    import.meta.hot.on('vite:error', function(error) {
      console.error('[HMR] Error:', error)
      manager.clearQueue()
    })
  }
  
  // Expose utilities to window for debugging
  ;(window as any).hotReloadManager = manager
  ;(window as any).hotReloadMonitor = monitor
  ;(window as any).fastRefreshUtils = fastRefreshUtils
}

export { HotReloadManager }
export default HotReloadManager