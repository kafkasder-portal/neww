import React, { memo, useMemo, useCallback, Suspense, lazy } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// Lazy loading example
const LazyComponent = lazy(() => import('./LazyComponent'));

// Memoized component example
const MemoizedCard = memo(({ title, content, onClick }: {
  title: string;
  content: string;
  onClick: () => void;
}) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
        <Button onClick={onClick}>Action</Button>
      </CardContent>
    </Card>
  );
});

MemoizedCard.displayName = 'MemoizedCard';

// Performance optimized list component
const OptimizedList = memo(({ items, onItemClick }: {
  items: Array<{ id: string; title: string; content: string }>;
  onItemClick: (id: string) => void;
}) => {
  // Memoize expensive calculations
  const processedItems = useMemo(() => {
    return items.map(item => ({
      ...item,
      processedTitle: item.title.toUpperCase(),
      wordCount: item.content.split(' ').length
    }));
  }, [items]);

  // Memoize callback functions
  const handleItemClick = useCallback((id: string) => {
    onItemClick(id);
  }, [onItemClick]);

  return (
    <div className="space-y-4">
      {processedItems.map(item => (
        <MemoizedCard
          key={item.id}
          title={item.processedTitle}
          content={`${item.content} (${item.wordCount} words)`}
          onClick={() => handleItemClick(item.id)}
        />
      ))}
    </div>
  );
});

OptimizedList.displayName = 'OptimizedList';

// Main performance optimized component
const PerformanceOptimized = () => {
  const [items, setItems] = React.useState([
    { id: '1', title: 'Item 1', content: 'This is the first item content' },
    { id: '2', title: 'Item 2', content: 'This is the second item content' },
    { id: '3', title: 'Item 3', content: 'This is the third item content' },
  ]);

  const [showLazy, setShowLazy] = React.useState(false);

  // Memoize expensive calculations
  const totalWordCount = useMemo(() => {
    return items.reduce((total, item) => {
      return total + item.content.split(' ').length;
    }, 0);
  }, [items]);

  // Memoize callback functions
  const handleItemClick = useCallback((id: string) => {
    console.log(`Item ${id} clicked`);
  }, []);

  const handleAddItem = useCallback(() => {
    const newId = (items.length + 1).toString();
    setItems(prev => [...prev, {
      id: newId,
      title: `Item ${newId}`,
      content: `This is item ${newId} content`
    }]);
  }, [items.length]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Performance Optimized Components</h1>
      
      <div className="mb-6">
        <Button onClick={handleAddItem} className="mr-4">
          Add Item
        </Button>
        <Button onClick={() => setShowLazy(!showLazy)} variant="outline">
          {showLazy ? 'Hide' : 'Show'} Lazy Component
        </Button>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Total word count: {totalWordCount}
        </p>
      </div>

      <OptimizedList items={items} onItemClick={handleItemClick} />

      {showLazy && (
        <Suspense fallback={<div>Loading lazy component...</div>}>
          <LazyComponent />
        </Suspense>
      )}
    </div>
  );
};

export default PerformanceOptimized;
