"use client"

import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, Minus } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

const checkboxVariants = cva(
  [
    // Base styles with enhanced UX
    "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
    "transition-all duration-200 ease-out",
    // Enhanced hover effects
    "hover:border-primary/80 hover:data-[state=checked]:bg-primary/90",
    // Focus states
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        default: "border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        primary: "border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        secondary: "border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground",
        success: "border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white",
        warning: "border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:text-white",
        error: "border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white",
      },
      size: {
        sm: "h-3 w-3",
        default: "h-4 w-4",
        lg: "h-5 w-5",
        xl: "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants>
>(({ className, variant, size, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ variant, size, className }))}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-3 w-3" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

// Enhanced Checkbox with indeterminate state
interface CheckboxIndeterminateProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  VariantProps<typeof checkboxVariants> {
  indeterminate?: boolean
}

const CheckboxIndeterminate = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxIndeterminateProps
>(({ className, variant, size, indeterminate = false, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ variant, size, className }))}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      {indeterminate ? (
        <Minus className="h-3 w-3" />
      ) : (
        <Check className="h-3 w-3" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
CheckboxIndeterminate.displayName = "CheckboxIndeterminate"

// Enhanced Checkbox with label
interface CheckboxWithLabelProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  VariantProps<typeof checkboxVariants> {
  label?: string
  description?: string
  labelPosition?: "left" | "right"
}

const CheckboxWithLabel = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxWithLabelProps
>(({
  className,
  variant,
  size,
  label,
  description,
  labelPosition = "right",
  ...props
}, ref) => {
  const checkboxElement = (
    <Checkbox
      ref={ref}
      className={className}
      variant={variant}
      size={size}
      {...props}
    />
  )

  const labelElement = (
    <div className="flex flex-col space-y-1">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      {description && (
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )

  return (
    <div className="flex items-center space-x-2">
      {labelPosition === "left" && labelElement}
      {checkboxElement}
      {labelPosition === "right" && labelElement}
    </div>
  )
})
CheckboxWithLabel.displayName = "CheckboxWithLabel"

export {
  Checkbox,
  CheckboxIndeterminate, checkboxVariants, CheckboxWithLabel
}

