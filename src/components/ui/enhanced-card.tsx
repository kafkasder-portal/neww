import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Enhanced Card Component
 * Modern, interactive card with advanced animations and design system integration
 */

const enhancedCardVariants = cva(
  [
    // Base styles
    "relative overflow-hidden rounded-lg border transition-all duration-300 ease-out",
    "bg-background text-foreground",
    // Enhanced animations
    "card-animate gpu-accelerated",
    // Accessibility
    "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary-500",
  ],
  {
    variants: {
      variant: {
        // Default card
        default: [
          "border-border-primary bg-background shadow-sm",
          "hover:shadow-md hover:-translate-y-1",
        ],
        
        // Interactive card (clickable)
        interactive: [
          "border-border-primary bg-background shadow-sm cursor-pointer",
          "hover:shadow-lg hover:-translate-y-2 hover:border-brand-primary-300",
          "active:translate-y-0 active:shadow-md",
          "transition-all duration-200",
        ],
        
        // Elevated card
        elevated: [
          "border-border-secondary bg-background shadow-md",
          "hover:shadow-xl hover:-translate-y-2",
        ],
        
        // Outlined card
        outlined: [
          "border-2 border-border-primary bg-background shadow-none",
          "hover:border-brand-primary-400 hover:shadow-sm hover:-translate-y-1",
        ],
        
        // Filled variants
        "filled-primary": [
          "border-brand-primary-500 bg-brand-primary-50 shadow-sm",
          "hover:bg-brand-primary-100 hover:shadow-md hover:-translate-y-1",
        ],
        
        "filled-secondary": [
          "border-brand-secondary-500 bg-brand-secondary-50 shadow-sm",
          "hover:bg-brand-secondary-100 hover:shadow-md hover:-translate-y-1",
        ],
        
        "filled-accent": [
          "border-brand-accent-500 bg-brand-accent-50 shadow-sm",
          "hover:bg-brand-accent-100 hover:shadow-md hover:-translate-y-1",
        ],
        
        // Semantic variants
        success: [
          "border-semantic-success bg-green-50 shadow-sm",
          "hover:bg-green-100 hover:shadow-md hover:-translate-y-1",
        ],
        
        warning: [
          "border-semantic-warning bg-orange-50 shadow-sm",
          "hover:bg-orange-100 hover:shadow-md hover:-translate-y-1",
        ],
        
        error: [
          "border-semantic-error bg-red-50 shadow-sm",
          "hover:bg-red-100 hover:shadow-md hover:-translate-y-1",
        ],
        
        info: [
          "border-semantic-info bg-blue-50 shadow-sm",
          "hover:bg-blue-100 hover:shadow-md hover:-translate-y-1",
        ],
        
        // Glass effect
        glass: [
          "border-white/20 bg-white/10 backdrop-blur-md shadow-lg",
          "hover:bg-white/20 hover:shadow-xl hover:-translate-y-1",
        ],
        
        // Gradient variants
        "gradient-primary": [
          "border-transparent bg-gradient-to-br from-brand-primary-50 to-brand-primary-100 shadow-md",
          "hover:from-brand-primary-100 hover:to-brand-primary-200 hover:shadow-lg hover:-translate-y-1",
        ],
        
        "gradient-secondary": [
          "border-transparent bg-gradient-to-br from-brand-secondary-50 to-brand-secondary-100 shadow-md",
          "hover:from-brand-secondary-100 hover:to-brand-secondary-200 hover:shadow-lg hover:-translate-y-1",
        ],
      },
      
      size: {
        sm: "p-4",
        md: "p-6 bg-card rounded-lg border",
        lg: "p-8",
        xl: "p-10",
      },
      
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6 bg-card rounded-lg border",
        lg: "p-8",
        xl: "p-10",
      },
      
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      rounded: "lg",
    },
  }
)

const enhancedCardHeaderVariants = cva(
  "flex flex-col space-y-1.5",
  {
    variants: {
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6 bg-card rounded-lg border",
        lg: "p-8",
      },
    },
    defaultVariants: {
      padding: "md",
    },
  }
)

const enhancedCardContentVariants = cva(
  "",
  {
    variants: {
      padding: {
        none: "p-0",
        sm: "p-4 pt-0",
        md: "p-6 bg-card rounded-lg border pt-0",
        lg: "p-8 pt-0",
      },
    },
    defaultVariants: {
      padding: "md",
    },
  }
)

const enhancedCardFooterVariants = cva(
  "flex items-center",
  {
    variants: {
      padding: {
        none: "p-0",
        sm: "p-4 pt-0",
        md: "p-6 bg-card rounded-lg border pt-0",
        lg: "p-8 pt-0",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
      },
    },
    defaultVariants: {
      padding: "md",
      justify: "start",
    },
  }
)

export interface EnhancedCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedCardVariants> {
  asChild?: boolean
  interactive?: boolean
  loading?: boolean
}

export interface EnhancedCardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedCardHeaderVariants> {}

export interface EnhancedCardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedCardContentVariants> {}

export interface EnhancedCardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedCardFooterVariants> {}

export interface EnhancedCardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

export interface EnhancedCardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

// Main Card Component
const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  (
    {
      className,
      variant,
      size,
      padding,
      rounded,
      interactive = false,
      loading = false,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const cardVariant = interactive ? "interactive" : variant
    
    return (
      <div
        ref={ref}
        className={cn(
          enhancedCardVariants({
            variant: cardVariant,
            size: padding ? undefined : size,
            rounded,
            className,
          }),
          padding && `p-${padding}`,
          loading && "animate-pulse",
          interactive && "group"
        )}
        onClick={onClick}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        {...props}
      >
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-neutral-200 rounded animate-pulse" />
            <div className="h-4 bg-neutral-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-neutral-200 rounded animate-pulse w-1/2" />
          </div>
        ) : (
          children
        )}
        
        {/* Shimmer Effect for Interactive Cards */}
        {interactive && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 pointer-events-none" />
        )}
      </div>
    )
  }
)
EnhancedCard.displayName = "EnhancedCard"

// Card Header Component
const EnhancedCardHeader = React.forwardRef<HTMLDivElement, EnhancedCardHeaderProps>(
  ({ className, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(enhancedCardHeaderVariants({ padding, className }))}
      {...props}
    />
  )
)
EnhancedCardHeader.displayName = "EnhancedCardHeader"

// Card Title Component
const EnhancedCardTitle = React.forwardRef<HTMLHeadingElement, EnhancedCardTitleProps>(
  ({ className, as: Comp = "h3", ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(
        "text-xl font-semibold leading-none tracking-tight text-text-primary",
        className
      )}
      {...props}
    />
  )
)
EnhancedCardTitle.displayName = "EnhancedCardTitle"

// Card Description Component
const EnhancedCardDescription = React.forwardRef<HTMLParagraphElement, EnhancedCardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-text-secondary leading-relaxed", className)}
      {...props}
    />
  )
)
EnhancedCardDescription.displayName = "EnhancedCardDescription"

// Card Content Component
const EnhancedCardContent = React.forwardRef<HTMLDivElement, EnhancedCardContentProps>(
  ({ className, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(enhancedCardContentVariants({ padding, className }))}
      {...props}
    />
  )
)
EnhancedCardContent.displayName = "EnhancedCardContent"

// Card Footer Component
const EnhancedCardFooter = React.forwardRef<HTMLDivElement, EnhancedCardFooterProps>(
  ({ className, padding, justify, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(enhancedCardFooterVariants({ padding, justify, className }))}
      {...props}
    />
  )
)
EnhancedCardFooter.displayName = "EnhancedCardFooter"

export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardFooter,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
  enhancedCardVariants,
}