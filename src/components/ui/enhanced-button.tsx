import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Enhanced Button Component
 * Modern, accessible button with advanced animations and design system integration
 */

const enhancedButtonVariants = cva(
  [
    // Base styles
    "inline-flex items-center justify-center whitespace-nowrap font-medium",
    "ring-offset-background transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    "relative overflow-hidden",
    // Enhanced animations
    "btn-animate gpu-accelerated",
    // Accessibility
    "focus-ring",
  ],
  {
    variants: {
      variant: {
        // Primary - Brand colors
        primary: [
          "bg-gradient-to-r from-brand-primary-600 to-brand-primary-500",
          "text-white shadow-md",
          "hover:from-brand-primary-700 hover:to-brand-primary-600",
          "hover:shadow-lg hover:-translate-y-0.5",
          "active:translate-y-0 active:shadow-md",
          "focus-visible:ring-brand-primary-500",
        ],
        
        // Secondary - Success colors
        secondary: [
          "bg-gradient-to-r from-brand-secondary-600 to-brand-secondary-500",
          "text-white shadow-md",
          "hover:from-brand-secondary-700 hover:to-brand-secondary-600",
          "hover:shadow-lg hover:-translate-y-0.5",
          "active:translate-y-0 active:shadow-md",
          "focus-visible:ring-brand-secondary-500",
        ],
        
        // Accent - Orange colors
        accent: [
          "bg-gradient-to-r from-brand-accent-600 to-brand-accent-500",
          "text-white shadow-md",
          "hover:from-brand-accent-700 hover:to-brand-accent-600",
          "hover:shadow-lg hover:-translate-y-0.5",
          "active:translate-y-0 active:shadow-md",
          "focus-visible:ring-brand-accent-500",
        ],
        
        // Outline variants
        outline: [
          "border-2 border-primary bg-transparent",
          "text-primary hover:bg-interactive-hover",
          "hover:border-brand-primary-500 hover:text-brand-primary-600",
          "hover:shadow-sm hover:-translate-y-0.5",
          "focus-visible:ring-brand-primary-500",
        ],
        
        "outline-primary": [
          "border-2 border-brand-primary-500 bg-transparent",
          "text-brand-primary-600 hover:bg-brand-primary-50",
          "hover:border-brand-primary-600 hover:text-brand-primary-700",
          "hover:shadow-sm hover:-translate-y-0.5",
          "focus-visible:ring-brand-primary-500",
        ],
        
        "outline-secondary": [
          "border-2 border-brand-secondary-500 bg-transparent",
          "text-brand-secondary-600 hover:bg-brand-secondary-50",
          "hover:border-brand-secondary-600 hover:text-brand-secondary-700",
          "hover:shadow-sm hover:-translate-y-0.5",
          "focus-visible:ring-brand-secondary-500",
        ],
        
        // Ghost variants
        ghost: [
          "bg-transparent text-primary",
        "hover:bg-interactive-hover hover:text-primary",
          "hover:-translate-y-0.5",
          "focus-visible:ring-neutral-500",
        ],
        
        "ghost-primary": [
          "bg-transparent text-brand-primary-600",
          "hover:bg-brand-primary-50 hover:text-brand-primary-700",
          "hover:-translate-y-0.5",
          "focus-visible:ring-brand-primary-500",
        ],
        
        // Soft variants
        "soft-primary": [
          "bg-brand-primary-50 text-brand-primary-700",
          "hover:bg-brand-primary-100 hover:text-brand-primary-800",
          "hover:shadow-sm hover:-translate-y-0.5",
          "focus-visible:ring-brand-primary-500",
        ],
        
        "soft-secondary": [
          "bg-brand-secondary-50 text-brand-secondary-700",
          "hover:bg-brand-secondary-100 hover:text-brand-secondary-800",
          "hover:shadow-sm hover:-translate-y-0.5",
          "focus-visible:ring-brand-secondary-500",
        ],
        
        // Semantic variants
        success: [
          "bg-semantic-success text-white shadow-md",
          "hover:bg-semantic-success/90 hover:shadow-lg",
          "hover:-translate-y-0.5",
          "focus-visible:ring-green-500",
        ],
        
        warning: [
          "bg-semantic-warning text-white shadow-md",
          "hover:bg-semantic-warning/90 hover:shadow-lg",
          "hover:-translate-y-0.5",
          "focus-visible:ring-orange-500",
        ],
        
        danger: [
          "bg-semantic-error text-white shadow-md",
          "hover:bg-semantic-error/90 hover:shadow-lg",
          "hover:-translate-y-0.5",
          "focus-visible:ring-red-500",
        ],
        
        // Link variant
        link: [
          "text-brand-primary-600 underline-offset-4",
          "hover:underline hover:text-brand-primary-700",
          "focus-visible:ring-brand-primary-500",
        ],
      },
      
      size: {
        xs: [
          "h-7 px-2 text-xs rounded-md",
          "gap-1",
        ],
        sm: [
          "h-8 px-3 text-sm rounded-md",
          "gap-1.5",
        ],
        md: [
          "h-10 px-4 text-sm rounded-lg",
          "gap-2",
        ],
        lg: [
          "h-11 px-6 text-base rounded-lg",
          "gap-2",
        ],
        xl: [
          "h-12 px-8 text-lg rounded-xl",
          "gap-2.5",
        ],
        icon: [
          "h-10 w-10 rounded-lg",
        ],
        "icon-sm": [
          "h-8 w-8 rounded-md",
        ],
        "icon-lg": [
          "h-12 w-12 rounded-xl",
        ],
      },
      
      loading: {
        true: "cursor-wait",
        false: "",
      },
      
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      loading: false,
      fullWidth: false,
    },
  }
)

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof enhancedButtonVariants> {
  asChild?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  loading?: boolean
  loadingText?: string
  fullWidth?: boolean
  tooltip?: string
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      startIcon,
      endIcon,
      loading = false,
      loadingText,
      fullWidth = false,
      children,
      disabled,
      tooltip,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading
    
    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4"
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
    
    const buttonContent = (
      <>
        {/* Start Icon or Loading Spinner */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          startIcon && (
            <span className={cn("flex-shrink-0", children && "mr-2")}>
              {startIcon}
            </span>
          )
        )}
        
        {/* Button Text */}
        {loading && loadingText ? (
          <span className="animate-pulse">{loadingText}</span>
        ) : (
          children
        )}
        
        {/* End Icon */}
        {!loading && endIcon && (
          <span className={cn("flex-shrink-0", children && "ml-2")}>
            {endIcon}
          </span>
        )}
        
        {/* Shimmer Effect */}
        <span className="absolute inset-0 -top-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12" />
      </>
    )
    
    const button = (
      <Comp
        className={cn(
          enhancedButtonVariants({
            variant,
            size,
            loading,
            fullWidth,
            className,
          }),
          "group" // For shimmer effect
        )}
        ref={ref}
        disabled={isDisabled}
        title={tooltip}
        {...props}
      >
        {buttonContent}
      </Comp>
    )
    
    return button
  }
)

EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton, enhancedButtonVariants }