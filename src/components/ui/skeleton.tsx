import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const skeletonVariants = cva(
  [
    // Base styles with enhanced UX
    "animate-pulse rounded-md bg-muted",
    "transition-all duration-200 ease-out",
  ],
  {
    variants: {
      variant: {
        default: "bg-muted",
        primary: "bg-primary/10",
        secondary: "bg-secondary/10",
        muted: "bg-muted/50",
        dark: "bg-muted/80",
      },
      size: {
        sm: "h-3",
        default: "h-4",
        lg: "h-6",
        xl: "h-8",
        "2xl": "h-12",
      },
      animation: {
        default: "animate-pulse",
        shimmer: "animate-shimmer",
        wave: "animate-wave",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "default",
    },
  }
)

function Skeleton({
  className,
  variant,
  size,
  animation,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof skeletonVariants>) {
  return (
    <div
      className={cn(skeletonVariants({ variant, size, animation, className }))}
      {...props}
    />
  )
}

// Predefined skeleton components
const SkeletonText = ({
  lines = 1,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { lines?: number }) => {
  return (
    <div className="space-y-2" {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            i === lines - 1 ? "w-3/4" : "w-full",
            className
          )}
        />
      ))}
    </div>
  )
}

const SkeletonAvatar = ({
  size = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { size?: "sm" | "default" | "lg" | "xl" }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  return (
    <Skeleton
      className={cn("rounded-full", sizeClasses[size], className)}
      {...props}
    />
  )
}

const SkeletonCard = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="space-y-3" {...props}>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}

const SkeletonTable = ({
  rows = 5,
  columns = 4,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { rows?: number; columns?: number }) => {
  return (
    <div className="space-y-3" {...props}>
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

const SkeletonList = ({
  items = 3,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { items?: number }) => {
  return (
    <div className="space-y-4" {...props}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <SkeletonAvatar size="sm" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

// CardSkeleton component for card-like loading states
const CardSkeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("rounded-lg border bg-card p-6 space-y-4", className)} {...props}>
      <div className="flex items-center space-x-4">
        <SkeletonAvatar size="lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}

// SkeletonGroup component for grouping multiple skeletons
const SkeletonGroup = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {children}
    </div>
  )
}

export {
  CardSkeleton, Skeleton, SkeletonAvatar,
  SkeletonCard, SkeletonGroup, SkeletonList, SkeletonTable, SkeletonText, skeletonVariants
}
