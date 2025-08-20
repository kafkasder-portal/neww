"use client"

import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  [
    // Base styles with enhanced UX
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    "transition-all duration-200 ease-out",
    // Enhanced hover effects
    "hover:text-foreground/90",
  ],
  {
    variants: {
      variant: {
        default: "text-foreground",
        primary: "text-primary",
        secondary: "text-secondary-foreground",
        muted: "text-muted-foreground",
        success: "text-green-600",
        warning: "text-orange-600",
        error: "text-red-600",
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
        xl: "text-lg",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-red-500",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      weight: "medium",
      required: false,
    },
  }
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants>
>(({ className, variant, size, weight, required, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ variant, size, weight, required, className }))}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

// Enhanced Label with description
interface LabelWithDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
  VariantProps<typeof labelVariants> {
  description?: string
  descriptionVariant?: "muted" | "error" | "success" | "warning"
}

const LabelWithDescription = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelWithDescriptionProps
>(({
  className,
  variant,
  size,
  weight,
  required,
  description,
  descriptionVariant = "muted",
  children,
  ...props
}, ref) => {
  const getDescriptionColor = () => {
    switch (descriptionVariant) {
      case "error":
        return "text-red-500"
      case "success":
        return "text-green-500"
      case "warning":
        return "text-orange-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-1">
      <Label
        ref={ref}
        className={className}
        variant={variant}
        size={size}
        weight={weight}
        required={required}
        {...props}
      >
        {children}
      </Label>
      {description && (
        <p className={cn("text-xs", getDescriptionColor())}>
          {description}
        </p>
      )}
    </div>
  )
})
LabelWithDescription.displayName = "LabelWithDescription"

export { Label, labelVariants, LabelWithDescription }

