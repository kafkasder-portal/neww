"use client"

import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const popoverContentVariants = cva(
  [
    // Base styles with enhanced UX
    "z-50 w-72 rounded-lg border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    "transition-all duration-200 ease-out",
    "backdrop-blur-sm bg-popover/95",
  ],
  {
    variants: {
      variant: {
        default: "border-border bg-popover",
        primary: "border-primary/20 bg-primary/5",
        secondary: "border-secondary/20 bg-secondary/5",
        outline: "border-2 border-border bg-background",
        glass: "border-white/20 bg-white/10 backdrop-blur-md",
      },
      size: {
        sm: "w-48 p-3",
        default: "w-72 p-4",
        lg: "w-96 p-6",
        xl: "w-[28rem] p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> &
  VariantProps<typeof popoverContentVariants>
>(({ className, variant, size, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(popoverContentVariants({ variant, size, className }))}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

// Enhanced Popover with arrow
interface PopoverWithArrowProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
  VariantProps<typeof popoverContentVariants> {
  showArrow?: boolean
}

const PopoverWithArrow = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverWithArrowProps
>(({
  className,
  variant,
  size,
  align = "center",
  sideOffset = 4,
  showArrow = true,
  children,
  ...props
}, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(popoverContentVariants({ variant, size, className }))}
      {...props}
    >
      {children}
      {showArrow && (
        <PopoverPrimitive.Arrow className="fill-current" />
      )}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
))
PopoverWithArrow.displayName = "PopoverWithArrow"

export { Popover, PopoverContent, popoverContentVariants, PopoverTrigger, PopoverWithArrow }

