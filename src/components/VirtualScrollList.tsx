import React, { useState, useCallback, useMemo } from 'react';
import { useViewportOptimization } from '../hooks/useViewportOptimization';

interface VirtualScrollListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export function VirtualScrollList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = ''
}: VirtualScrollListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const { viewport } = useViewportOptimization();

  // Adjust item height for mobile
  const adjustedItemHeight = useMemo(() => {
    if (viewport.isMobile) {
      return Math.max(itemHeight, 60); // Minimum touch target
    }
    return itemHeight;
  }, [itemHeight, viewport.isMobile]);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / adjustedItemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / adjustedItemHeight),
      items.length - 1
    );

    return {
      start: Math.max(0, startIndex - overscan),
      end: Math.min(items.length - 1, endIndex + overscan)
    };
  }, [scrollTop, adjustedItemHeight, containerHeight, items.length, overscan]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange]);

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Total height
  const totalHeight = items.length * adjustedItemHeight;

  // Offset for visible items
  const offsetY = visibleRange.start * adjustedItemHeight;

  return (
    <div
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => {
            const actualIndex = visibleRange.start + index;
            return (
              <div
                key={actualIndex}
                style={{ height: adjustedItemHeight }}
                className="flex items-center"
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Hook for managing virtual scroll state
export const useVirtualScroll = <T,>(items: T[], itemHeight: number) => {
  const { viewport } = useViewportOptimization();
  
  const containerHeight = useMemo(() => {
    if (viewport.isMobile) {
      return viewport.height - 200; // Account for header/footer
    }
    return Math.min(600, viewport.height - 100);
  }, [viewport]);

  const shouldUseVirtualScroll = useMemo(() => {
    // Use virtual scrolling for large lists on mobile
    return viewport.isMobile && items.length > 20;
  }, [viewport.isMobile, items.length]);

  return {
    containerHeight,
    shouldUseVirtualScroll,
    adjustedItemHeight: viewport.isMobile ? Math.max(itemHeight, 60) : itemHeight
  };
};