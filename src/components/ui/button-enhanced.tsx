import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  // Base classes with enhanced styling
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        // Primary brand button
        default: "bg-brand-primary text-white hover:bg-brand-primary/90 focus-visible:ring-brand-primary shadow-sm hover:shadow-md active:scale-[0.98]",
        
        // Enhanced destructive button
        destructive: "bg-semantic-danger text-white hover:bg-semantic-danger/90 focus-visible:ring-semantic-danger shadow-sm hover:shadow-md active:scale-[0.98]",
        
        // Outline variant with better contrast
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-brand-primary shadow-sm",
        
        // Secondary variant
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-neutral-400 shadow-sm",
        
        // Ghost variant with subtle hover
        ghost: "hover:bg-accent hover:text-accent-foreground focus-visible:ring-brand-primary",
        
        // Link variant
        link: "text-brand-primary underline-offset-4 hover:underline focus-visible:ring-brand-primary",
        
        // Success button
        success: "bg-semantic-success text-white hover:bg-semantic-success/90 focus-visible:ring-semantic-success shadow-sm hover:shadow-md active:scale-[0.98]",
        
        // Warning button
        warning: "bg-semantic-warning text-white hover:bg-semantic-warning/90 focus-visible:ring-semantic-warning shadow-sm hover:shadow-md active:scale-[0.98]",
        
        // Info button
        info: "bg-semantic-info text-white hover:bg-semantic-info/90 focus-visible:ring-semantic-info shadow-sm hover:shadow-md active:scale-[0.98]",
        
        // Soft variants for less emphasis
        "soft-primary": "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 focus-visible:ring-brand-primary",
        "soft-success": "bg-semantic-success/10 text-semantic-success hover:bg-semantic-success/20 focus-visible:ring-semantic-success",
        "soft-warning": "bg-semantic-warning/10 text-semantic-warning hover:bg-semantic-warning/20 focus-visible:ring-semantic-warning",
        "soft-danger": "bg-semantic-danger/10 text-semantic-danger hover:bg-semantic-danger/20 focus-visible:ring-semantic-danger",
        "soft-info": "bg-semantic-info/10 text-semantic-info hover:bg-semantic-info/20 focus-visible:ring-semantic-info",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    icon,
    iconPosition = "left",
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const isDisabled = disabled || loading;
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
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
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!loading && icon && iconPosition === "left" && (
          <span className="mr-2">{icon}</span>
        )}
        
        {children}
        
        {!loading && icon && iconPosition === "right" && (
          <span className="ml-2">{icon}</span>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

// Button Group Component for related actions
export interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
  variant?: "attached" | "separated"
  size?: "sm" | "default" | "lg"
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ children, className, variant = "attached", size = "default" }, ref) => {
    const groupClasses = cn(
      "inline-flex",
      variant === "attached" && "rounded-md shadow-sm",
      variant === "separated" && "space-x-2",
      className
    )

    if (variant === "attached") {
      return (
        <div ref={ref} className={groupClasses}>
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child)) {
              const isFirst = index === 0
              const isLast = index === React.Children.count(children) - 1
              
              return React.cloneElement(child, {
                className: cn(
                  child.props.className,
                  !isFirst && !isLast && "rounded-none border-l-0",
                  isFirst && "rounded-r-none",
                  isLast && "rounded-l-none border-l-0",
                  "focus:z-10"
                ),
              })
            }
            return child
          })}
        </div>
      )
    }

    return (
      <div ref={ref} className={groupClasses}>
        {children}
      </div>
    )
  }
)
ButtonGroup.displayName = "ButtonGroup"

export { Button, ButtonGroup, buttonVariants }
