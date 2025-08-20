import React, { memo, useCallback, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/corporate/CorporateComponents';
import { CorporateCard, CorporateButton, CorporateCardContent, CorporateCardHeader, CorporateCardTitle } from '@/components/ui/corporate/CorporateComponents'

// Memoized component example
const MemoizedCard = memo(({ title, content, onClick }: {
  title: string;
  content: string;
  onClick: () => void;
}) => {
  return (
    <CorporateCard className="mb-4">
      <CorporateCardHeader>
        <CorporateCardTitle>{title}</CorporateCardTitle>
      </CorporateCardHeader>
      <CorporateCardContent>
        <p>{content}</p>
        <CorporateButton onClick={onClick}>Action</CorporateButton>
      </CorporateCardContent>
    </CorporateCard>
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
    <div className="p-6 bg-card rounded-lg border">
      <h1 className="text-2xl font-bold mb-6">Performance Optimized Components</h1>

      <div className="mb-6">
        <CorporateButton onClick={handleAddItem} className="mr-4">
          Add Item
        </CorporateButton>

      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Total word count: {totalWordCount}
        </p>
      </div>

      <OptimizedList items={items} onItemClick={handleItemClick} />


    </div>
  );
};

export default PerformanceOptimized;
