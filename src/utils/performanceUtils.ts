import { lazy, memo, ComponentType, LazyExoticComponent, createElement } from 'react';
import { debounce } from './debounce';

// Lazy loading utility with error boundary
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ComponentType
): LazyExoticComponent<T> => {
  return lazy(async () => {
    try {
      const module = await importFn();
      return module;
    } catch (error) {
      console.error('Lazy component loading failed:', error);
      // Return fallback component or empty component
      return {
        default: (fallback || (() => null)) as unknown as T
      };
    }
  });
};

// Memoization utility with custom comparison
export const createMemoComponent = <P extends object>(
  Component: ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  return memo(Component, areEqual);
};

// Deep comparison for complex props
export const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  
  if (obj1 == null || obj2 == null) return false;
  
  if (typeof obj1 !== typeof obj2) return false;
  
  if (typeof obj1 !== 'object') return obj1 === obj2;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }
  
  return true;
};

// Shallow comparison for simple props
export const shallowEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  
  if (obj1 == null || obj2 == null) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  
  return true;
};

// Debounced state update utility
export const createDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T => {
  return debounce(callback, delay) as T;
};

// Performance monitoring utilities
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

export const measureAsyncPerformance = async (name: string, fn: () => Promise<any>) => {
  const start = performance.now();
  await fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// Memory usage monitoring
export const logMemoryUsage = (label: string) => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log(`${label} - Memory Usage:`, {
      used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
      total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
      limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`
    });
  }
};

// Component render optimization
export const withPerformanceTracking = <P extends object>(
  Component: ComponentType<P>,
  componentName: string
) => {
  return memo((props: P) => {
    const renderStart = performance.now();
    
    const result = createElement(Component, props);
    
    const renderEnd = performance.now();
    if (renderEnd - renderStart > 16) { // More than one frame (16ms)
      console.warn(`${componentName} render took ${renderEnd - renderStart}ms`);
    }
    
    return result;
  });
};

// Intersection Observer utility for lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Virtual scrolling utility
export const calculateVisibleItems = (
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 5
) => {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  return { startIndex, endIndex };
};