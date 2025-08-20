import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const progressVariants = cva(
  [
    // Base styles with enhanced UX
    "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
    "transition-all duration-300 ease-out",
  ],
  {
    variants: {
      variant: {
        default: "bg-secondary",
        primary: "bg-primary/20",
        success: "bg-green-100",
        warning: "bg-orange-100",
        error: "bg-red-100",
      },
      size: {
        sm: "h-2",
        default: "h-4",
        lg: "h-6",
        xl: "h-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const progressIndicatorVariants = cva(
  [
    // Base styles with enhanced UX
    "h-full w-full flex-1 transition-all duration-300 ease-out",
    "bg-primary",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary",
        primary: "bg-primary",
        success: "bg-green-500",
        warning: "bg-orange-500",
        error: "bg-red-500",
      },
      animated: {
        true: "animate-pulse",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      animated: false,
    },
  }
)

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  showValue?: boolean
  showLabel?: boolean
  label?: string
  animated?: boolean
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ 
  className, 
  variant, 
  size, 
  value, 
  showValue = false,
  showLabel = false,
  label,
  animated = false,
  ...props 
}, ref) => (
  <div className="w-full">
    {(showLabel || label) && (
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          {label || "Progress"}
        </span>
        {showValue && (
          <span className="text-sm text-muted-foreground">
            {value ? Math.round(value) : 0}%
          </span>
        )}
      </div>
    )}
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(progressVariants({ variant, size, className }))}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(progressIndicatorVariants({ variant, animated }))}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

// Circular Progress Component
interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  size?: number
  strokeWidth?: number
  variant?: VariantProps<typeof progressIndicatorVariants>["variant"]
  showValue?: boolean
  animated?: boolean
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  ({ 
    className, 
    value = 0, 
    size = 40, 
    strokeWidth = 4, 
    variant = "default",
    showValue = false,
    animated = false,
    ...props 
  }, ref) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (value / 100) * circumference

    const getVariantColor = () => {
      switch (variant) {
        case "success":
          return "stroke-green-500"
        case "warning":
          return "stroke-orange-500"
        case "error":
          return "stroke-red-500"
        default:
          return "stroke-primary"
      }
    }

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn(
              getVariantColor(),
              "transition-all duration-300 ease-out",
              animated && "animate-pulse"
            )}
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-foreground">
              {Math.round(value)}%
            </span>
          </div>
        )}
      </div>
    )
  }
)
CircularProgress.displayName = "CircularProgress"

export { Progress, CircularProgress, progressVariants, progressIndicatorVariants }
