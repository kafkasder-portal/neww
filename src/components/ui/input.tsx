import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  [
    // Base styles with enhanced UX
    "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
    "ring-offset-background transition-all duration-200 ease-out",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    // Enhanced focus states
    "focus:border-primary/50 focus:shadow-sm",
    // Hover effects
    "hover:border-input/80",
    // Error states
    "data-[error=true]:border-destructive data-[error=true]:focus-visible:ring-destructive",
    // Success states
    "data-[success=true]:border-green-500 data-[success=true]:focus-visible:ring-green-500",
  ],
  {
    variants: {
      variant: {
        default: "border-input",
        outline: "border-2 border-input bg-transparent",
        filled: "border-input bg-muted/50",
        ghost: "border-transparent bg-transparent hover:bg-muted/50",
      },
      size: {
        default: "h-10 px-3 py-2 text-sm",
        sm: "h-8 px-2 py-1 text-xs",
        lg: "h-12 px-4 py-3 text-base",
        xl: "h-14 px-6 py-4 text-lg",
      },
      error: {
        true: "border-destructive focus-visible:ring-destructive",
        false: "",
      },
      success: {
        true: "border-green-500 focus-visible:ring-green-500",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      error: false,
      success: false,
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: boolean
  success?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    variant, 
    size, 
    error, 
    success,
    leftIcon,
    rightIcon,
    ...props 
  }, ref) => {
    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            inputVariants({ variant, size, error, success, className }),
            leftIcon && "pl-10",
            rightIcon && "pr-10"
          )}
          data-error={error}
          data-success={success}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
