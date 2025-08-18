import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// Mobile-optimized touch gestures
const useSwipeGesture = (onSwipeLeft?: () => void, onSwipeRight?: () => void) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};

// Mobile-optimized list with virtual scrolling
const MobileOptimizedList = ({ items }: { items: string[] }) => {
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const itemHeight = 60;
  const visibleCount = 10;

  useEffect(() => {
    const endIndex = Math.min(startIndex + visibleCount, items.length);
    setVisibleItems(items.slice(startIndex, endIndex));
  }, [startIndex, items]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    setStartIndex(newStartIndex);
  };

  return (
    <div
      ref={containerRef}
      className="h-96 overflow-auto"
      onScroll={handleScroll}
      style={{ height: '400px' }}
    >
      <div style={{ height: `${items.length * itemHeight}px`, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            className="p-4 border-b border-gray-200"
            style={{
              position: 'absolute',
              top: `${(startIndex + index) * itemHeight}px`,
              height: `${itemHeight}px`,
              width: '100%',
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

// Mobile-optimized navigation
const MobileNavigation = () => {
  const [activeTab, setActiveTab] = useState('home');
  const swipeHandlers = useSwipeGesture(
    () => {
      // Swipe left - next tab
      const tabs = ['home', 'dashboard', 'settings'];
      const currentIndex = tabs.indexOf(activeTab);
      const nextIndex = (currentIndex + 1) % tabs.length;
      setActiveTab(tabs[nextIndex]);
    },
    () => {
      // Swipe right - previous tab
      const tabs = ['home', 'dashboard', 'settings'];
      const currentIndex = tabs.indexOf(activeTab);
      const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
      setActiveTab(tabs[prevIndex]);
    }
  );

  return (
    <div className="mobile-navigation" {...swipeHandlers}>
      <div className="flex justify-center space-x-4 p-4 bg-gray-100">
        {['home', 'dashboard', 'settings'].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab)}
            className="text-sm px-3 py-2"
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>
      
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Tab: {activeTab}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Swipe left or right to navigate between tabs</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Mobile-optimized form
const MobileOptimizedForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="Enter your message"
        />
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
};

// Main mobile optimized component
const MobileOptimized = () => {
  const [activeSection, setActiveSection] = useState('navigation');

  const sections = [
    { id: 'navigation', title: 'Navigation', component: <MobileNavigation /> },
    { id: 'form', title: 'Form', component: <MobileOptimizedForm /> },
    { id: 'list', title: 'List', component: <MobileOptimizedList items={Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`)} /> },
  ];

  return (
    <div className="max-w-md mx-auto">
      <div className="flex space-x-2 p-4 bg-gray-50">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? 'default' : 'outline'}
            onClick={() => setActiveSection(section.id)}
            className="text-xs px-2 py-1"
          >
            {section.title}
          </Button>
        ))}
      </div>

      <div className="p-4">
        {sections.find(s => s.id === activeSection)?.component}
      </div>
    </div>
  );
};

export default MobileOptimized;
