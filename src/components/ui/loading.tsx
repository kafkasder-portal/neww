import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const loadingVariants = cva(
  [
    // Base styles with enhanced UX
    "inline-flex items-center justify-center",
    "transition-all duration-200 ease-out",
  ],
  {
    variants: {
      variant: {
        default: "text-primary",
        primary: "text-primary",
        secondary: "text-secondary",
        muted: "text-muted-foreground",
        white: "text-white",
      },
      size: {
        sm: "h-4 w-4",
        default: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
        "2xl": "h-16 w-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  type?: "spinner" | "dots" | "pulse" | "bars" | "ring"
  text?: string
  showText?: boolean
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ 
    className, 
    variant, 
    size, 
    type = "spinner",
    text = "Loading...",
    showText = false,
    ...props 
  }, ref) => {
    const renderSpinner = () => (
      <svg
        className={cn(loadingVariants({ variant, size, className }), "animate-spin")}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )

    const renderDots = () => (
      <div className={cn("flex space-x-1", className)}>
        <div className={cn(loadingVariants({ variant, size }), "animate-bounce [animation-delay:-0.3s]")}>
          <div className="h-full w-full rounded-full bg-current" />
        </div>
        <div className={cn(loadingVariants({ variant, size }), "animate-bounce [animation-delay:-0.15s]")}>
          <div className="h-full w-full rounded-full bg-current" />
        </div>
        <div className={cn(loadingVariants({ variant, size }), "animate-bounce")}>
          <div className="h-full w-full rounded-full bg-current" />
        </div>
      </div>
    )

    const renderPulse = () => (
      <div className={cn(loadingVariants({ variant, size, className }), "animate-pulse")}>
        <div className="h-full w-full rounded-full bg-current" />
      </div>
    )

    const renderBars = () => (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              loadingVariants({ variant, size }),
              "animate-pulse bg-current",
              "h-full w-1 rounded-full"
            )}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    )

    const renderRing = () => (
      <div className={cn(loadingVariants({ variant, size, className }), "relative")}>
        <div className="absolute inset-0 rounded-full border-2 border-current border-t-transparent animate-spin" />
      </div>
    )

    const renderLoader = () => {
      switch (type) {
        case "dots":
          return renderDots()
        case "pulse":
          return renderPulse()
        case "bars":
          return renderBars()
        case "ring":
          return renderRing()
        default:
          return renderSpinner()
      }
    }

    return (
      <div
        ref={ref}
        className="flex flex-col items-center justify-center space-y-2"
        role="status"
        aria-label="Loading"
        {...props}
      >
        {renderLoader()}
        {showText && text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    )
  }
)
Loading.displayName = "Loading"

// Loading overlay component
interface LoadingOverlayProps extends LoadingProps {
  overlay?: boolean
  blur?: boolean
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ 
    overlay = true, 
    blur = true, 
    className, 
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative",
          overlay && "min-h-[200px]",
          className
        )}
      >
        {children}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            overlay && "bg-background/80",
            blur && "backdrop-blur-sm"
          )}
        >
          <Loading {...props} />
        </div>
      </div>
    )
  }
)
LoadingOverlay.displayName = "LoadingOverlay"

// Loading skeleton component
interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  lines?: number
  height?: string
}

const LoadingSkeleton = React.forwardRef<HTMLDivElement, LoadingSkeletonProps>(
  ({ className, lines = 1, height = "h-4", ...props }, ref) => {
    return (
      <div ref={ref} className="space-y-2" {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "animate-pulse rounded bg-muted",
              height,
              className
            )}
          />
        ))}
      </div>
    )
  }
)
LoadingSkeleton.displayName = "LoadingSkeleton"

export { Loading, LoadingOverlay, LoadingSkeleton, loadingVariants }
