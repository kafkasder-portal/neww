import { useEffect, useCallback, useRef } from 'react';

interface MemoryInfo {
  usedJSHeapSize?: number;
  totalJSHeapSize?: number;
  jsHeapSizeLimit?: number;
}

export const useMemoryOptimization = () => {
  const cleanupFunctions = useRef<(() => void)[]>([]);
  const intervalRefs = useRef<NodeJS.Timeout[]>([]);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  // Get memory info if available
  const getMemoryInfo = useCallback((): MemoryInfo => {
    if ('memory' in performance) {
      const memory = (performance as unknown as { memory: MemoryInfo }).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
    return {};
  }, []);

  // Check if memory usage is high
  const isMemoryHigh = useCallback((): boolean => {
    const memory = getMemoryInfo();
    if (memory.usedJSHeapSize && memory.jsHeapSizeLimit) {
      return memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8;
    }
    return false;
  }, [getMemoryInfo]);

  // Register cleanup function
  const registerCleanup = useCallback((cleanup: () => void) => {
    cleanupFunctions.current.push(cleanup);
  }, []);

  // Optimized setTimeout that tracks references
  const optimizedSetTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = setTimeout(() => {
      callback();
      // Remove from tracking array
      const index = timeoutRefs.current.indexOf(timeoutId);
      if (index > -1) {
        timeoutRefs.current.splice(index, 1);
      }
    }, delay);
    
    timeoutRefs.current.push(timeoutId);
    return timeoutId;
  }, []);

  // Optimized setInterval that tracks references
  const optimizedSetInterval = useCallback((callback: () => void, delay: number) => {
    const intervalId = setInterval(callback, delay);
    intervalRefs.current.push(intervalId);
    return intervalId;
  }, []);

  // Clear specific timeout
  const clearOptimizedTimeout = useCallback((timeoutId: NodeJS.Timeout) => {
    clearTimeout(timeoutId);
    const index = timeoutRefs.current.indexOf(timeoutId);
    if (index > -1) {
      timeoutRefs.current.splice(index, 1);
    }
  }, []);

  // Clear specific interval
  const clearOptimizedInterval = useCallback((intervalId: NodeJS.Timeout) => {
    clearInterval(intervalId);
    const index = intervalRefs.current.indexOf(intervalId);
    if (index > -1) {
      intervalRefs.current.splice(index, 1);
    }
  }, []);

  // Force garbage collection if available
  const forceGarbageCollection = useCallback(() => {
    if ('gc' in window && typeof (window as unknown as { gc?: () => void }).gc === 'function') {
      (window as unknown as { gc: () => void }).gc();
    }
  }, []);

  // Cleanup all resources
  const cleanupAll = useCallback(() => {
    // Run all registered cleanup functions
    cleanupFunctions.current.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.warn('Cleanup function failed:', error);
      }
    });
    
    // Clear all timeouts
    timeoutRefs.current.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    
    // Clear all intervals
    intervalRefs.current.forEach(intervalId => {
      clearInterval(intervalId);
    });
    
    // Reset arrays
    cleanupFunctions.current = [];
    timeoutRefs.current = [];
    intervalRefs.current = [];
  }, []);

  // Auto cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAll();
    };
  }, [cleanupAll]);

  // Monitor memory usage on mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    const checkMemory = () => {
      if (isMemoryHigh()) {
        console.warn('High memory usage detected, consider cleanup');
        // Trigger cleanup for non-essential resources
        forceGarbageCollection();
      }
    };

    const memoryCheckInterval = setInterval(checkMemory, 30000); // Check every 30 seconds
    
    return () => {
      clearInterval(memoryCheckInterval);
    };
  }, [isMemoryHigh, forceGarbageCollection]);

  return {
    getMemoryInfo,
    isMemoryHigh,
    registerCleanup,
    optimizedSetTimeout,
    optimizedSetInterval,
    clearOptimizedTimeout,
    clearOptimizedInterval,
    forceGarbageCollection,
    cleanupAll
  };
};