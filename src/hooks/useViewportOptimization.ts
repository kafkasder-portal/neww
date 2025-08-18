import { useState, useEffect, useCallback } from 'react';

interface ViewportInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
}

export const useViewportOptimization = () => {
  const [viewport, setViewport] = useState<ViewportInfo>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    orientation: 'portrait'
  });

  const [isVisible, setIsVisible] = useState(true);

  const updateViewport = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    setViewport({
      width,
      height,
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      orientation: width > height ? 'landscape' : 'portrait'
    });
  }, []);

  useEffect(() => {
    updateViewport();
    
    const handleResize = () => {
      updateViewport();
    };

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updateViewport]);

  // Optimize rendering based on viewport
  const shouldRenderComponent = useCallback((priority: 'high' | 'medium' | 'low' = 'medium') => {
    if (!isVisible) return false;
    
    // On mobile, prioritize high priority components
    if (viewport.isMobile) {
      return priority === 'high';
    }
    
    // On tablet, render high and medium priority
    if (viewport.isTablet) {
      return priority !== 'low';
    }
    
    // On desktop, render all
    return true;
  }, [viewport.isMobile, viewport.isTablet, isVisible]);

  // Get optimal grid columns based on viewport
  const getOptimalColumns = useCallback((maxColumns: number = 4) => {
    if (viewport.isMobile) {
      return viewport.orientation === 'portrait' ? 1 : 2;
    }
    if (viewport.isTablet) {
      return viewport.orientation === 'portrait' ? 2 : 3;
    }
    return Math.min(maxColumns, 4);
  }, [viewport]);

  // Get optimal item size for lists
  const getOptimalItemHeight = useCallback(() => {
    if (viewport.isMobile) {
      return viewport.orientation === 'portrait' ? 120 : 100;
    }
    return 140;
  }, [viewport]);

  return {
    viewport,
    isVisible,
    shouldRenderComponent,
    getOptimalColumns,
    getOptimalItemHeight
  };
};