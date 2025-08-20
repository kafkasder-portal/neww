"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const tooltipVariants = cva(
  [
    // Base styles with enhanced UX
    "z-50 overflow-hidden rounded-md border px-3 py-1.5 text-sm shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    "transition-all duration-200 ease-out",
    "backdrop-blur-sm",
  ],
  {
    variants: {
      variant: {
        default: "bg-popover text-popover-foreground border-border",
        primary: "bg-primary text-primary-foreground border-primary/20",
        secondary: "bg-secondary text-secondary-foreground border-secondary/20",
        destructive: "bg-destructive text-destructive-foreground border-destructive/20",
        success: "bg-green-500 text-white border-green-500/20",
        warning: "bg-orange-500 text-white border-orange-500/20",
        info: "bg-blue-500 text-white border-blue-500/20",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        default: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> &
    VariantProps<typeof tooltipVariants>
>(({ className, sideOffset = 4, variant, size, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(tooltipVariants({ variant, size, className }))}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// Enhanced Tooltip with arrow
interface TooltipWithArrowProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipVariants> {
  showArrow?: boolean
}

const TooltipWithArrow = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipWithArrowProps
>(({ className, sideOffset = 4, variant, size, showArrow = true, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(tooltipVariants({ variant, size, className }))}
    {...props}
  >
    {props.children}
    {showArrow && (
      <TooltipPrimitive.Arrow className="fill-current" />
    )}
  </TooltipPrimitive.Content>
))
TooltipWithArrow.displayName = "TooltipWithArrow"

export { 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider, 
  TooltipWithArrow,
  tooltipVariants 
}
