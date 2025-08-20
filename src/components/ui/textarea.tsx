import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const textareaVariants = cva(
  [
    // Base styles with enhanced UX
    "flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    "transition-all duration-200 ease-out",
    // Enhanced focus states
    "focus:border-primary/50 focus:shadow-sm",
    // Hover effects
    "hover:border-input/80",
    // Error states
    "data-[error=true]:border-destructive data-[error=true]:focus-visible:ring-destructive",
    // Success states
    "data-[success=true]:border-green-500 data-[success=true]:focus-visible:ring-green-500",
    // Resize handle
    "resize-none",
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
        default: "min-h-[80px] px-3 py-2 text-sm",
        sm: "min-h-[60px] px-2 py-1 text-xs",
        lg: "min-h-[100px] px-4 py-3 text-base",
        xl: "min-h-[120px] px-6 py-4 text-lg",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
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
      resize: "none",
      error: false,
      success: false,
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  VariantProps<typeof textareaVariants> {
  error?: boolean
  success?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showCharacterCount?: boolean
  maxLength?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    variant,
    size,
    resize,
    error,
    success,
    leftIcon,
    rightIcon,
    showCharacterCount = false,
    maxLength,
    value,
    ...props
  }, ref) => {
    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-3 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <textarea
          className={cn(
            textareaVariants({ variant, size, resize, error, success, className }),
            leftIcon && "pl-10",
            rightIcon && "pr-10"
          )}
          data-error={error}
          data-success={success}
          ref={ref}
          value={value}
          maxLength={maxLength}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-3 text-muted-foreground">
            {rightIcon}
          </div>
        )}
        {showCharacterCount && maxLength && (
          <div className="mt-1 flex justify-end text-xs text-muted-foreground">
            <span className={currentLength > maxLength * 0.9 ? "text-orange-500" : ""}>
              {currentLength}/{maxLength}
            </span>
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }
