"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const scrollAreaVariants = cva(
  [
    // Base styles with enhanced UX
    "relative overflow-hidden",
    "transition-all duration-200 ease-out",
  ],
  {
    variants: {
      variant: {
        default: "",
        bordered: "border border-border rounded-lg",
        outlined: "border-2 border-border rounded-lg",
        ghost: "",
      },
      size: {
        sm: "max-h-32",
        default: "max-h-64",
        lg: "max-h-96",
        xl: "max-h-[32rem]",
        full: "h-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> &
    VariantProps<typeof scrollAreaVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn(scrollAreaVariants({ variant, size, className }))}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const scrollBarVariants = cva(
  [
    // Base styles with enhanced UX
    "flex touch-none select-none transition-colors",
    "hover:bg-border/80",
    "data-[orientation=vertical]:h-full data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:border-l data-[orientation=horizontal]:border-l-transparent data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-t-border",
  ],
  {
    variants: {
      variant: {
        default: "bg-border/50",
        primary: "bg-primary/20 hover:bg-primary/30",
        secondary: "bg-secondary/20 hover:bg-secondary/30",
        muted: "bg-muted/50 hover:bg-muted/70",
      },
      size: {
        sm: "w-1.5",
        default: "w-2.5",
        lg: "w-3",
        xl: "w-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> &
    VariantProps<typeof scrollBarVariants>
>(({ className, variant, size, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(scrollBarVariants({ variant, size, className }))}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

// Enhanced ScrollArea with custom scrollbar
interface ScrollAreaCustomProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>,
    VariantProps<typeof scrollAreaVariants> {
  showScrollbar?: boolean
  scrollbarVariant?: VariantProps<typeof scrollBarVariants>["variant"]
  scrollbarSize?: VariantProps<typeof scrollBarVariants>["size"]
}

const ScrollAreaCustom = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaCustomProps
>(({ 
  className, 
  variant, 
  size, 
  showScrollbar = true,
  scrollbarVariant,
  scrollbarSize,
  children,
  ...props 
}, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn(scrollAreaVariants({ variant, size, className }))}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    {showScrollbar && (
      <ScrollBar variant={scrollbarVariant} size={scrollbarSize} />
    )}
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollAreaCustom.displayName = "ScrollAreaCustom"

export { 
  ScrollArea, 
  ScrollBar, 
  ScrollAreaCustom,
  scrollAreaVariants,
  scrollBarVariants
}
