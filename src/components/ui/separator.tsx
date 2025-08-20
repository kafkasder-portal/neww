"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const separatorVariants = cva(
  [
    // Base styles with enhanced UX
    "shrink-0 bg-border",
    "transition-all duration-200 ease-out",
  ],
  {
    variants: {
      variant: {
        default: "bg-border",
        primary: "bg-primary/20",
        secondary: "bg-secondary/20",
        muted: "bg-muted",
        success: "bg-green-200",
        warning: "bg-orange-200",
        error: "bg-red-200",
        gradient: "bg-gradient-to-r from-transparent via-border to-transparent",
      },
      orientation: {
        horizontal: "h-px w-full",
        vertical: "h-full w-px",
      },
      size: {
        sm: "",
        default: "",
        lg: "",
        xl: "",
      },
    },
    compoundVariants: [
      {
        orientation: "horizontal",
        size: "sm",
        class: "h-px",
      },
      {
        orientation: "horizontal",
        size: "default",
        class: "h-px",
      },
      {
        orientation: "horizontal",
        size: "lg",
        class: "h-0.5",
      },
      {
        orientation: "horizontal",
        size: "xl",
        class: "h-1",
      },
      {
        orientation: "vertical",
        size: "sm",
        class: "w-px",
      },
      {
        orientation: "vertical",
        size: "default",
        class: "w-px",
      },
      {
        orientation: "vertical",
        size: "lg",
        class: "w-0.5",
      },
      {
        orientation: "vertical",
        size: "xl",
        class: "w-1",
      },
    ],
    defaultVariants: {
      variant: "default",
      orientation: "horizontal",
      size: "default",
    },
  }
)

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> &
    VariantProps<typeof separatorVariants>
>(({ className, orientation = "horizontal", variant, size, decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(separatorVariants({ variant, orientation, size, className }))}
    {...props}
  />
))
Separator.displayName = SeparatorPrimitive.Root.displayName

// Enhanced Separator with text
interface SeparatorWithTextProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>,
    VariantProps<typeof separatorVariants> {
  text?: string
  textPosition?: "left" | "center" | "right"
  textVariant?: "muted" | "primary" | "secondary"
}

const SeparatorWithText = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorWithTextProps
>(({ 
  className, 
  variant, 
  size, 
  text, 
  textPosition = "center",
  textVariant = "muted",
  ...props 
}, ref) => {
  const getTextColor = () => {
    switch (textVariant) {
      case "primary":
        return "text-primary"
      case "secondary":
        return "text-secondary-foreground"
      default:
        return "text-muted-foreground"
    }
  }

  const getTextPosition = () => {
    switch (textPosition) {
      case "left":
        return "justify-start"
      case "right":
        return "justify-end"
      default:
        return "justify-center"
    }
  }

  return (
    <div className={cn("flex items-center space-x-2", getTextPosition())}>
      <Separator
        ref={ref}
        className={cn("flex-1", className)}
        variant={variant}
        size={size}
        {...props}
      />
      {text && (
        <span className={cn("px-2 text-xs font-medium", getTextColor())}>
          {text}
        </span>
      )}
      <Separator
        className="flex-1"
        variant={variant}
        size={size}
      />
    </div>
  )
})
SeparatorWithText.displayName = "SeparatorWithText"

export { Separator, SeparatorWithText, separatorVariants }
