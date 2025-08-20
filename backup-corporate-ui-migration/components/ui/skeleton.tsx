import React from 'react';
import { cn } from '@lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'card' | 'avatar' | 'button';
  size?: 'small' | 'medium' | 'large';
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', size = 'medium', ...props }, ref) => {
    const baseClasses = 'skeleton';
    
    const variantClasses = {
      text: 'skeleton-text',
      card: 'skeleton-card',
      avatar: 'skeleton-avatar',
      button: 'skeleton-button'
    };
    
    const sizeClasses = {
      small: 'small',
      medium: '',
      large: 'large'
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          size !== 'medium' && sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Skeleton Group Component for multiple skeletons
interface SkeletonGroupProps {
  count?: number;
  variant?: 'text' | 'card' | 'avatar' | 'button';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  count = 3,
  variant = 'text',
  size = 'medium',
  className
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} variant={variant} size={size} />
      ))}
    </div>
  );
};

// Card Skeleton Component
const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('corporate-card-enhanced p-6', className)}>
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton variant="avatar" />
        <div className="flex-1">
          <Skeleton variant="text" size="large" className="w-3/4" />
          <Skeleton variant="text" size="small" className="w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-5/6" />
        <Skeleton variant="text" className="w-4/6" />
      </div>
      <div className="flex justify-end mt-4">
        <Skeleton variant="button" />
      </div>
    </div>
  );
};

export { Skeleton, SkeletonGroup, CardSkeleton };