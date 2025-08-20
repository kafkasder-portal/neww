import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const emptyStateVariants = cva(
  [
    // Base styles with enhanced UX
    "flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center",
    "transition-all duration-200 ease-out",
    // Enhanced hover effects
    "hover:border-border/80 hover:bg-muted/50",
  ],
  {
    variants: {
      variant: {
        default: "border-border bg-background",
        muted: "border-border bg-muted/30",
        outline: "border-2 border-border bg-transparent",
        ghost: "border-transparent bg-transparent",
      },
      size: {
        default: "p-8",
        sm: "p-6",
        lg: "p-12",
        xl: "p-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
  showIcon?: boolean
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ 
    className, 
    variant, 
    size, 
    icon, 
    title, 
    description, 
    action, 
    showIcon = true,
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(emptyStateVariants({ variant, size, className }))}
        {...props}
      >
        {showIcon && icon && (
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
            {icon}
          </div>
        )}
        
        {title && (
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            {title}
          </h3>
        )}
        
        {description && (
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        )}
        
        {action && (
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            {action}
          </div>
        )}
        
        {children}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"

// Predefined empty states
const EmptyStateSearch = React.forwardRef<HTMLDivElement, Omit<EmptyStateProps, 'icon' | 'title' | 'description'>>(
  (props, ref) => (
    <EmptyState
      ref={ref}
      icon={<SearchIcon className="h-6 w-6" />}
      title="No results found"
      description="Try adjusting your search criteria or browse our categories."
      {...props}
    />
  )
)
EmptyStateSearch.displayName = "EmptyStateSearch"

const EmptyStateNoData = React.forwardRef<HTMLDivElement, Omit<EmptyStateProps, 'icon' | 'title' | 'description'>>(
  (props, ref) => (
    <EmptyState
      ref={ref}
      icon={<DataIcon className="h-6 w-6" />}
      title="No data available"
      description="There's no data to display at the moment. Check back later or add some data."
      {...props}
    />
  )
)
EmptyStateNoData.displayName = "EmptyStateNoData"

const EmptyStateError = React.forwardRef<HTMLDivElement, Omit<EmptyStateProps, 'icon' | 'title' | 'description'>>(
  (props, ref) => (
    <EmptyState
      ref={ref}
      variant="muted"
      icon={<ErrorIcon className="h-6 w-6" />}
      title="Something went wrong"
      description="We encountered an error while loading the data. Please try again."
      {...props}
    />
  )
)
EmptyStateError.displayName = "EmptyStateError"

// Icon components
const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

const DataIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
)

const ErrorIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

export { 
  EmptyState, 
  EmptyStateSearch, 
  EmptyStateNoData, 
  EmptyStateError, 
  emptyStateVariants 
}