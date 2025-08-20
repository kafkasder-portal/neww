import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    // Base styles with enhanced UX
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium",
    "ring-offset-background transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    "relative overflow-hidden transform-gpu",
    // Enhanced hover effects
    "hover:scale-[1.02] active:scale-[0.98]",
    // Loading state
    "data-[loading=true]:opacity-70 data-[loading=true]:cursor-wait",
  ],
  {
    variants: {
      variant: {
        // Primary with gradient
        default: [
          "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md",
          "hover:from-primary/90 hover:to-primary/80 hover:shadow-lg",
          "active:shadow-md",
        ],
        // Destructive with enhanced styling
        destructive: [
          "bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground shadow-md",
          "hover:from-destructive/90 hover:to-destructive/80 hover:shadow-lg",
          "active:shadow-md",
        ],
        // Soft destructive
        'soft-destructive': [
          'bg-destructive/10 text-destructive border border-destructive/20',
          'hover:bg-destructive/20 hover:border-destructive/30',
        ],
        // Outline with enhanced interactions
        outline: [
          "border-2 border-input bg-background/50 backdrop-blur-sm",
          "hover:bg-accent hover:text-accent-foreground hover:border-primary/50",
          "focus-visible:border-primary",
        ],
        // Secondary with subtle gradient
        secondary: [
          "bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground shadow-sm",
          "hover:from-secondary/90 hover:to-secondary/80 hover:shadow-md",
        ],
        // Ghost with smooth transitions
        ghost: [
          "hover:bg-accent hover:text-accent-foreground",
          "hover:shadow-sm",
        ],
        // Link with enhanced underline
        link: [
          "text-primary underline-offset-4 hover:underline",
          "hover:text-primary/80",
        ],
        // Soft primary
        'soft-primary': [
          'bg-primary/10 text-primary border border-primary/20',
          'hover:bg-primary/20 hover:border-primary/30',
        ],
        // Success with gradient
        success: [
          'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md',
          'hover:from-green-700 hover:to-green-600 hover:shadow-lg',
        ],
        // Warning variant
        warning: [
          'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md',
          'hover:from-orange-700 hover:to-orange-600 hover:shadow-lg',
        ],
        // Info variant
        info: [
          'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md',
          'hover:from-blue-700 hover:to-blue-600 hover:shadow-lg',
        ],
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 py-1 text-xs",
        lg: "h-12 px-6 py-3 text-base",
        xl: "h-14 px-8 py-4 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
      loading: {
        true: "cursor-wait",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading = false,
    loadingText,
    asChild = false, 
    startIcon, 
    endIcon, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, loading, className }))}
        ref={ref}
        disabled={isDisabled}
        data-loading={loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
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
            {loadingText || children}
          </>
        ) : (
          <>
            {startIcon && <span className="mr-2 flex-shrink-0">{startIcon}</span>}
            {children}
            {endIcon && <span className="ml-2 flex-shrink-0">{endIcon}</span>}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
