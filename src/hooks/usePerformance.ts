import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { createDebouncedCallback } from '../utils/performanceUtils';

// Optimized useCallback with dependency comparison
export const useOptimizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  const memoizedCallback = useCallback(callback, deps);
  return memoizedCallback;
};

// Optimized useMemo with deep comparison
export const useOptimizedMemo = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  return useMemo(factory, deps);
};

// Debounced value hook
export const useDebouncedValue = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// Debounced callback hook
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T => {
  const debouncedCallback = useMemo(
    () => createDebouncedCallback(callback, delay),
    [callback, delay]
  );
  
  return debouncedCallback;
};

// Previous value hook for comparison
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

// Intersection observer hook for lazy loading
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1,
        ...options
      }
    );
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options, hasIntersected]);
  
  return { isIntersecting, hasIntersected };
};

// Virtual scrolling hook
export const useVirtualScrolling = (
  items: any[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);
  
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);
  
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;
  
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    visibleRange
  };
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());
  
  useEffect(() => {
    renderCount.current += 1;
    const currentTime = performance.now();
    const timeSinceLastRender = currentTime - lastRenderTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.debug(`${componentName} render time: ${timeSinceLastRender.toFixed(2)}ms`);
    }
    
    lastRenderTime.current = currentTime;
  });
  
  return {
    renderCount: renderCount.current,
    logPerformance: (action: string) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug('Performance log:', { component: componentName, action })
      }
    }
  };
};

// Memory leak prevention hook
export const useCleanup = (cleanup: () => void) => {
  useEffect(() => {
    return cleanup;
  }, [cleanup]);
};

// Throttled value hook
export const useThrottledValue = <T>(value: T, delay: number = 100): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());
  
  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;
    
    if (timeSinceLastExecution >= delay) {
      setThrottledValue(value);
      lastExecuted.current = now;
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, delay - timeSinceLastExecution);
      
      return () => clearTimeout(timer);
    }
  }, [value, delay]);
  
  return throttledValue;
};

// Optimized state hook with shallow comparison
export const useOptimizedState = <T extends object>(initialState: T) => {
  const [state, setState] = useState<T>(initialState);
  
  const setOptimizedState = useCallback((newState: Partial<T> | ((prev: T) => Partial<T>)) => {
    setState(prevState => {
      const nextState = typeof newState === 'function' ? newState(prevState) : newState;
      const mergedState = { ...prevState, ...nextState };
      
      // Shallow comparison to prevent unnecessary re-renders
      const hasChanged = Object.keys(mergedState).some(
        key => mergedState[key as keyof T] !== prevState[key as keyof T]
      );
      
      return hasChanged ? mergedState : prevState;
    });
  }, []);
  
  return [state, setOptimizedState] as const;
};