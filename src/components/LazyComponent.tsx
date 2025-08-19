import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const LazyComponent = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Lazy Loaded Component</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This component was loaded lazily using React.lazy() and Suspense.</p>
        <p className="text-sm text-gray-600 mt-2">
          This helps reduce the initial bundle size by only loading components when they&#39;re needed.
        </p>
      </CardContent>
    </Card>
  );
};

export default LazyComponent;
